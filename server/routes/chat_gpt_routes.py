from flask import Blueprint, jsonify, request

from utils.request_chat_gpt import request_chat_gpt


chat_gpt_blueprint = Blueprint("chat_gpt", __name__)


@chat_gpt_blueprint.route("/chat-gpt", methods=["POST"])
def chat_gpt():
    data = request.json
    messages = data.get('messages')

    try:
        content = request_chat_gpt(messages)
        return jsonify({"content": content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
