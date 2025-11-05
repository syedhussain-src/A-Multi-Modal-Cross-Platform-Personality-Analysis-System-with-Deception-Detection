from flask import Blueprint, request, jsonify
from datetime import datetime
from app.models.text_model import analyze_text
from app.extensions import mongo

text_bp = Blueprint("text", __name__)

@text_bp.route("/", methods=["POST"])
def analyze():
    data = request.get_json()
    user_text = data.get("text", "")
    user = data.get("username", "Anonymous")

    if not user_text:
        return jsonify({"error": "No text provided"}), 400

    result = analyze_text(user_text)
    sentiment = result.get("sentiment", "Neutral")
    confidence = round(result.get("confidence", 0) * 100, 2)

    try:
        mongo.db.analysis_history.insert_one({
            "type": "Text",
            "user": user,
            "result": sentiment,
            "confidence": confidence,
            "text": user_text,
            "created_at": datetime.utcnow()
        })
    except Exception as e:
        print("⚠️ Failed to save analysis:", e)

    return jsonify(result)
