from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Iterable
import re
import json
import csv
import datetime
import argparse

# /c:/Users/hi/Desktop/personality_analysis_project/frontend/src/utils/twitter_scraper.py
"""
Lightweight Twitter scraper utilities using snscrape (preferred).
Provides functions to scrape user timelines or search queries and save results.
"""


# Try import for snscrape (external dependency)
_sntwitter = None
try:
    import snscrape.modules.twitter as _sntwitter  # type: ignore
except Exception:
    _sntwitter = None


@dataclass
class Tweet:
    id: int
    date: datetime.datetime
    username: str
    content: str
    replyCount: int
    retweetCount: int
    likeCount: int
    language: Optional[str]
    url: str


def _ensure_snscrape():
    if _sntwitter is None:
        raise ImportError(
            "snscrape is required. Install with: pip install snscrape"
        )


def _clean_text(text: str) -> str:
    # basic cleaning: remove URLs, extra spaces, and normalize whitespace
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _items_to_tweets(items: Iterable) -> List[Tweet]:
    tweets: List[Tweet] = []
    for item in items:
        # Each item is a snscrape Tweet object
        tweets.append(
            Tweet(
                id=getattr(item, "id", 0),
                date=getattr(item, "date", None),
                username=getattr(item, "user", getattr(item, "username", None)).username
                if getattr(item, "user", None) is not None
                else getattr(item, "username", None),
                content=_clean_text(getattr(item, "content", "")),
                replyCount=getattr(item, "replyCount", 0),
                retweetCount=getattr(item, "retweetCount", 0),
                likeCount=getattr(item, "likeCount", 0),
                language=getattr(item, "lang", None),
                url=getattr(item, "url", ""),
            )
        )
    return tweets


def scrape_user_tweets(username: str, limit: int = 100) -> List[Dict]:
    """
    Scrape tweets from a user's timeline.
    Returns list of dicts (serializable).
    """
    _ensure_snscrape()
    scraper = _sntwitter.TwitterUserScraper(username)
    items = (item for i, item in zip(range(limit), scraper.get_items()))
    tweets = _items_to_tweets(items)
    return [asdict(t) for t in tweets]


def scrape_search(query: str, limit: int = 100) -> List[Dict]:
    """
    Scrape tweets matching a search query.
    Returns list of dicts (serializable).
    """
    _ensure_snscrape()
    scraper = _sntwitter.TwitterSearchScraper(query)
    items = (item for i, item in zip(range(limit), scraper.get_items()))
    tweets = _items_to_tweets(items)
    return [asdict(t) for t in tweets]


def save_to_json(data: List[Dict], path: str, indent: int = 2) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, default=str, ensure_ascii=False, indent=indent)


def save_to_csv(data: List[Dict], path: str) -> None:
    if not data:
        with open(path, "w", encoding="utf-8") as f:
            f.write("")
        return
    fieldnames = list(data[0].keys())
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow({k: ("" if v is None else str(v)) for k, v in row.items()})


if __name__ == "__main__":
    # Simple CLI for quick use
    parser = argparse.ArgumentParser(description="Simple Twitter scraper utilities (snscrape).")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--user", "-u", help="Username to scrape (without @).")
    group.add_argument("--search", "-s", help="Search query.")
    parser.add_argument("--limit", "-n", type=int, default=100, help="Max number of tweets to fetch.")
    parser.add_argument("--out", "-o", default="tweets.json", help="Output file path (.json or .csv).")
    args = parser.parse_args()

    if args.user:
        data = scrape_user_tweets(args.user, limit=args.limit)
    else:
        data = scrape_search(args.search, limit=args.limit)

    if args.out.lower().endswith(".csv"):
        save_to_csv(data, args.out)
    else:
        save_to_json(data, args.out)