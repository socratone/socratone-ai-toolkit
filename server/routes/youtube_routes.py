import os
from flask import Blueprint, request, jsonify
from utils.delete_file import delete_file
from utils.transcribe_audio import transcribe_audio
from utils.request_chat_gpt import request_chat_gpt
from utils.download_youtube_video import download_youtube_video
from utils.extract_audio_from_video import extract_audio_from_video

youtube_blueprint = Blueprint("youtube", __name__)


@youtube_blueprint.route("/youtube-to-text", methods=["POST"])
def youtube_to_text():
    """유튜브를 요약하는 API입니다."""
    data = request.json
    url = data.get("url")
    model = data.get("model")

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    if not model:
        return jsonify({"error": "No model provided"}), 400

    try:
        # 유튜브 파일 다운로드
        video_file_path = download_youtube_video(url)

        # 오디오 파일 경로 설정
        base, _ = os.path.splitext(video_file_path)
        audio_file_path = f"{base}.wav"

        # 오디오 추출
        extract_audio_from_video(video_file_path, audio_file_path)

        # 오디오를 텍스트로 변환
        text = transcribe_audio(audio_file_path, model, return_timestamps=True)

        # 파일 삭제
        delete_file([video_file_path, audio_file_path])

        messages = [
            {
                "role": "system",
                "content": "너는 한국말로 답변을 해줘야 해. 선생님처럼 쉽고 정확하게 알려줘야 해.",
            },
            {"role": "user", "content": f"다음 텍스트를 요약해줘: {text}"},
        ]

        summary = request_chat_gpt(messages)

        return jsonify({"original_text": text, "summary": summary}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
