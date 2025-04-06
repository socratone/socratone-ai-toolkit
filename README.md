# Socratone AI Toolkit

AI를 이용한 도구 모음 웹 어플리케이션

.env에 키를 넣고 로컬에서 사용합니다.

![스크린샷](docs/screen-shot.png)

## 사용 가능 AI 모델

- OpenAI
- Deepseek
- ExaOne

## 실행 방법

### Prerequisites

아래 앱 설치가 필요합니다.

- [Docker](https://www.docker.com) 설치
- [Ollama](https://ollama.com) 설치
  - `deepseek-r1:7b`
  - `exaone3.5:latest`

### Env

아래 링크에서 발급한 키를 `.env`에 넣어야 합니다.

https://platform.openai.com/settings/organization/api-keys

```
OPENAI_API_KEY=???
FLASK_ENV="production"
```

### Scripts

**1\. 빌드**

```
pnpm build
```

**2\. 실행**

```
pnpm start
```

**3\. 링크**

http://localhost:4000

## Open AI 토큰 사용량 확인

https://platform.openai.com/settings/organization/usage

## 개발 환경

### 파이썬 익스텐션

- [Pylint](https://marketplace.visualstudio.com/items?itemName=ms-python.pylint)
- [Black Formatter](https://marketplace.visualstudio.com/items?itemName=ms-python.black-formatter)
