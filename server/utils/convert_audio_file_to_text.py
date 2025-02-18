import speech_recognition as sr


def convert_audio_file_to_text(audio_file_path: str, language: str = 'en-US') -> str:
    # 오디오 파일을 텍스트로 변환
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file_path) as source:
        audio_data = recognizer.record(source)
        text = recognizer.recognize_google(
            audio_data, language=language)  # 언어 설정
    return text
