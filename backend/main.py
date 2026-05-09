import json
import os
import re
import uuid
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import anthropic
from scraper import (
    RedditScraper, HackerNewsScraper, ProductHuntScraper, IndieHackersScraper,
    PROBLEM_SUBREDDITS, REVENUE_SUBREDDITS, HN_PROBLEM_QUERIES, HN_REVENUE_QUERIES,
)

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
reddit = RedditScraper()
hn = HackerNewsScraper()
ph = ProductHuntScraper()
ih = IndieHackersScraper()
_ideas_cache: list = []


def _extract_amount(text: str) -> str:
    patterns = [
        r"\$[\d,]+[kKmM]?\s*(?:MRR|ARR|\/month|per month)?",
        r"[\d,]+[kKmM]?\s*(?:MRR|ARR)",
    ]
    for pat in patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            return m.group(0).strip()
    return "Revenue mentioned"


def _scrape_reddit_problems():
    posts = []
    for sub in PROBLEM_SUBREDDITS:
        posts.extend(reddit.get_problem_posts(sub))
    return posts


def _scrape_reddit_revenue():
    posts = []
    for sub in REVENUE_SUBREDDITS:
        posts.extend(reddit.get_revenue_posts(sub))
    return posts


def _scrape_hn_problems():
    posts = []
    for q in HN_PROBLEM_QUERIES:
        posts.extend(hn.search(q))
    posts.extend(hn.get_ask_hn())
    return posts


def _scrape_hn_revenue():
    posts = []
    for q in HN_REVENUE_QUERIES:
        posts.extend(hn.search(q))
    posts.extend(hn.get_show_hn())
    return posts


def _scrape_producthunt():
    return ph.get_recent_launches()


def _scrape_indiehackers():
    return ih.get_revenue_stories()


def _analyze_post(post: dict, revenue_posts: list) -> dict | None:
    title = post["title"]
    body = post["body"][:800]
    source_label = post.get("source_label", post.get("subreddit", "unknown"))

    revenue_context = "\n".join(
        f"- {r['title'][:120]} (upvotes: {r['score']})"
        for r in revenue_posts[:5]
    )

    prompt = f"""You are a startup idea analyst. Analyze this post and extract a business opportunity.

SOURCE: {source_label}
POST TITLE: {title}
POST BODY: {body}

REVENUE PROOF POSTS (showing similar ideas make money):
{revenue_context if revenue_context else "None found"}

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{{
  "title": "Clean 5-8 word title of the business idea",
  "problem": "1-2 sentence plain English description of the problem",
  "solution": "1-2 sentence description of what product could solve this",
  "market_size": "small",
  "competition": "low",
  "difficulty": "easy",
  "score": 75,
  "tags": ["SaaS", "B2B"]
}}

Rules:
- market_size must be exactly: small | medium | large
- competition must be exactly: low | medium | high
- difficulty must be exactly: easy | medium | hard
- score is 0-100 integer (higher = better opportunity)
- tags: 2-4 relevant tags like SaaS, B2B, B2C, API, automation, mobile, marketplace, etc
- If this post is not about a real problem or business opportunity, return {{"skip": true}}"""

    try:
        msg = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = msg.content[0].text.strip()
        data = json.loads(raw)
        if data.get("skip"):
            return None

        revenue_proof = []
        for r in revenue_posts[:3]:
            amount = _extract_amount(r["title"] + " " + r["body"])
            revenue_proof.append({
                "title": r["title"][:100],
                "amount": amount,
                "url": r["url"],
                "upvotes": r["score"],
            })

        return {
            "id": str(uuid.uuid4()),
            "title": data.get("title", title[:60]),
            "problem": data.get("problem", ""),
            "solution": data.get("solution", ""),
            "market_size": data.get("market_size", "medium"),
            "competition": data.get("competition", "medium"),
            "difficulty": data.get("difficulty", "medium"),
            "score": int(data.get("score", 50)),
            "revenue_proof": revenue_proof,
            "source_post": {
                "title": post["title"][:100],
                "url": post["url"],
                "upvotes": post["score"],
                "subreddit": post.get("subreddit", source_label),
                "source": post.get("source", "reddit"),
                "source_label": source_label,
                "permalink": post.get("permalink", post.get("url", "")),
            },
            "tags": data.get("tags", []),
        }
    except Exception as e:
        print(f"[analyze] error: {e}")
        return None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/ideas")
def get_ideas():
    return {"ideas": _ideas_cache}


@app.post("/scan")
def scan():
    global _ideas_cache

    scrapers = {
        "reddit_problems": _scrape_reddit_problems,
        "reddit_revenue": _scrape_reddit_revenue,
        "hn_problems": _scrape_hn_problems,
        "hn_revenue": _scrape_hn_revenue,
        "producthunt": _scrape_producthunt,
        "indiehackers": _scrape_indiehackers,
    }

    results = {k: [] for k in scrapers}
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(fn): key for key, fn in scrapers.items()}
        for future in as_completed(futures):
            key = futures[future]
            try:
                results[key] = future.result()
            except Exception as e:
                print(f"[scan] {key} failed: {e}")

    problem_posts = results["reddit_problems"] + results["hn_problems"] + results["producthunt"]
    revenue_posts = results["reddit_revenue"] + results["hn_revenue"] + results["indiehackers"]

    seen_titles = set()
    unique_posts = []
    for p in problem_posts:
        key = p["title"].lower()[:60]
        if key not in seen_titles and p["title"]:
            seen_titles.add(key)
            unique_posts.append(p)

    ideas = []
    for post in unique_posts[:20]:
        idea = _analyze_post(post, revenue_posts)
        if idea:
            ideas.append(idea)

    ideas.sort(key=lambda x: x["score"], reverse=True)
    _ideas_cache = ideas
    return {"ideas": ideas}
