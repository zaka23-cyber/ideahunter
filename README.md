<div align="center">

# IdeaHunter 🎯

**Stop guessing what to build. Find validated business ideas from Reddit, HackerNews, ProductHunt & IndieHackers — with real revenue proof.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Powered by Claude AI](https://img.shields.io/badge/Powered%20by-Claude%20AI-orange.svg)](https://www.anthropic.com/)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red.svg)]()

[**Live Demo**](#getting-started) · [**Report a Bug**](../../issues) · [**Request a Feature**](../../issues) · [**Contribute**](#contributing)

</div>

---

## The Problem with Finding Startup Ideas

Every week, thousands of founders waste months — sometimes years — building products nobody wants. They pick ideas based on gut feeling, copy what's already working, or spend hours manually scrolling Reddit and Twitter hoping to stumble onto an insight. The problem isn't a shortage of ideas. The problem is a shortage of *validated* ideas backed by real evidence.

IdeaHunter was built to fix this. It scans four of the internet's richest signal sources simultaneously — Reddit, HackerNews, ProductHunt, and IndieHackers — and uses Claude AI to surface the ideas that matter: real complaints from real people, paired with real revenue data from founders who are already making money in that niche.

What makes this different from a simple keyword scraper is the validation layer. Every idea IdeaHunter surfaces is cross-referenced against revenue proof posts — posts where founders publicly share their MRR, ARR, or monthly income. If someone is complaining that no tool exists for X, and five other founders are quietly making $8k/month from something adjacent to X, that's a signal worth paying attention to.

IdeaHunter is for indie hackers looking for their next project, founders evaluating market gaps before committing months of work, solopreneurs who want a data-driven starting point, and students building their first profitable product. It's free, open source, and runs entirely on your own infrastructure — just bring an Anthropic API key.

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA SOURCES                                │
│                                                                     │
│  Reddit        HackerNews    ProductHunt    IndieHackers            │
│  r/SaaS        Ask HN        RSS Feed       Revenue Stories         │
│  r/startups    Show HN       New Launches   Maker Journeys          │
│  r/webdev      Search API    ──────────     ───────────────         │
│  r/nocode      ──────────                                           │
└──────────┬──────────┬──────────────┬─────────────┬─────────────────┘
           │          │              │             │
           └──────────┴──────────────┴─────────────┘
                              │
                              ▼ (parallel, ~10-20 seconds)
                   ┌──────────────────────┐
                   │   FastAPI Backend     │
                   │   Python Scraper     │
                   │   Keyword Filters    │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   Claude Sonnet AI   │
                   │                      │
                   │  · Extracts idea     │
                   │  · Writes problem    │
                   │  · Proposes solution │
                   │  · Scores 0-100      │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │  Revenue Matching    │
                   │                      │
                   │  Links each idea     │
                   │  to revenue posts    │
                   │  from same niche     │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   React Dashboard    │
                   │                      │
                   │  · Filterable cards  │
                   │  · Score badges      │
                   │  · Revenue proof     │
                   │  · Source links      │
                   └──────────────────────┘
```

### Step by Step

1. **🔍 Parallel Scraping** — All four sources are scraped simultaneously using Python's `ThreadPoolExecutor`. Reddit problem posts, HackerNews Ask HN threads, ProductHunt RSS, and IndieHackers revenue stories all load at the same time instead of sequentially.

2. **🧹 Deduplication & Filtering** — Posts are filtered by a curated list of high-signal keywords ("I wish there was", "pain point", "nobody has built", "MRR", "profitable", etc.) and deduplicated by title to avoid redundant analysis.

3. **🤖 AI Analysis** — Each problem post is sent to Claude Sonnet along with a batch of revenue posts from the same time window. Claude extracts a clean idea title, a plain-English problem description, a proposed solution, tags, and a 0-100 opportunity score.

4. **💰 Revenue Matching** — Revenue proof posts (posts where founders share their income) are attached to each idea. IdeaHunter uses a regex-based amount extractor to pull "$4.2k MRR", "ARR of $60k", etc. from post text and surfaces them alongside the idea card.

5. **📊 Scored & Ranked Results** — Ideas are sorted by score, highest first. The dashboard lets you filter to High Score (80+), Revenue Proof, or Low Competition ideas instantly.

---

## Sources

### Reddit
**Subreddits:** `r/entrepreneur` · `r/startups` · `r/SaaS` · `r/smallbusiness` · `r/nocode` · `r/webdev`

Reddit is the richest source of raw, unfiltered frustration. Posts like *"I wish there was a tool that..."* or *"Why doesn't any product do X?"* are pure gold for founders. IdeaHunter scans the top posts from the past week for problems, and the top posts from the past month for revenue proof.

### HackerNews
**Feeds:** Ask HN · Show HN · Algolia Search API

The Hacker News community skews toward technical founders and engineers. Ask HN threads surface real workflow problems and gaps in the developer tooling market. Show HN posts reveal what people are actually building and shipping — and the comment sections are full of feature requests. IdeaHunter uses the free [Algolia HackerNews API](https://hn.algolia.com/api) — no key required.

### ProductHunt
**Feed:** Public RSS (no key needed)

ProductHunt's daily feed shows what's launching right now and why. Product descriptions that mention "automate", "replace", "alternative to", or "save time" are strong signals of active market demand. If people are launching products to solve a problem and getting upvotes, that's market validation before you've written a line of code.

### IndieHackers
**Feed:** Public stories API

IndieHackers is the best single source for revenue validation on the internet. Founders post detailed breakdowns of how they reached $1k, $5k, $10k MRR — including what problem they solved, who their customers are, and how they found them. IdeaHunter uses these as revenue proof to back up ideas found in the other sources.

---

## Features

| Feature | Description |
|---|---|
| ✅ **Revenue Validation** | Every idea is matched with real posts where founders share MRR/ARR |
| ✅ **AI Scoring (0-100)** | Claude rates each idea on market size, competition, and build difficulty |
| ✅ **Multi-Source** | Scans Reddit, HackerNews, ProductHunt, and IndieHackers simultaneously |
| ✅ **Parallel Scraping** | All sources run at the same time — results in under 60 seconds |
| ✅ **Smart Filters** | Filter by High Score 🔥, Revenue Proof 💰, or Low Competition |
| ✅ **Source Badges** | Color-coded badges show exactly where each idea came from |
| ✅ **Clickable Links** | Every idea title and revenue proof item links back to the original post |
| ✅ **100% Free & Open Source** | Bring your own Anthropic API key, no other services required |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS | Dashboard UI |
| **Backend** | Python 3.11 + FastAPI | API server & scraper orchestration |
| **AI** | Anthropic Claude Sonnet 4 | Idea analysis, scoring, and summarization |
| **Reddit** | Public JSON API (no key needed) | Problem posts and revenue posts |
| **HackerNews** | Algolia HackerNews API (free) | Technical founder discussions |
| **ProductHunt** | Public RSS Feed | Recent product launches |
| **IndieHackers** | Public API | Revenue stories |
| **Typography** | Syne + DM Sans + JetBrains Mono | Premium design system |
| **Deployment** | Vercel (frontend) + Railway (backend) | Free hosting |

---

## Getting Started

### Prerequisites

- **Python 3.11+** — [python.org](https://python.org)
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Anthropic API Key** — [console.anthropic.com](https://console.anthropic.com) (free tier available)

---

### 1. Clone the Repository

```bash
git clone https://github.com/zaka23-cyber/ideahunter.git
cd ideahunter
```

---

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure your API key
cp .env.example .env            # or just edit .env directly
```

Open `backend/.env` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-...your-key-here...
```

Start the backend server:

```bash
uvicorn main:app --reload --port 8001
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8001 (Press CTRL+C to quit)
INFO:     Started reloader process
```

Verify it's healthy:
```bash
curl http://localhost:8001/health
# → {"status":"ok"}
```

---

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in 300ms

  ➜  Local:   http://localhost:5174/
```

---

### 4. Run Your First Scan

1. Open **[http://localhost:5174](http://localhost:5174)** in your browser
2. Click **"Hunt for Ideas →"**
3. Watch the scanner cycle through all four sources in real time
4. Wait **30–60 seconds** for the AI analysis to complete
5. Browse your scored and validated idea cards

---

## API Reference

All endpoints are served from `http://localhost:8001`.

---

### `POST /scan`

Triggers a full parallel scan of all sources. Scrapes Reddit, HackerNews, ProductHunt, and IndieHackers simultaneously, then runs Claude AI analysis on each problem post found.

**Request body** (optional):
```json
{
  "time_filter": "week"
}
```

**Response:**
```json
{
  "ideas": [
    {
      "id": "a3f2c1d4-...",
      "title": "AI Invoice Reconciliation for Freelancers",
      "problem": "Freelancers spend hours manually matching invoices to bank transactions across multiple clients and currencies.",
      "solution": "A tool that connects to your bank and invoicing software, automatically matches payments to invoices, and flags discrepancies.",
      "market_size": "large",
      "competition": "medium",
      "difficulty": "medium",
      "score": 82,
      "revenue_proof": [
        {
          "title": "I built an accounting tool for freelancers and hit $4.2k MRR in 6 months",
          "amount": "$4.2k MRR",
          "url": "https://reddit.com/r/SaaS/...",
          "upvotes": 847
        }
      ],
      "source_post": {
        "title": "Why is there no tool that auto-matches invoices to bank transactions?",
        "url": "https://reddit.com/r/freelance/...",
        "upvotes": 312,
        "subreddit": "r/freelance",
        "source": "reddit",
        "source_label": "r/freelance",
        "permalink": "/r/freelance/comments/..."
      },
      "tags": ["SaaS", "B2B", "automation", "fintech"]
    }
  ]
}
```

---

### `GET /ideas`

Returns the results from the most recent scan without triggering a new one. Useful for reloading the frontend without re-running the full scan.

**Response:** Same format as `POST /scan`.

---

### `GET /health`

Health check endpoint.

**Response:**
```json
{ "status": "ok" }
```

---

## Scoring System

Each idea is scored from **0 to 100** by Claude AI based on four factors:

| Factor | Large / Low / Easy | Medium | Small / High / Hard |
|---|---|---|---|
| **Market Size** | 40 pts | 25 pts | 10 pts |
| **Competition** | 30 pts | 15 pts | 5 pts |
| **Build Difficulty** | 20 pts | 10 pts | 5 pts |
| **Revenue Proof** | +10 pts if found | — | — |
| **Maximum** | **100** | | |

### Score Tiers

| Score | Badge | Meaning |
|---|---|---|
| **80–100** | 🔥 Hot | Strong opportunity — large market, low competition, feasible build, revenue validated |
| **60–79** | ⚡ Promising | Solid opportunity with some trade-offs |
| **0–59** | ❄️ Weak | Niche market, high competition, or too difficult to build solo |

> **Note:** The scoring is AI-generated and should be used as a signal, not a definitive verdict. Always validate assumptions before committing to a build.

---

## Project Structure

```
ideahunter/
├── backend/
│   ├── main.py           # FastAPI app, /scan endpoint, Claude analysis
│   ├── scraper.py        # RedditScraper, HackerNewsScraper, ProductHuntScraper, IndieHackersScraper
│   ├── requirements.txt  # Python dependencies
│   └── .env              # ANTHROPIC_API_KEY (not committed)
│
└── frontend/
    ├── src/
    │   ├── App.jsx                    # Main layout, scan logic, stats
    │   ├── main.jsx                   # React entry point
    │   ├── index.css                  # Global styles, CSS variables, noise texture
    │   └── components/
    │       ├── IdeaCard.jsx           # Card component with all idea data
    │       ├── FilterBar.jsx          # Sticky filter bar
    │       ├── RevenueProof.jsx       # Green revenue proof block
    │       └── ScoreBadge.jsx         # 🔥 ⚡ ❄️ score pill badge
    ├── index.html                     # Google Fonts, meta tags
    ├── vite.config.js                 # Vite + React + Tailwind
    └── tailwind.config.js             # Custom colors and fonts
```

---

## Roadmap

- [ ] Daily automated scans with email digest
- [ ] Save and bookmark ideas to a personal list
- [ ] Chrome extension for in-browser Reddit/HN scanning
- [ ] Twitter / X as an additional source
- [ ] Trend detection — surface ideas gaining momentum over time
- [ ] Export ideas to CSV or Notion
- [ ] Share individual idea pages via unique URL
- [ ] Filters for niche (B2B, B2C, mobile, API, etc.)
- [ ] Side-by-side idea comparison view
- [ ] Auth + persistent history across scans

Want to work on any of these? [Open an issue](../../issues) or submit a PR — all contributions welcome.

---

## Contributing

Contributions are what make open source great. Here's how to get involved:

### Getting Set Up

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/ideahunter.git
cd ideahunter

# Create a feature branch
git checkout -b feature/my-improvement

# Make your changes, then push
git push origin feature/my-improvement

# Open a Pull Request on GitHub
```

### What We Welcome

- **New scrapers** — Add a new source (Twitter, LinkedIn, Indie London Slack, etc.) by creating a new scraper class in `scraper.py` following the same interface as the existing ones
- **Better AI prompts** — If you find a prompt that extracts better ideas or scores more accurately, open a PR with before/after examples
- **UI improvements** — New filters, better card layouts, dark/light mode, mobile responsiveness
- **Performance** — Faster scraping, smarter deduplication, caching between scans
- **Tests** — Unit tests for scrapers, integration tests for the API

### Guidelines

- Keep PRs focused — one feature or fix per PR
- Match the existing code style (no TypeScript, no auth, no database)
- If adding a new source, include a brief explanation of why it's high-signal for idea validation
- Don't add dependencies unless absolutely necessary

---

## Disclaimer

IdeaHunter surfaces ideas based on public posts and AI analysis. Revenue proof posts are real posts from real founders, but past results don't guarantee future outcomes. The opportunity scores are generated by AI and represent probabilistic signals, not certainties.

Always do your own customer discovery, market research, and validation before investing significant time or money in any idea. Talk to potential customers. Build an MVP. IdeaHunter is a starting point, not a guarantee.

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Built with ❤️ by **zaka23-cyber**

⭐ **Star this repo if you found a good idea!** ⭐

</div>
