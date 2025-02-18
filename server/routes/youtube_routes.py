from flask import Blueprint, request, jsonify
from utils.youtube_downloader import download_youtube_video

youtube_blueprint = Blueprint('youtube', __name__)


@youtube_blueprint.route('/youtube-to-text', methods=['POST'])
def youtube_to_text():
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    try:
        download_youtube_video(url)
        return jsonify({'message': 'Download started!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
