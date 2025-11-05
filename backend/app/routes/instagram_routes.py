from flask import Blueprint, request, jsonify, redirect, session
import requests
import random
import os
from dotenv import load_dotenv

load_dotenv()

instagram_bp = Blueprint("instagram", __name__, url_prefix="/instagram")

# ============================================
# CONFIGURATION
# ============================================

# Instagram OAuth Configuration
INSTAGRAM_CLIENT_ID = os.getenv("INSTAGRAM_CLIENT_ID", "YOUR_INSTAGRAM_APP_ID")
INSTAGRAM_CLIENT_SECRET = os.getenv("INSTAGRAM_CLIENT_SECRET", "YOUR_INSTAGRAM_APP_SECRET")
INSTAGRAM_REDIRECT_URI = "http://localhost:5000/instagram/callback"
INSTAGRAM_AUTH_URL = "https://api.instagram.com/oauth/authorize"
INSTAGRAM_TOKEN_URL = "https://api.instagram.com/oauth/access_token"

# RapidAPI Configuration (for username search)
RAPIDAPI_KEY = "eeebc2f2fbmshc3917f1c3585f29p104815jsn7bd06266244c"
RAPIDAPI_HOST = "instagram120.p.rapidapi.com"

# Development Mode (Set to False when APIs are configured)
USE_MOCK_DATA = True

print("=" * 60)
print("Instagram Analyzer Backend Started")
print(f"OAuth Configured: {INSTAGRAM_CLIENT_ID != 'YOUR_INSTAGRAM_APP_ID'}")
print(f"Mock Data Mode: {USE_MOCK_DATA}")
print("=" * 60)


# ============================================
# OAUTH ENDPOINTS
# ============================================

@instagram_bp.route("/connect", methods=["GET"])
def connect_instagram():
    """
    Step 1: Redirect user to Instagram OAuth authorization page
    """
    if INSTAGRAM_CLIENT_ID == "YOUR_INSTAGRAM_APP_ID":
        return jsonify({
            "error": "Instagram OAuth not configured",
            "message": "Please set INSTAGRAM_CLIENT_ID in .env file",
            "setup_guide": "https://developers.facebook.com/docs/instagram-basic-display-api/getting-started"
        }), 400

    # Build Instagram OAuth URL
    auth_params = {
        "client_id": INSTAGRAM_CLIENT_ID,
        "redirect_uri": INSTAGRAM_REDIRECT_URI,
        "scope": "user_profile,user_media",
        "response_type": "code"
    }
    
    auth_url = (
        f"{INSTAGRAM_AUTH_URL}?"
        f"client_id={auth_params['client_id']}&"
        f"redirect_uri={auth_params['redirect_uri']}&"
        f"scope={auth_params['scope']}&"
        f"response_type={auth_params['response_type']}"
    )
    
    print(f"🔗 OAuth Request: Redirecting to Instagram")
    
    return jsonify({
        "auth_url": auth_url,
        "message": "Redirect user to this URL for Instagram authorization"
    })


