from flask import Blueprint, request, jsonify
from app.utils.twitter_scraper import fetch_user_tweets

twitter_bp = Blueprint("twitter", __name__)

@twitter_bp.route("/analyze/twitter", methods=["POST"])
def analyze_twitter():
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({"error": "Username is required"}), 400

    tweets = fetch_user_tweets(username)
    return jsonify({"tweets": tweets})
