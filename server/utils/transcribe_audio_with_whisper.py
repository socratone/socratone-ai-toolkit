import whisper


def transcribe_audio_with_whisper(audio_file_path: str):
    # Whisper 모델 로드
    model = whisper.load_model("base")

    # 파일 경로를 사용하여 오디오를 텍스트로 변환
    result = model.transcribe(audio_file_path, language='korean')

    # 결과에서 텍스트 추출
    text = result['text']
    return text
