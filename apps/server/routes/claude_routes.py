from flask import Blueprint, request, jsonify, Response, stream_with_context
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
import os


claude_blueprint = Blueprint("claude", __name__)


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


@claude_blueprint.route("/claude", methods=["POST"])
def claude():
    """Claude에 메시지를 전송하는 API입니다."""
    data = request.json
    model = data.get("model", "claude-3-5-sonnet-20241022")  # 기본 모델 설정
    messages = data.get("messages")

    try:
        # ChatAnthropic을 사용하여 Claude 모델 초기화
        llm = ChatAnthropic(
            model=model,
            temperature=0.7,
            api_key=os.getenv("ANTHROPIC_API_KEY"),
        )

        # 메시지를 LangChain 형식으로 변환
        langchain_messages = []
        for msg in messages:
            if msg["role"] == "system":
                langchain_messages.append(SystemMessage(content=msg["content"]))
            elif msg["role"] == "user":
                langchain_messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                langchain_messages.append(AIMessage(content=msg["content"]))

        # invoke() 메서드로 응답 생성
        result = llm.invoke(langchain_messages)

        # 마지막 메시지의 content 추출
        content = extract_last_content(result)

        return jsonify({"content": content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@claude_blueprint.route("/claude/stream", methods=["POST"])
def claude_stream():
    """Claude에 메시지를 스트리밍 방식으로 전송하는 API입니다."""
    data = request.json
    model = data.get("model", "claude-3-5-sonnet-20241022")  # 기본 모델 설정
    messages = data.get("messages")

    def generate():
        """스트리밍 응답을 생성하는 제너레이터 함수"""
        try:
            # ChatAnthropic을 사용하여 토큰 단위 스트리밍
            llm = ChatAnthropic(
                model=model,
                temperature=0.7,
                streaming=True,
                api_key=os.getenv("ANTHROPIC_API_KEY"),
            )

            # 메시지를 LangChain 형식으로 변환
            langchain_messages = []
            for msg in messages:
                if msg["role"] == "system":
                    langchain_messages.append(SystemMessage(content=msg["content"]))
                elif msg["role"] == "user":
                    langchain_messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    langchain_messages.append(AIMessage(content=msg["content"]))

            chunk_count = 0

            # stream() 메서드로 토큰 단위 스트리밍
            for chunk in llm.stream(langchain_messages):
                chunk_count += 1
                # chunk는 AIMessageChunk 객체
                if hasattr(chunk, "content") and chunk.content:
                    content = chunk.content
                    # Server-Sent Events 형식으로 데이터 전송
                    yield f"data: {content}\n\n"

            # 스트리밍 종료 신호
            yield "data: [DONE]\n\n"

        except Exception as e:
            # 에러 발생 시 에러 메시지 전송
            print(f"[STREAM] 에러 발생: {str(e)}")
            import traceback

            print(f"[STREAM] 스택 트레이스:\n{traceback.format_exc()}")
            yield f'data: {{"error": "{str(e)}"}}\n\n'

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
