from moviepy.editor import VideoFileClip


def extract_audio_from_video(video_file_path: str, output_audio_path: str) -> None:
    # 비디오 파일에서 오디오 추출
    with VideoFileClip(video_file_path) as video:
        audio = video.audio
        audio.write_audiofile(output_audio_path, codec='pcm_s16le')
