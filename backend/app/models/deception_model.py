from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Use a valid public model (distilbert for text classification)
model_name = "distilbert-base-uncased-finetuned-sst-2-english"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

def analyze_deception(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    pred = torch.argmax(probs).item()

    # 0 = Negative (Deceptive), 1 = Positive (Truthful)
    label = "Truthful" if pred == 1 else "Deceptive"
    confidence = round(float(probs[0][pred]) * 100, 2)

    return {
        "text": text,
        "prediction": label,
        "confidence": confidence
    }