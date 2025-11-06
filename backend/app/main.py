# backend/app/main.py
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import jwt
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Load .env early — compute path relative to backend folder
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=ENV_PATH)
print("Loaded .env from:", ENV_PATH)

# Now other imports (these may use os.getenv)
from transformers import pipeline
from deepface import DeepFace

# Custom imports (import after env is loaded)
from app.extensions import mongo
from app.auth import auth
from app.routes.twitter_routes import twitter_bp
from app.routes.instagram_routes import instagram_bp
# optional: gender_bp if you created it
try:
    from app.routes.gender_routes import gender_bp
except Exception:
    gender_bp = None

# ========== INIT APP ==========
app = Flask(__name__)
CORS(app)

# Use environment-configurable values where possible
app.config["MONGO_URI"] = os.getenv(
    "MONGO_URI",
    "mongodb+srv://SyedHussain:vCE67XJ9nhPsRVmG@personalitycluster.auhjzps.mongodb.net/personality_db?retryWrites=true&w=majority"
)
app.config["SECRET_KEY"] = os.getenv(
    "SECRET_KEY",
    "f97d100c6093b78a8748fa510a2a7fed9729f900046e8369bade50772b985899"
)

# Init Mongo
mongo.init_app(app)

# Register Blueprints
app.register_blueprint(auth)
app.register_blueprint(twitter_bp)
app.register_blueprint(instagram_bp)
if gender_bp:
    app.register_blueprint(gender_bp)


# ========== AUTH ROUTES (LOGIN / SIGNUP / DASHBOARD) ==========
@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    existing_user = mongo.db.users.find_one({"username": username})
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    mongo.db.users.insert_one({
        "username": username,
        "email": email,
        "password": password,
        "created_at": datetime.utcnow()
    })

    token = jwt.encode(
        {"username": username, "exp": datetime.utcnow() + timedelta(hours=2)},
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({"message": "Signup successful", "token": token})


@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    user = mongo.db.users.find_one({"username": username})
    if not user or user["password"] != password:
        return jsonify({"error": "Invalid username or password"}), 401

    token = jwt.encode(
        {"username": username, "exp": datetime.utcnow() + timedelta(hours=2)},
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({"message": "Login successful", "token": token})


@app.route("/auth/me", methods=["GET"])
def get_user_info():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Token missing"}), 401

    token = token.replace("Bearer ", "")
    try:
        decoded = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        username = decoded["username"]
        user = mongo.db.users.find_one({"username": username}, {"_id": 0, "password": 0})
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"user": user})
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401


# ========== TEXT ANALYSIS ==========
sentiment_model = pipeline("sentiment-analysis")


@app.route("/analyze/text", methods=["POST"])
def analyze_text():
    """
    Expects JSON: { "text": "...", "username": "SyedHussain" }
    Saves result to mongo.db.analysis_history
    """
    data = request.get_json()
    user_text = data.get("text", "")
    username = data.get("username", "Anonymous")

    if not user_text:
        return jsonify({"error": "No text provided"}), 400

    # Run sentiment model
    result = sentiment_model(user_text)[0]
    label = result.get("label", "NEUTRAL")
    score = float(result.get("score", 0.0))

    traits = {
        "openness": round(0.5 + score * 0.2, 2) if label == "POSITIVE" else round(0.4 - score * 0.2, 2),
        "conscientiousness": round(0.6 + score * 0.1, 2),
        "extraversion": round(0.5 + score * 0.25, 2) if label == "POSITIVE" else round(0.4, 2),
        "agreeableness": round(score, 2) if label == "POSITIVE" else round(1 - score, 2),
        "neuroticism": round(1 - score, 2) if label == "POSITIVE" else round(score, 2),
    }

    # Save to MongoDB (analysis_history collection)
    try:
        mongo.db.analysis_history.insert_one({
            "type": "Text",
            "user": username,
            "input_text": user_text,
            "result": label,
            "confidence": round(score * 100, 2),  # store as percent
            "personality_traits": traits,
            "created_at": datetime.utcnow()
        })
    except Exception as e:
        print("Error saving text analysis to DB:", e)

    return jsonify({
        "text": user_text,
        "sentiment": label,
        "confidence": round(score, 2),
        "personality_traits": traits
    })


