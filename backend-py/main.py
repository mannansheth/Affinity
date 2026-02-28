from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch
import time
import re
from datetime import datetime
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

def parse_whatsapp_chat_from_text(raw_text):
    messages = []
    current_message = None

    message_pattern = re.compile(
        r'^\[?'
        r'(\d{1,2}/\d{1,2}/\d{2,4}),\s'
        r'(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[APMapm]{2})?)'
        r'\]?\s?(?:-\s)?'
        r'([^:]+):\s'
        r'(.*)'
    )

    lines = raw_text.splitlines()

    for line in lines:
        line = line.strip()

        # 🔥 normalize weird WhatsApp spaces
        line = line.replace("\u202f", " ").replace("\u00a0", " ")

        match = message_pattern.match(line)

        if match:
            if current_message:
                msg_text = current_message["message"].strip()
                if msg_text and msg_text != "<Media omitted>":
                    messages.append(current_message)

            date_str, time_str, sender, message = match.groups()

            try:
                year_part = date_str.split("/")[-1]

                is_12hr = "AM" in time_str.upper() or "PM" in time_str.upper()
                has_seconds = time_str.count(":") == 2

                if is_12hr:
                    if len(year_part) == 2:
                        fmt = "%d/%m/%y %I:%M:%S %p" if has_seconds else "%d/%m/%y %I:%M %p"
                    else:
                        fmt = "%d/%m/%Y %I:%M:%S %p" if has_seconds else "%d/%m/%Y %I:%M %p"
                else:
                    if len(year_part) == 2:
                        fmt = "%d/%m/%y %H:%M:%S" if has_seconds else "%d/%m/%y %H:%M"
                    else:
                        fmt = "%d/%m/%Y %H:%M:%S" if has_seconds else "%d/%m/%Y %H:%M"

                timestamp = datetime.strptime(f"{date_str} {time_str}", fmt)

            except:
                continue

            current_message = {
                "sender": sender.strip(),
                "timestamp": timestamp.isoformat(),
                "message": message.strip()
            }

        else:
            if current_message:
                current_message["message"] += " " + line

    if current_message:
        msg_text = current_message["message"].strip()
        if msg_text and msg_text != "<Media omitted>":
            messages.append(current_message)

    return messages[-500:]


@app.route("/parse-chat", methods=["POST"])
def parse_chat():
    data = request.json

    if not data or "raw_text" not in data:
        return jsonify({"error": "No raw text provided"}), 400

    raw_text = data["raw_text"]

    messages = parse_whatsapp_chat_from_text(raw_text)

    return jsonify({
        "status": "success",
        "messages": messages
    })

# Load model once at startup
MODEL_NAME = "tabularisai/multilingual-sentiment-analysis"

print("Loading model... (this may take a minute first time)")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

device = 0 if torch.cuda.is_available() else -1

sentiment_pipeline = pipeline(
    "text-classification",
    model=model,
    tokenizer=tokenizer,
    device=device
)

print("Model loaded successfully.")

# Map model labels to numeric values
LABEL_MAP = {
    "Very Negative": -2,
    "Negative": -1,
    "Neutral": 0,
    "Positive": 1,
    "Very Positive": 2
}

@app.route("/analyze-sentiment", methods=["POST"])
def analyze_sentiment():
    try:
        data = request.json
        print("Request received")
        start = time.perf_counter()
        if not data or "messages" not in data:
            return jsonify({"error": "Missing 'messages' field"}), 400

        messages = data["messages"]

        if not isinstance(messages, list):
            return jsonify({"error": "'messages' must be a list"}), 400

        # Run batch inference
        results = sentiment_pipeline(
            messages,
            truncation=True,
            max_length=512
        )
        # Convert to numeric
        scores = []
        for i, result in enumerate(results):
            label = result["label"]
            numeric_score = LABEL_MAP.get(label, 0)

            scores.append({
                "index": i,
                "label": label,
                "score": numeric_score,
                "confidence": float(result["score"])
            })
        print("done")
        return jsonify({
            "success": True,
            "scores": scores
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        end = time.perf_counter()
        print(f"Time taken: {end - start:.6f} seconds")


if __name__ == "__main__":
    app.run(port=8000, debug=True)