from flask import Blueprint, request, jsonify
from app.models.deception_model import analyze_deception
from datetime import datetime
from app.extensions import mongo

deception_bp = Blueprint("deception", __name__)

@deception_bp.route("/", methods=["POST"])
def detect_deception():
    data = request.get_json()
    text = data.get("text", "")
    user = data.get("username", "Anonymous")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = analyze_deception(text)

    # Save result to MongoDB
    mongo.db.analysis_history.insert_one({
        "type": "Deception",
        "user": user,
        "result": result["prediction"],
        "confidence": result["confidence"],
        "text": text,
        "created_at": datetime.utcnow()
    })

    return jsonify(result)