# ========== IMAGE ANALYSIS (with Gender Prediction) ==========
@app.route("/analyze/image", methods=["POST"])
def analyze_image():
    """
    Accepts multipart/form-data:
      - image file (field name "image")
      - optional 'username' field (string)
    Saves result to mongo.db.analysis_history
    """
    username = request.form.get("username", "Anonymous")

    if "image" not in request.files:
        return jsonify({"error": "No image file uploaded"}), 400

    image_file = request.files["image"]
    filename = secure_filename(image_file.filename or f"{datetime.utcnow().timestamp()}.jpg")
    image_path = os.path.join("temp", filename)
    os.makedirs("temp", exist_ok=True)
    image_file.save(image_path)

    try:
        # 🔹 Run DeepFace for emotion + gender
        analysis = DeepFace.analyze(
            img_path=image_path,
            actions=['emotion', 'gender'],
            enforce_detection=False
        )

        result = analysis[0] if isinstance(analysis, list) else analysis

        # DeepFace sometimes uses keys 'gender' or 'dominant_gender' — handle both
        dominant_emotion = result.get("dominant_emotion") or result.get("emotion", "unknown")
        dominant_gender = result.get("dominant_gender") or result.get("gender") or "unknown"

        # Map emotion → personality traits (optional)
        emotion_to_traits = {
            "happy": {"extraversion": 0.9, "neuroticism": 0.2},
            "sad": {"extraversion": 0.3, "neuroticism": 0.8},
            "angry": {"agreeableness": 0.3, "neuroticism": 0.9},
            "surprise": {"openness": 0.8, "extraversion": 0.6},
            "neutral": {"conscientiousness": 0.7},
            "fear": {"neuroticism": 0.95, "extraversion": 0.2},
            "disgust": {"agreeableness": 0.4},
        }

        traits = emotion_to_traits.get(str(dominant_emotion).lower(), {})

        # Confidence: try to extract from result if available
        confidence_val = None
        # DeepFace sometimes includes 'emotion' dict with probabilities
        try:
            if isinstance(result.get("emotion"), dict):
                top = max(result["emotion"].values())
                confidence_val = round(top * 100, 2)
        except Exception:
            confidence_val = None

        # Save to MongoDB
        try:
            mongo.db.analysis_history.insert_one({
                "type": "Image",
                "user": username,
                "result": f"{dominant_gender} / {dominant_emotion}",
                "gender": dominant_gender,
                "emotion": dominant_emotion,
                "confidence": confidence_val if confidence_val is not None else 0,
                "personality_traits": traits,
                "created_at": datetime.utcnow()
            })
        except Exception as e:
            print("Error saving image analysis to DB:", e)

        return jsonify({
            "emotion": str(dominant_emotion).capitalize(),
            "gender": str(dominant_gender).capitalize(),
            "personality_traits": traits
        })

    except Exception as e:
        print("Error in DeepFace:", e)
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(image_path):
            os.remove(image_path)


@app.route("/dashboard/stats", methods=["GET"])
def get_dashboard_stats():
    """
    Optional query param:
      ?username=SyedHussain  -> returns stats for that user
      (if omitted, returns global stats)
    """
    try:
        username = request.args.get("username", None)

        # Build filters
        user_filter = {"user": username} if username else {}
        # counts
        total_text = mongo.db.analysis_history.count_documents({**user_filter, "type": "Text"})
        total_image = mongo.db.analysis_history.count_documents({**user_filter, "type": "Image"})
        total_social = mongo.db.analysis_history.count_documents({**user_filter, "type": {"$in": ["Instagram", "Twitter", "Social"]}})

        total_analysis = total_text + total_image + total_social

        accuracy_rate = 98.5 if total_analysis > 0 else 0
        active_sessions_list = mongo.db.analysis_history.distinct("user", user_filter)  # list of usernames
        active_sessions_count = len(active_sessions_list)

        # Get recent analyses for user (or global)
        recent_cursor = (
            mongo.db.analysis_history.find(user_filter).sort("created_at", -1).limit(5)
        )

        recent = []
        for doc in recent_cursor:
            recent.append({
                "id": str(doc.get("_id")),
                "type": doc.get("type", "Unknown"),
                "user": doc.get("user", "Anonymous"),
                "result": doc.get("result", "N/A"),
                "confidence": doc.get("confidence", 0),
                "time": doc.get("created_at").strftime("%Y-%m-%d %H:%M:%S") if doc.get("created_at") else "N/A",
            })

        return jsonify({
            "stats": {
                "totalAnalysis": total_analysis,
                "accuracyRate": accuracy_rate,
                "activeSessions": active_sessions_count,
                "textAnalysis": total_text,
                "imageAnalysis": total_image,
                "socialAnalysis": total_social,
            },
            "recentAnalyses": recent,
        })

    except Exception as e:
        print("⚠️ Dashboard stats error:", e)
        return jsonify({"error": str(e)}), 500


# ========== RUN APP ==========
if __name__ == "__main__":
    app.run(debug=True)