@instagram_bp.route("/callback", methods=["GET"])
def instagram_callback():
    """
    Step 2: Handle OAuth callback from Instagram
    Exchange authorization code for access token
    """
    code = request.args.get("code")
    error = request.args.get("error")
    error_reason = request.args.get("error_reason")
    error_description = request.args.get("error_description")
    
    # Handle OAuth errors
    if error:
        print(f"❌ OAuth Error: {error} - {error_reason}")
        return redirect(
            f"http://localhost:3000/instagram-analyzer?"
            f"error={error}&"
            f"error_reason={error_reason}&"
            f"error_description={error_description}"
        )
    
    if not code:
        print("❌ No authorization code received")
        return redirect("http://localhost:3000/instagram-analyzer?error=no_code")
    
    print(f"✅ Authorization code received: {code[:20]}...")
    
    try:
        # Exchange code for access token
        token_data = {
            "client_id": INSTAGRAM_CLIENT_ID,
            "client_secret": INSTAGRAM_CLIENT_SECRET,
            "grant_type": "authorization_code",
            "redirect_uri": INSTAGRAM_REDIRECT_URI,
            "code": code
        }
        
        print("🔄 Exchanging code for access token...")
        token_response = requests.post(INSTAGRAM_TOKEN_URL, data=token_data)
        token_json = token_response.json()
        
        print(f"Token Response Status: {token_response.status_code}")
        
        if "access_token" in token_json:
            access_token = token_json["access_token"]
            user_id = token_json.get("user_id")
            
            print(f"✅ Access token obtained for user: {user_id}")
            
            # Store in session
            session["instagram_token"] = access_token
            session["instagram_user_id"] = user_id
            
            # Redirect back to frontend with success
            return redirect(
                f"http://localhost:3000/instagram-analyzer?"
                f"connected=true&"
                f"user_id={user_id}"
            )
        else:
            print(f"❌ Token exchange failed: {token_json}")
            error_msg = token_json.get("error_message", "token_exchange_failed")
            return redirect(
                f"http://localhost:3000/instagram-analyzer?"
                f"error={error_msg}"
            )
            
    except Exception as e:
        print(f"❌ Exception during OAuth callback: {str(e)}")
        return redirect(
            f"http://localhost:3000/instagram-analyzer?"
            f"error=callback_exception"
        )


@instagram_bp.route("/profile", methods=["GET"])
def get_connected_profile():
    """
    Get profile data using stored access token
    """
    access_token = session.get("instagram_token")
    user_id = session.get("instagram_user_id")
    
    if not access_token:
        return jsonify({
            "error": "Not connected to Instagram",
            "message": "Please connect your Instagram account first"
        }), 401
    
    print(f"📊 Fetching profile for connected user: {user_id}")
    
    try:
        # Get user profile from Instagram Graph API
        profile_url = (
            f"https://graph.instagram.com/me?"
            f"fields=id,username,account_type,media_count&"
            f"access_token={access_token}"
        )
        
        profile_response = requests.get(profile_url)
        
        if profile_response.status_code != 200:
            return jsonify({
                "error": "Failed to fetch profile",
                "details": profile_response.json()
            }), profile_response.status_code
        
        profile_data = profile_response.json()
        
        # Get user media (posts)
        media_url = (
            f"https://graph.instagram.com/me/media?"
            f"fields=id,caption,media_type,media_url,timestamp,permalink&"
            f"limit=25&"
            f"access_token={access_token}"
        )
        
        media_response = requests.get(media_url)
        media_data = media_response.json()
        
        # Extract post captions
        posts = []
        for item in media_data.get("data", []):
            caption = item.get("caption", "")
            if caption and caption.strip():
                posts.append(caption.strip())
        
        # Combine text for analysis
        all_text = " ".join(posts)
        
        # Calculate sentiment and personality
        sentiment = calculate_sentiment(all_text)
        personality = calculate_personality_traits(all_text, posts)
        
        result = {
            "username": profile_data.get("username"),
            "user_id": profile_data.get("id"),
            "account_type": profile_data.get("account_type"),
            "followers": "Connected Account",
            "following": "Connected Account",
            "bio": f"Connected Instagram Account (@{profile_data.get('username')})",
            "sample_posts": posts[:10],
            "posts": profile_data.get("media_count", len(posts)),
            "sentiment": sentiment,
            "personality_traits": personality,
            "connected": True,
            "total_media_analyzed": len(posts)
        }
        
        print(f"✅ Profile data retrieved successfully")
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Error fetching profile: {str(e)}")
        return jsonify({
            "error": "Failed to fetch profile data",
            "details": str(e)
        }), 500


@instagram_bp.route("/disconnect", methods=["POST"])
def disconnect_instagram():
    """
    Disconnect Instagram account (clear session)
    """
    user_id = session.get("instagram_user_id")
    
    session.pop("instagram_token", None)
    session.pop("instagram_user_id", None)
    
    print(f"🔓 User {user_id} disconnected")
    
    return jsonify({
        "message": "Successfully disconnected from Instagram",
        "status": "disconnected"
    })


