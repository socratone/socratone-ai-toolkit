from flask import Blueprint, request, jsonify
from langchain.agents import create_agent


chat_gpt_blueprint = Blueprint("chat_gpt", __name__)


def extract_last_content(result):
    """agent 실행 결과에서 마지막 메시지의 content를 추출하는 함수

    Args:
        result: agent.invoke()의 실행 결과 (dict 또는 객체)

    Returns:
        str: 추출된 content 문자열
    """
    content = ""

    # isinstance()는 변수의 타입을 확인하는 함수
    # result가 딕셔너리(dict) 타입인지 확인
    if isinstance(result, dict):
        # "messages" 키가 딕셔너리 안에 있는지 확인
        if "messages" in result:
            # result["messages"][-1]은 리스트의 마지막 요소를 가져옴 ([-1]은 마지막 인덱스)
            last_message = result["messages"][-1]
            # hasattr()은 객체가 특정 속성을 가지고 있는지 확인하는 함수
            # last_message 객체에 "content"라는 속성이 있는지 확인
            if hasattr(last_message, "content"):
                content = last_message.content
        # "messages" 키가 없고 "content" 키가 있는 경우
        elif "content" in result:
            content = result["content"]
    # result가 딕셔너리가 아니지만 content 속성을 가진 객체인 경우
    elif hasattr(result, "content"):
        content = result.content
    # 위의 모든 경우에 해당하지 않으면 result를 문자열로 변환
    else:
        content = str(result)

    return content


@chat_gpt_blueprint.route("/chat-gpt", methods=["POST"])
def chat_gpt():
    """chat gpt에 메시지를 전송하는 API입니다."""
    data = request.json
    model = data.get("model")
    messages = data.get("messages")

    try:
        agent = create_agent(
            model=model,
        )

        result = agent.invoke({"messages": messages})

        # 마지막 메시지의 content 추출
        content = extract_last_content(result)

        return jsonify({"content": content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
