from moviepy.editor import VideoFileClip


def extract_audio_from_video(video_file_path: str, output_audio_path: str) -> None:
    # VideoFileClip 클래스를 사용하여 비디오 파일을 엽니다.
    # `with` 문은 파일 열기와 닫기를 자동으로 처리해주는 컨텍스트 매니저 역할을 합니다.
    with VideoFileClip(video_file_path) as video:
        # 비디오 파일에서 오디오 부분만 추출합니다.
        audio = video.audio

        # 추출한 오디오를 지정된 경로에 파일로 저장합니다.
        # codec='pcm_s16le'는 오디오 코덱을 설정하는 부분으로, 여기서는 PCM 16-bit little-endian 코덱을 사용합니다.
        audio.write_audiofile(output_audio_path, codec="pcm_s16le")
