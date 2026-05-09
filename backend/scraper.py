import time
import requests
import xml.etree.ElementTree as ET
from urllib.parse import quote

HEADERS = {"User-Agent": "IdeaHunter/1.0 (open source project)"}

PROBLEM_SUBREDDITS = [
    "entrepreneur", "startups", "SaaS", "smallbusiness", "nocode", "webdev"
]

REVENUE_SUBREDDITS = ["SaaS", "entrepreneur", "startups"]

PROBLEM_KEYWORDS = [
    "i wish there was", "why doesn't", "i hate that", "nobody has built",
    "there's no good tool", "i can't find", "does anyone know a tool",
    "looking for a solution", "pain point", "frustrated with",
]

REVENUE_KEYWORDS = [
    "mrr", "arr", "revenue", "making $", "earning $", "profitable",
    "$/month", "per month",
]

HN_PROBLEM_QUERIES = [
    "I wish there was a tool",
    "pain point startup",
    "nobody has built",
    "Ask HN: Is there a tool",
]

HN_REVENUE_QUERIES = [
    "making MRR SaaS",
    "revenue bootstrapped profitable",
]

PH_KEYWORDS = [
    "problem", "solution", "automate", "save time", "replace", "alternative to",
]


class RedditScraper:
    def _fetch(self, url):
        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            print(f"[reddit] fetch error {url}: {e}")
            return None

    def _post_matches(self, post, keywords):
        text = (post.get("title", "") + " " + post.get("selftext", "")).lower()
        return any(kw in text for kw in keywords)

    def _normalize(self, post, subreddit):
        return {
            "title": post.get("title", ""),
            "body": post.get("selftext", ""),
            "url": "https://reddit.com" + post.get("permalink", ""),
            "score": post.get("score", 0),
            "comments": post.get("num_comments", 0),
            "subreddit": f"r/{subreddit}",
            "source": "reddit",
            "source_label": f"r/{subreddit}",
            "created_utc": post.get("created_utc", 0),
            "permalink": post.get("permalink", ""),
        }

    def get_problem_posts(self, subreddit, time_filter="week", limit=100):
        url = f"https://www.reddit.com/r/{subreddit}/top.json?limit={limit}&t={time_filter}"
        data = self._fetch(url)
        time.sleep(1)
        if not data:
            return []
        posts = []
        for child in data.get("data", {}).get("children", []):
            p = child.get("data", {})
            if self._post_matches(p, PROBLEM_KEYWORDS):
                posts.append(self._normalize(p, subreddit))
        return posts

    def get_revenue_posts(self, subreddit, time_filter="month", limit=100):
        url = f"https://www.reddit.com/r/{subreddit}/top.json?limit={limit}&t={time_filter}"
        data = self._fetch(url)
        time.sleep(1)
        if not data:
            return []
        posts = []
        for child in data.get("data", {}).get("children", []):
            p = child.get("data", {})
            if self._post_matches(p, REVENUE_KEYWORDS):
                posts.append(self._normalize(p, subreddit))
        return posts


class HackerNewsScraper:
    BASE = "https://hn.algolia.com/api/v1"

    def _fetch(self, url):
        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            print(f"[HN] fetch error: {e}")
            return None

    def _normalize(self, hit):
        obj_id = hit.get("objectID", "")
        permalink = f"https://news.ycombinator.com/item?id={obj_id}"
        return {
            "title": hit.get("title", ""),
            "body": (hit.get("story_text") or hit.get("comment_text") or "")[:800],
            "url": permalink,
            "score": hit.get("points") or 0,
            "comments": hit.get("num_comments") or 0,
            "subreddit": "HackerNews",
            "source": "hackernews",
            "source_label": "HackerNews",
            "created_utc": 0,
            "permalink": permalink,
        }

    def search(self, query, limit=50):
        url = f"{self.BASE}/search?query={quote(query)}&tags=story&hitsPerPage={limit}"
        data = self._fetch(url)
        time.sleep(0.5)
        if not data:
            return []
        return [self._normalize(h) for h in data.get("hits", []) if h.get("title")]

    def get_show_hn(self, limit=100):
        url = f"{self.BASE}/search?tags=show_hn&hitsPerPage={limit}"
        data = self._fetch(url)
        time.sleep(0.5)
        if not data:
            return []
        return [self._normalize(h) for h in data.get("hits", []) if h.get("title")]

    def get_ask_hn(self, limit=100):
        url = f"{self.BASE}/search?tags=ask_hn&hitsPerPage={limit}"
        data = self._fetch(url)
        time.sleep(0.5)
        if not data:
            return []
        return [self._normalize(h) for h in data.get("hits", []) if h.get("title")]


class ProductHuntScraper:
    FEED_URL = "https://www.producthunt.com/feed"

    def get_recent_launches(self, limit=50):
        try:
            r = requests.get(self.FEED_URL, headers=HEADERS, timeout=15)
            r.raise_for_status()
            root = ET.fromstring(r.text)
        except Exception as e:
            print(f"[PH] error: {e}")
            return []

        posts = []
        for item in root.findall(".//item")[:limit]:
            title = item.findtext("title", "")
            desc = item.findtext("description", "")
            link = item.findtext("link", "")
            text = (title + " " + desc).lower()
            if any(kw in text for kw in PH_KEYWORDS):
                posts.append({
                    "title": title,
                    "body": desc[:800],
                    "url": link,
                    "score": 0,
                    "comments": 0,
                    "subreddit": "ProductHunt",
                    "source": "producthunt",
                    "source_label": "ProductHunt",
                    "created_utc": 0,
                    "permalink": link,
                })
        return posts


class IndieHackersScraper:
    def get_revenue_stories(self, limit=50):
        try:
            url = f"https://www.indiehackers.com/api/main/stories?orderBy=createdAt&limit={limit}"
            r = requests.get(url, headers=HEADERS, timeout=15)
            r.raise_for_status()
            data = r.json()
            raw = data if isinstance(data, list) else data.get("stories", [])
            posts = []
            for story in raw:
                slug = story.get("slug") or story.get("id", "")
                posts.append({
                    "title": story.get("title", ""),
                    "body": (story.get("content") or "")[:800],
                    "url": f"https://www.indiehackers.com/post/{slug}",
                    "score": story.get("upvoteCount") or 0,
                    "comments": story.get("commentCount") or 0,
                    "subreddit": "IndieHackers",
                    "source": "indiehackers",
                    "source_label": "IndieHackers",
                    "created_utc": 0,
                    "permalink": f"https://www.indiehackers.com/post/{slug}",
                })
            return posts
        except Exception as e:
            print(f"[IH] error: {e}")
            return []
