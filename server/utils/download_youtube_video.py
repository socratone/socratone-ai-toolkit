from pytubefix import YouTube


def download_youtube_video(url: str, output_path: str = 'downloads/') -> str:
    if not url:
        raise ValueError("No URL provided")

    yt = YouTube(url)
    stream = yt.streams.filter(progressive=True, file_extension='mp4').first()
    if not stream:
        raise Exception("No suitable stream found")

    # 비디오 다운로드
    video_file_path = stream.download(output_path=output_path)
    return video_file_path