@instagram_bp.route("/status", methods=["GET"])
def connection_status():
    """
    Check if user is currently connected to Instagram
    """
    is_connected = "instagram_token" in session
    user_id = session.get("instagram_user_id")
    
    return jsonify({
        "connected": is_connected,
        "user_id": user_id if is_connected else None
    })


# ============================================
# USERNAME ANALYSIS ENDPOINT
# ============================================

@instagram_bp.route("/analyze", methods=["POST"])
def analyze_instagram():
    """
    Analyze Instagram profile by username
    (Public profiles only, no authentication required)
    """
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({"error": "Username is required"}), 400

    print(f"🔍 Analyzing profile: @{username}")

    # ==========================================
    # MOCK DATA MODE (for testing/demo)
    # ==========================================
    if USE_MOCK_DATA:
        print(f"🎭 Using MOCK data for: @{username}")
        
        # Predefined celebrity profiles for demo
        mock_profiles = {
            "cristiano": {
                "followers": 617000000,
                "following": 567,
                "bio": "Athlete, Father, Entrepreneur | Forever believing in myself 🏆⚽",
                "posts": [
                    "Training hard for the next match! Victory is earned through dedication 💪⚽",
                    "Quality time with my family is everything ❤️👨‍👩‍👧‍👦",
                    "Never stop believing in yourself! Dreams do come true 🏆✨",
                    "Grateful for all the love and support from fans worldwide 🙏🌍",
                    "Champions are made in the gym! No days off 🔥💯",
                    "New challenge accepted! Let's do this 🚀",
                    "Thankful for another year of growth and success 🎉",
                    "Hard work beats talent when talent doesn't work hard 💼"
                ]
            },
            "leomessi": {
                "followers": 502000000,
                "following": 294,
                "bio": "Welcome to my official Instagram ⚽️🇦🇷",
                "posts": [
                    "What an amazing match! Proud of the team 🙌⚽",
                    "Family time is the best time ❤️👨‍👩‍👦",
                    "Training with the squad 💪 #TeamWork",
                    "Thank you for all the incredible support! 🙏✨",
                    "Beautiful sunset in Miami 🌅",
                    "New season, new goals ⚽🎯",
                    "Grateful for these moments 💙"
                ]
            },
            "selenagomez": {
                "followers": 430000000,
                "following": 231,
                "bio": "Artist. Advocate. Entrepreneur. @rarebeauty @rareimpactfund 💜",
                "posts": [
                    "New music coming soon! Can't wait to share it with you 🎵✨",
                    "Mental health matters. Let's talk about it 💙 #MentalHealthAwareness",
                    "Thankful for all the love and support 🙏❤️",
                    "Behind the scenes of today's shoot 📸",
                    "Self-care Sunday vibes 🌸💆‍♀️",
                    "Grateful for this incredible journey ✨",
                    "New @rarebeauty launch! Check it out 💄"
                ]
            },
            "therock": {
                "followers": 396000000,
                "following": 620,
                "bio": "builder of stuff cheat meal crusher tequila sipper og girl dad 💪🥃",
                "posts": [
                    "4am club! Let's get this work done 💪🔥",
                    "Family first, always ❤️👨‍👧‍👧",
                    "New project announcement coming soon! Stay tuned 🎬",
                    "Leg day is the best day! Who's with me? 🦵💯",
                    "Grateful for every opportunity 🙏✨",
                    "Hard work and dedication pay off! Keep grinding 💼",
                    "Cheat meal time! Pizza anyone? 🍕😋"
                ]
            },
            "kyliejenner": {
                "followers": 400000000,
                "following": 154,
                "bio": "founder of @kyliecosmetics & @kyskinfamily 💋",
                "posts": [
                    "New @kyliecosmetics collection drops tomorrow! 💄✨",
                    "Sunday funday with my babies 👶❤️",
                    "Obsessed with this new lip shade 💋",
                    "BTS of today's photoshoot 📸",
                    "Feeling grateful and blessed 🙏💕",
                    "Self-care Saturday 💅✨",
                    "Can't wait to share what's coming next! 🚀"
                ]
            }
        }
        
        # Get mock profile or create random one
        if username.lower() in mock_profiles:
            profile = mock_profiles[username.lower()]
            print(f"   📋 Using predefined profile for {username}")
        else:
            # Generate random profile for unknown usernames
            profile = {
                "followers": random.randint(5000, 150000),
                "following": random.randint(200, 2000),
                "bio": f"Welcome to @{username}'s profile | Living my best life ✨ | Content Creator 🚀",
                "posts": [
                    "Amazing day today! Feeling grateful for everything 🙏✨",
                    "New project launching soon! Stay tuned for updates 🚀",
                    "Working hard on my goals every single day 💪 #motivation",
                    "Beautiful sunset tonight 🌅 Nature is truly incredible",
                    "Thanks for all the love and support! You're amazing 🌟❤️",
                    "Living my best life! Grateful for every moment 🎉",
                    "New adventures await! Let's do this 🌍✈️",
                    "Quality time with friends and family ❤️👨‍👩‍👧",
                    "Never stop chasing your dreams ✨ #inspiration",
                    "Positivity and good vibes only! 🌈😊"
                ]
            }
            print(f"   🎲 Generated random profile for {username}")
        
        # Analyze text
        all_text = profile["bio"] + " " + " ".join(profile["posts"])
        sentiment = calculate_sentiment(all_text)
        personality = calculate_personality_traits(all_text, profile["posts"])
        
        result = {
            "username": username,
            "followers": profile["followers"],
            "following": profile["following"],
            "bio": profile["bio"],
            "sample_posts": profile["posts"],
            "posts": len(profile["posts"]),
            "sentiment": sentiment,
            "personality_traits": personality,
            "mock_data": True
        }
        
        print(f"✅ Mock analysis complete for @{username}")
        return jsonify(result)

    # ==========================================
    # REAL API MODE (RapidAPI Instagram)
    # ==========================================
    try:
        url_profile = f"https://{RAPIDAPI_HOST}/api/instagram/userInfo"
        headers = {
            "Content-Type": "application/json",
            "x-rapidapi-host": RAPIDAPI_HOST,
            "x-rapidapi-key": RAPIDAPI_KEY
        }
        payload = {"username": username}

        print(f"   📡 Fetching profile from RapidAPI...")
        profile_res = requests.post(url_profile, json=payload, headers=headers, timeout=10)
        
        print(f"   Profile Response Status: {profile_res.status_code}")
        
        if profile_res.status_code != 200:
            return jsonify({
                "error": "Failed to fetch profile from Instagram API",
                "status_code": profile_res.status_code
            }), 500
        
        profile_data = profile_res.json()

        # Fetch posts
        url_posts = f"https://{RAPIDAPI_HOST}/api/instagram/posts"
        posts_res = requests.post(url_posts, json=payload, headers=headers, timeout=10)
        
        print(f"   Posts Response Status: {posts_res.status_code}")
        
        posts_data = posts_res.json()

        # Extract data
        profile_info = profile_data.get("data", {})
        posts_list = posts_data.get("data", [])
        
        # Get captions
        sample_posts = []
        for post in posts_list[:15]:
            caption = post.get("caption", {})
            if isinstance(caption, dict):
                text = caption.get("text", "")
            elif isinstance(caption, str):
                text = caption
            else:
                text = ""
            
            if text and text.strip():
                sample_posts.append(text.strip())
        
        # Extract profile fields
        bio = profile_info.get("biography", "") or profile_info.get("bio", "")
        followers = profile_info.get("follower_count", 0) or profile_info.get("followers", 0)
        following = profile_info.get("following_count", 0) or profile_info.get("following", 0)
        
        # Analyze
        all_text = bio + " " + " ".join(sample_posts)
        sentiment = calculate_sentiment(all_text)
        personality_traits = calculate_personality_traits(all_text, sample_posts)

        result = {
            "username": username,
            "followers": followers,
            "following": following,
            "bio": bio,
            "sample_posts": sample_posts,
            "posts": len(posts_list),
            "sentiment": sentiment,
            "personality_traits": personality_traits,
            "mock_data": False
        }
        
        print(f"✅ Real API analysis complete for @{username}")
        return jsonify(result)

    except requests.exceptions.Timeout:
        print(f"⏱️ API request timeout for @{username}")
        return jsonify({
            "error": "Request timeout",
            "message": "Instagram API took too long to respond"
        }), 504
        
    except Exception as e:
        print(f"❌ Error analyzing @{username}: {str(e)}")
        return jsonify({
            "error": "Failed to analyze profile",
            "details": str(e)
        }), 500


