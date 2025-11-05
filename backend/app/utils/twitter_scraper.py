import tweepy

bearer_token = "AAAAAAAAAAAAAAAAAAAAAAHN3QEAAAAAhtsx7RnSxuc5JqMXxPMe4Gcii%2FE%3DXLoj7vNiJ6q43Wb1Zkxad47a5IMnCT5WQp37obdwAkqA7oTazq"  # 🔐 Replace this

client = tweepy.Client(bearer_token=bearer_token)

def fetch_user_tweets(username, max_results=10):
    try:
        user = client.get_user(username=username)
        user_id = user.data.id

        tweets = client.get_users_tweets(id=user_id, max_results=max_results)
        return [tweet.text for tweet in tweets.data] if tweets.data else []
    except Exception as e:
        return {"error": str(e)}
