from transformers import pipeline


def transcribe_audio(audio_file_path: str, model: str) -> str:
    pipe = pipeline("automatic-speech-recognition",
                    model=model,
                    return_timestamps=True)

    result = pipe(audio_file_path)
    text = result['text']
    return text