# ============================================
# ANALYSIS HELPER FUNCTIONS
# ============================================

def calculate_sentiment(text):
    """
    Calculate sentiment scores from text
    Returns: dict with positive, negative, neutral scores
    """
    if not text or len(text.strip()) == 0:
        return {"positive": 0.33, "negative": 0.33, "neutral": 0.34}
    
    text_lower = text.lower()
    
    # Expanded word lists with emojis
    positive_words = [
        'love', 'happy', 'great', 'amazing', 'wonderful', 'best', 'awesome',
        'fantastic', 'excellent', 'beautiful', 'perfect', 'thank', 'blessed',
        'grateful', 'incredible', 'inspiring', 'joyful', 'excited', 'proud',
        'successful', 'win', 'victory', 'champion', 'achieve', 'accomplish',
        '❤️', '😊', '😍', '🎉', '✨', '💪', '🙏', '😀', '😄', '🔥', '💯',
        '🏆', '🌟', '💖', '👏', '🎊', '😁', '🥰', '💕', '🌈', '☀️'
    ]
    
    negative_words = [
        'hate', 'sad', 'bad', 'terrible', 'worst', 'awful', 'horrible',
        'disappointing', 'angry', 'upset', 'frustrated', 'annoying', 'difficult',
        'pain', 'hurt', 'problem', 'issue', 'fail', 'failure', 'wrong',
        '😢', '😞', '😡', '💔', '😭', '😔', '😩', '😤', '👎', '😰', '😥'
    ]
    
    # Count occurrences
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    # Calculate scores with baseline
    total = max(positive_count + negative_count, 1)
    
    positive_score = (positive_count / total) * 0.7 + 0.15
    negative_score = (negative_count / total) * 0.5
    neutral_score = max(1 - positive_score - negative_score, 0.1)
    
    # Normalize to sum to 1
    total_score = positive_score + negative_score + neutral_score
    if total_score > 0:
        positive_score /= total_score
        negative_score /= total_score
        neutral_score /= total_score
    
    return {
        "positive": round(positive_score, 2),
        "negative": round(negative_score, 2),
        "neutral": round(neutral_score, 2)
    }


