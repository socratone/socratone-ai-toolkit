# 베이스 이미지로 Python 3.9 사용
FROM python:3.9

# 시스템 패키지 업데이트 및 FLAC 유틸리티 설치
RUN apt-get update && apt-get install -y flac

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 패키지 설치
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# Flask 애플리케이션 실행
CMD ["python", "app.py"]
