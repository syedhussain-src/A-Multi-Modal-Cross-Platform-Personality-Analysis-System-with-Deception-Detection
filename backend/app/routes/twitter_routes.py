# backend/app/routes/twitter_routes.py
from flask import Blueprint, request, jsonify
import tweepy
import os
from app.utils.personality_utils import analyze_text  # your analyze function

twitter_bp = Blueprint('twitter', __name__, url_prefix='/twitter')

# Read keys from env (ensure main.py loaded .env earlier)
TWITTER_API_KEY = os.getenv("TWITTER_API_KEY")
TWITTER_API_SECRET = os.getenv("TWITTER_API_SECRET")
TWITTER_ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN")
TWITTER_ACCESS_SECRET = os.getenv("TWITTER_ACCESS_SECRET")

print("DEBUG - TWITTER_API_KEY present:", bool(TWITTER_API_KEY))

api = None
if all([TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET]):
    try:
        auth = tweepy.OAuth1UserHandler(
            TWITTER_API_KEY, TWITTER_API_SECRET,
            TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET
        )
        api = tweepy.API(auth, wait_on_rate_limit=True)
        print("Twitter API initialized.")
    except Exception as e:
        print("Twitter init error:", e)
        api = None
else:
    print("Twitter API keys not found — Twitter endpoints will return an error until keys are provided.")

@twitter_bp.route('/analyze/twitter', methods=['POST'])
def analyze_twitter():
    if api is None:
        return jsonify({"error": "Twitter API not configured on server. Please add credentials to .env."}), 500

    data = request.get_json() or {}
    username = data.get('username')
    if not username:
        return jsonify({"error": "Username required"}), 400

    try:
        tweets = api.user_timeline(screen_name=username, count=20, tweet_mode="extended")
        text_data = " ".join(getattr(tweet, "full_text", "") for tweet in tweets)
        result = analyze_text(text_data)
        return jsonify(result)
    except tweepy.TweepError as te:
        return jsonify({"error": f"Tweepy error: {str(te)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