def calculate_personality_traits(text, posts):
    """
    Calculate Big Five personality traits from text
    Returns: dict with openness, conscientiousness, extraversion, agreeableness, neuroticism
    """
    if not text or len(text.strip()) == 0:
        return {
            "openness": 0.5,
            "conscientiousness": 0.5,
            "extraversion": 0.5,
            "agreeableness": 0.5,
            "neuroticism": 0.5
        }
    
    text_lower = text.lower()
    
    # Openness - Creativity, curiosity, open to experiences
    openness_words = [
        'travel', 'art', 'music', 'creative', 'explore', 'adventure',
        'learn', 'new', 'discover', 'inspire', 'dream', 'imagine',
        'curious', 'innovative', 'unique', 'original', 'artistic',
        '✈️', '🎨', '🎵', '🎭', '📚', '🌍', '🗺️', '🎪'
    ]
    openness_score = min(
        sum(1 for word in openness_words if word in text_lower) * 0.07 + 0.4,
        0.95
    )
    
    # Conscientiousness - Organization, responsibility, goal-oriented
    conscientiousness_words = [
        'work', 'goal', 'plan', 'achieve', 'success', 'focus',
        'dedicated', 'hard', 'discipline', 'organize', 'project',
        'professional', 'commitment', 'responsibility', 'efficient',
        '💼', '🎯', '📊', '📈', '✅', '⏰', '📝'
    ]
    conscientiousness_score = min(
        sum(1 for word in conscientiousness_words if word in text_lower) * 0.07 + 0.4,
        0.95
    )
    
    # Extraversion - Social, outgoing, energetic
    extraversion_words = [
        'friend', 'party', 'social', 'people', 'meet', 'fun',
        'together', 'celebrate', 'share', 'community', 'team',
        'networking', 'gathering', 'event', 'crowd',
        '🎉', '👥', '🎊', '🥳', '👯', '🎈', '🍾'
    ]
    extraversion_score = sum(1 for word in extraversion_words if word in text_lower) * 0.07
    # Boost for frequent posting
    if len(posts) > 7:
        extraversion_score += 0.25
    elif len(posts) > 4:
        extraversion_score += 0.15
    extraversion_score = min(extraversion_score + 0.3, 0.95)
    
    # Agreeableness - Friendly, compassionate, cooperative
    agreeableness_words = [
        'love', 'thank', 'grateful', 'help', 'support', 'care',
        'kind', 'appreciate', 'blessed', 'family', 'friend',
        'compassion', 'empathy', 'generous', 'sharing',
        '❤️', '🙏', '💕', '🤗', '💖', '😊', '🫶', '💙'
    ]
    agreeableness_score = min(
        sum(1 for word in agreeableness_words if word in text_lower) * 0.07 + 0.4,
        0.95
    )
    
    # Neuroticism - Emotional stability (lower is better)
    neuroticism_words = [
        'stress', 'worry', 'anxiety', 'fear', 'nervous', 'difficult',
        'hard', 'struggle', 'problem', 'issue', 'challenge', 'pressure',
        'overwhelm', 'exhausted', 'tired',
        '😰', '😔', '😩', '😥', '😓'
    ]
    neuroticism_score = min(
        sum(1 for word in neuroticism_words if word in text_lower) * 0.08 + 0.2,
        0.7
    )
    
    return {
        "openness": round(openness_score, 2),
        "conscientiousness": round(conscientiousness_score, 2),
        "extraversion": round(extraversion_score, 2),
        "agreeableness": round(agreeableness_score, 2),
        "neuroticism": round(neuroticism_score, 2)
    }


