from flask import Blueprint, request, jsonify
from utils.transcribe_audio import transcribe_audio
from utils.request_chat_gpt import request_chat_gpt
from utils.download_youtube_video import download_youtube_video
from utils.extract_audio_from_video import extract_audio_from_video
import os

youtube_blueprint = Blueprint('youtube', __name__)


@youtube_blueprint.route('/youtube-to-text', methods=['POST'])
def youtube_to_text():
    data = request.json
    url = data.get('url')
    model = data.get('model')

    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    if not model:
        return jsonify({'error': 'No model provided'}), 400

    try:
        video_file_path = download_youtube_video(url)

        # 오디오 파일 경로 설정
        base, _ = os.path.splitext(video_file_path)
        audio_file_path = f"{base}.wav"

        # 오디오 추출
        extract_audio_from_video(video_file_path, audio_file_path)

        # 오디오를 텍스트로 변환
        text = transcribe_audio(
            audio_file_path, model)

        messages = [
            {"role": "system", "content": "너는 한국말로 답변을 해줘야 해."},
            {"role": "user", "content": f"다음 텍스트를 요약해줘: {text}"}
        ]

        summary = request_chat_gpt(messages)

        return jsonify({'original_text': text, 'summary': summary}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
