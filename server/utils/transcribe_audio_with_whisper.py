from transformers import pipeline


def transcribe_audio_with_whisper(audio_file_path: str):
    pipe = pipeline("automatic-speech-recognition",
                    model="openai/whisper-large-v3-turbo",
                    return_timestamps=True)

    result = pipe(audio_file_path)
    text = result['text']
    return text