# ============================================
# UTILITY ENDPOINTS
# ============================================

@instagram_bp.route("/test", methods=["GET"])
def test_endpoint():
    """Test endpoint to verify API is working"""
    return jsonify({
        "status": "Instagram API is working! ✅",
        "mock_mode": USE_MOCK_DATA,
        "oauth_configured": INSTAGRAM_CLIENT_ID != "YOUR_INSTAGRAM_APP_ID",
        "rapidapi_configured": RAPIDAPI_KEY != "YOUR_RAPIDAPI_KEY",
        "endpoints": {
            "/instagram/connect": "GET - Start OAuth flow",
            "/instagram/callback": "GET - OAuth callback",
            "/instagram/profile": "GET - Get connected user profile",
            "/instagram/disconnect": "POST - Disconnect account",
            "/instagram/status": "GET - Check connection status",
            "/instagram/analyze": "POST - Analyze by username",
            "/instagram/test": "GET - This endpoint"
        }
    })


@instagram_bp.route("/deauthorize", methods=["POST"])
def deauthorize():
    """Handle Instagram app deauthorization (required by Instagram)"""
    print("🔓 App deauthorization requested")
    # In production, clean up user data here
    return jsonify({"message": "Deauthorization successful"}), 200


@instagram_bp.route("/delete", methods=["POST"])
def data_deletion():
    """Handle data deletion request (required by Instagram)"""
    print("🗑️ Data deletion requested")
    # In production, delete user data here
    return jsonify({
        "url": "https://yourapp.com/deletion-status",
        "confirmation_code": "unique_code_here"
    }), 200


# ============================================
# ERROR HANDLERS
# ============================================

@instagram_bp.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@instagram_bp.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500