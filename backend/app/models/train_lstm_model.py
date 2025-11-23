import os
import sys
import pandas as pd
import numpy as np
import pickle
from tensorflow import keras
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load dataset
DATA_PATH = "app/models/data/mbti_1.csv"
MODEL_PATH = "app/models/lstm_personality_model.h5"
TOKENIZER_PATH = "app/models/tokenizer.pkl"

print("📊 Loading MBTI dataset...")
df = pd.read_csv(DATA_PATH)

# Extract posts and MBTI types
texts = df['posts'].values
mbti_types = df['type'].values

print(f"Total samples: {len(texts)}")

# Map MBTI to personality traits (Big Five OCEAN model)
def mbti_to_ocean(mbti_type):
    """Convert MBTI to OCEAN personality traits (0-1 scale)"""
    traits = {
        'openness': 0.5,
        'conscientiousness': 0.5,
        'extraversion': 0.5,
        'agreeableness': 0.5,
        'neuroticism': 0.5
    }
    
    if mbti_type[0] == 'E':  # Extraversion
        traits['extraversion'] = 0.8
    else:
        traits['extraversion'] = 0.2
    
    if mbti_type[1] == 'S':  # Sensing (practical) - High Conscientiousness
        traits['conscientiousness'] = 0.8
    else:
        traits['conscientiousness'] = 0.3
    
    if mbti_type[2] == 'T':  # Thinking - Low Agreeableness
        traits['agreeableness'] = 0.3
    else:
        traits['agreeableness'] = 0.8
    
    if mbti_type[3] == 'J':  # Judging - High Conscientiousness
        traits['conscientiousness'] = 0.85
    else:
        traits['neuroticism'] = 0.7
    
    traits['openness'] = 0.6  # MBTI doesn't directly map to openness
    
    return list(traits.values())

# Convert MBTI to traits
y_data = np.array([mbti_to_ocean(mbti) for mbti in mbti_types])

print("🔤 Tokenizing texts...")
tokenizer = Tokenizer(num_words=5000, oov_token="<OOV>")
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
padded = pad_sequences(sequences, maxlen=100, padding='post')

print(f"Tokenizer vocab size: {len(tokenizer.word_index)}")
print(f"Padded sequences shape: {padded.shape}")

# Build LSTM model
print("🏗️ Building LSTM model...")
model = keras.Sequential([
    keras.layers.Embedding(5000, 128, input_length=100),
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

model.summary()

# Train model
print("🚀 Training LSTM model...")
history = model.fit(
    padded, y_data,
    epochs=3,         # lower for testing
    batch_size=32,    # reduce if memory error
    validation_split=0.2,
    verbose=1
)

# Save model and tokenizer
print(f"💾 Saving model to {MODEL_PATH}...")
model.save(MODEL_PATH)

print(f"💾 Saving tokenizer to {TOKENIZER_PATH}...")
with open(TOKENIZER_PATH, 'wb') as f:
    pickle.dump(tokenizer, f)

print("✅ Training complete!")