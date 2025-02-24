from transformers import pipeline


def transcribe_audio(audio_file_path: str, model: str, return_timestamps) -> str:
    """오디오를 텍스트로 변환하는 함수입니다."""
    pipe = pipeline(
        "automatic-speech-recognition", model=model, return_timestamps=return_timestamps
    )

    result = pipe(audio_file_path)
    text = result["text"]
    return text
