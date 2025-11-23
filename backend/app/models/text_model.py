import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
import os

# Load pre-trained model and tokenizer
MODEL_PATH = "app/models/lstm_personality_model.h5"
TOKENIZER_PATH = "app/models/tokenizer.pkl"

# Check if model exists, if not create a mock one
if os.path.exists(MODEL_PATH):
    model = keras.models.load_model(MODEL_PATH)
    with open(TOKENIZER_PATH, 'rb') as f:
        tokenizer = pickle.load(f)
else:
    print("⚠️ Model not found. Using mock LSTM model for demonstration.")
    model = None
    tokenizer = None

# LSTM Model Definition (if you need to train one)
def create_lstm_model(vocab_size=5000, embedding_dim=128, max_length=100):
    """Create LSTM model for personality trait prediction"""
    model = keras.Sequential([
        keras.layers.Embedding(vocab_size, embedding_dim, input_length=max_length),
        keras.layers.Bidirectional(keras.layers.LSTM(64, return_sequences=True)),
        keras.layers.Dropout(0.3),
        keras.layers.Bidirectional(keras.layers.LSTM(32)),
        keras.layers.Dropout(0.3),
        keras.layers.Dense(128, activation='relu'),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(5, activation='sigmoid')  # 5 personality traits
    ])
    model.compile(
        optimizer='adam',
        loss='mse',
        metrics=['mae']
    )
    return model

def analyze_text(text):
    """Analyze text using LSTM model"""
    
    if not text or len(text.strip()) == 0:
        return {
            "text": text,
            "personality_traits": {
                "openness": 0.5,
                "conscientiousness": 0.5,
                "extraversion": 0.5,
                "agreeableness": 0.5,
                "neuroticism": 0.5
            },
            "emotions": ["neutral"]
        }
    
    try:
        if model is not None and tokenizer is not None:
            # Preprocess text
            sequences = tokenizer.texts_to_sequences([text])
            padded = pad_sequences(sequences, maxlen=100, padding='post')
            
            # Make prediction
            predictions = model.predict(padded, verbose=0)
            traits = predictions[0]
            
            personality_traits = {
                "openness": float(traits[0]),
                "conscientiousness": float(traits[1]),
                "extraversion": float(traits[2]),
                "agreeableness": float(traits[3]),
                "neuroticism": float(traits[4])
            }
        else:
            # Mock predictions if model not loaded
            text_length = len(text.split())
            openness = 0.5 + (0.2 if text_length > 50 else 0)
            conscientiousness = 0.6 if any(word in text.lower() for word in ['plan', 'organized', 'careful']) else 0.4
            extraversion = 0.7 if any(word in text.lower() for word in ['excited', 'happy', 'social']) else 0.3
            agreeableness = 0.6 if any(word in text.lower() for word in ['help', 'care', 'kind']) else 0.4
            neuroticism = 0.5 if any(word in text.lower() for word in ['worried', 'anxious', 'stressed']) else 0.3
            
            personality_traits = {
                "openness": min(openness, 1.0),
                "conscientiousness": min(conscientiousness, 1.0),
                "extraversion": min(extraversion, 1.0),
                "agreeableness": min(agreeableness, 1.0),
                "neuroticism": min(neuroticism, 1.0)
            }
        
        # Determine emotions based on traits
        emotions = []
        if personality_traits["extraversion"] > 0.6:
            emotions.append("joy")
        if personality_traits["openness"] > 0.6:
            emotions.append("interest")
        if personality_traits["neuroticism"] > 0.6:
            emotions.append("anxiety")
        if personality_traits["agreeableness"] > 0.6:
            emotions.append("trust")
        
        if not emotions:
            emotions = ["neutral"]
        
        return {
            "text": text,
            "personality_traits": personality_traits,
            "emotions": emotions
        }
    
    except Exception as e:
        print(f"Error in LSTM analysis: {e}")
        return {
            "text": text,
            "personality_traits": {
                "openness": 0.5,
                "conscientiousness": 0.5,
                "extraversion": 0.5,
                "agreeableness": 0.5,
                "neuroticism": 0.5
            },
            "emotions": ["neutral"],
            "error": str(e)
        }
