# Socratone GPT

OPENAI_API_KEY를 이용한 챗지피티 앱.\
[chatgpt.com](https://chatgpt.com) 대신 사용하기 위해 작성했습니다.

다음과 같은 장점이 있습니다.

- 쓴 만큼만 비용을 낼 수 있다.
- system role의 message를 설정할 수 있다. (현재는 웹개발자로 설정)

반대로 단점은 다음과 같습니다.

- history가 남지 않는다.

## Env

아래 링크에서 발급한 키를 `.env`에 넣어야 합니다.

https://platform.openai.com/settings/organization/api-keys

```
OPENAI_API_KEY=???
```

## 사용량 확인

https://platform.openai.com/settings/organization/usage
