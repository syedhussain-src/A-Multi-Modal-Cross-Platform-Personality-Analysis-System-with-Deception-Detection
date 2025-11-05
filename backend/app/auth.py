from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin
from datetime import datetime, timedelta, timezone
from functools import wraps
import jwt
import re
import os
from app.extensions import mongo

auth = Blueprint("auth", __name__)

# Use environment variable for SECRET_KEY
SECRET_KEY = "f97d100c6093b78a8748fa510a2a7fed9729f900046e8369bade50772b985899"

# Email validation regex
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'


# ========== HELPER FUNCTIONS ==========
def validate_email(email):
    """Validate email format"""
    return re.match(EMAIL_REGEX, email) is not None


def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, ""


def generate_token(username, hours=2):
    """Generate JWT token"""
    return jwt.encode(
        {
            "username": username,
            "exp": datetime.now(timezone.utc) + timedelta(hours=hours),
            "iat": datetime.now(timezone.utc)
        },
        SECRET_KEY,
        algorithm="HS256"
    )


# ========== MIDDLEWARE/DECORATOR ==========
def token_required(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            # Decode token
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            
            # Check if token is blacklisted
            blacklisted = mongo.db.token_blacklist.find_one({"token": token})
            if blacklisted:
                return jsonify({"error": "Token has been revoked"}), 401
            
            # Get current user
            current_user = mongo.db.users.find_one(
                {"username": data['username']},
                {"password": 0}  # Exclude password from result
            )
            
            if not current_user:
                return jsonify({"error": "Invalid token"}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except Exception as e:
            return jsonify({"error": "Authentication failed"}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated


# ========== SIGNUP ROUTE ==========
@auth.route("/signup", methods=["POST"])
@cross_origin()
def signup():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        username = data.get("username", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        # Validate required fields
        if not username or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        # Validate username length
        if len(username) < 3 or len(username) > 30:
            return jsonify({"error": "Username must be between 3 and 30 characters"}), 400

        # Validate username format (alphanumeric and underscore only)
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return jsonify({"error": "Username can only contain letters, numbers, and underscores"}), 400

        # Validate email
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        # Validate password strength
        is_valid, error_message = validate_password(password)
        if not is_valid:
            return jsonify({"error": error_message}), 400

        # Check if username or email already exists
        existing_user = mongo.db.users.find_one({
            "$or": [{"username": username}, {"email": email}]
        })

        if existing_user:
            if existing_user.get("username") == username:
                return jsonify({"error": "Username already exists"}), 400
            else:
                return jsonify({"error": "Email already registered"}), 400

        # Hash password
        hashed_pw = generate_password_hash(password, method='pbkdf2:sha256')
        
        # Insert new user
        user_data = {
            "username": username,
            "email": email,
            "password": hashed_pw,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "is_active": True
        }
        
        mongo.db.users.insert_one(user_data)

        # Generate token
        token = generate_token(username)

        return jsonify({
            "message": "Signup successful",
            "token": token,
            "user": {
                "username": username,
                "email": email
            }
        }), 201
    

    except Exception as e:
        # Log error in production
        print(f"Signup error: {str(e)}")
        return jsonify({"error": "An error occurred during signup"}), 500


# ========== LOGIN ROUTE ==========
@auth.route("/login", methods=["POST"])
@cross_origin()
def login():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        username_or_email = (data.get("username") or data.get("email", "")).strip().lower()
        password = data.get("password", "")

        # Validate required fields
        if not username_or_email or not password:
            return jsonify({"error": "Username/Email and password are required"}), 400

        # Find user by username or email
        user = mongo.db.users.find_one({
            "$or": [
                {"username": username_or_email},
                {"email": username_or_email}
            ]
        })

        # Generic error message to prevent user enumeration
        if not user or not check_password_hash(user["password"], password):
            return jsonify({"error": "Invalid credentials"}), 401

        # Check if user account is active
        if not user.get("is_active", True):
            return jsonify({"error": "Account is deactivated"}), 403

        # Update last login time
        mongo.db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.now(timezone.utc)}}
        )

        # Generate token
        token = generate_token(user["username"])

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "username": user["username"],
                "email": user.get("email")
            }
        }), 200

    except Exception as e:
        # Log error in production
        print(f"Login error: {str(e)}")
        return jsonify({"error": "An error occurred during login"}), 500


# ========== LOGOUT ROUTE ==========
@auth.route("/logout", methods=["POST"])
@cross_origin()
@token_required
def logout(current_user):
    try:
        token = request.headers.get('Authorization')
        
        if token and token.startswith('Bearer '):
            token = token[7:]
        
        # Add token to blacklist
        mongo.db.token_blacklist.insert_one({
            "token": token,
            "username": current_user["username"],
            "blacklisted_at": datetime.now(timezone.utc)
        })

        return jsonify({"message": "Logout successful"}), 200

    except Exception as e:
        print(f"Logout error: {str(e)}")
        return jsonify({"error": "An error occurred during logout"}), 500


# ========== VERIFY TOKEN ROUTE ==========
@auth.route("/verify", methods=["GET"])
@cross_origin()
@token_required
def verify_token(current_user):
    """Verify if the current token is valid"""
    return jsonify({
        "message": "Token is valid",
        "user": {
            "username": current_user["username"],
            "email": current_user.get("email")
        }
    }), 200


# ========== PROTECTED PROFILE ROUTE (EXAMPLE) ==========
@auth.route("/profile", methods=["GET"])
@cross_origin()
@token_required
def get_profile(current_user):
    """Get user profile - example of protected route"""
    return jsonify({
        "user": {
            "username": current_user["username"],
            "email": current_user.get("email"),
            "created_at": current_user.get("created_at"),
            "last_login": current_user.get("last_login")
        }
    }), 200


# ========== DATABASE INITIALIZATION ==========
def init_auth_indexes():
    """Create indexes for better performance - call this during app initialization"""
    try:
        # Create unique indexes
        mongo.db.users.create_index("username", unique=True)
        mongo.db.users.create_index("email", unique=True)
        
        # Create index for token blacklist with TTL (auto-delete after 2 hours)
        mongo.db.token_blacklist.create_index("blacklisted_at", expireAfterSeconds=7200)
        mongo.db.token_blacklist.create_index("token")
        
        print("Auth indexes created successfully")
    except Exception as e:
        print(f"Error creating indexes: {str(e)}")