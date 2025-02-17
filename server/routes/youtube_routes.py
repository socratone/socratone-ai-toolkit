from flask import Blueprint, request, jsonify
from pytubefix import YouTube

youtube_blueprint = Blueprint('youtube', __name__)


@youtube_blueprint.route('/youtube-to-text', methods=['POST'])
def youtube_to_text():
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    try:
        yt = YouTube(url)
        stream = yt.streams.filter(
            progressive=True, file_extension='mp4').first()
        stream.download(output_path='downloads/')  # 다운로드할 경로 설정
        return jsonify({'message': 'Download started!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
