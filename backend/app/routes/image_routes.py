from flask import Blueprint, request, jsonify
from app.models.image_model import analyze_image
import os

image_bp = Blueprint("image", __name__)

@image_bp.route("/", methods=["POST"])
def analyze():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]
    image_path = os.path.join("temp", image_file.filename)
    image_file.save(image_path)

    result = analyze_image(image_path)
    os.remove(image_path)
    return jsonify(result)
