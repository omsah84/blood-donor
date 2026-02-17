import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import random_responses

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load bot responses from JSON
def load_json(file):
    try:
        with open(file, "r") as bot_responses:
            print(f"Loaded '{file}' successfully!")
            return json.load(bot_responses)
    except FileNotFoundError:
        print(f"Error: File '{file}' not found.")
        return []
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in '{file}'.")
        return []

responses_data = load_json("bot.json")

# Bot logic
def get_response(input_string):
    if not input_string.strip():
        return "Please type something so we can chat :)"

    split_message = re.split(r"\s+|[,;?!.-]\s*", input_string.lower())
    score_list = []

    for response in responses_data:
        required_words = [word.lower() for word in response.get("required_words", [])]
        user_inputs = [word.lower() for word in response["user_input"]]

        if all(word in split_message for word in required_words):
            score = sum(word in split_message for word in user_inputs)
            score_list.append(score)
        else:
            score_list.append(0)

    best_score = max(score_list)
    response_index = score_list.index(best_score)

    if best_score > 0:
        return responses_data[response_index]["bot_response"]
    else:
        return random_responses.random_string()

# Routes
@app.route("/")
def home():
    return "Chatbot API is running!"

@app.route("/chatbot", methods=["POST"])
def chatbot_response():
    data = request.json
    user_input = data.get("message", "")

    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    response = get_response(user_input)
    return jsonify({"response": response})

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
