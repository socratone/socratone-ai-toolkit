from flask import Blueprint, request, jsonify
from utils.download_youtube_video import download_youtube_video
from utils.extract_audio_from_video import extract_audio_from_video
from utils.convert_audio_file_to_text import convert_audio_file_to_text
import os

youtube_blueprint = Blueprint('youtube', __name__)


@youtube_blueprint.route('/youtube-to-text', methods=['POST'])
def youtube_to_text():
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    try:
        video_file_path = download_youtube_video(url)

        # 오디오 파일 경로 설정
        base, _ = os.path.splitext(video_file_path)
        audio_file_path = f"{base}.wav"

        # 오디오 추출
        extract_audio_from_video(video_file_path, audio_file_path)

        # 오디오를 텍스트로 변환
        # TODO: 영어로 바꿀 수 있어야 함
        text = convert_audio_file_to_text(audio_file_path, 'ko-KR')

        return jsonify({'text': text}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
