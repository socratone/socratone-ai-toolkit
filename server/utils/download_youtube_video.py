import os
from pytubefix import YouTube


def download_youtube_video(url: str, output_path: str = "downloads/") -> str:
    """유튜브 파일를 다운로드하는 함수입니다."""
    if not url:
        raise ValueError("No URL provided")

    yt = YouTube(url)
    stream = yt.streams.filter(progressive=True, file_extension="mp4").first()
    if not stream:
        raise Exception("No suitable stream found")

    # 비디오 다운로드
    video_file_path = stream.download(output_path=output_path)

    # 파일 이름에서 공백과 쉼표 제거
    base, ext = os.path.splitext(video_file_path)
    new_file_path = base.replace(" ", "_").replace(",", "") + ext
    os.rename(video_file_path, new_file_path)

    return new_file_path
