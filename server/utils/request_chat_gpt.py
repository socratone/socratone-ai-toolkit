from typing import List, Dict, Any
import json
import os
import requests


def request_chat_gpt(messages: List[Dict[str, str]]) -> Any:
    openai_api_key = os.getenv("OPENAI_API_KEY")

    api_request_body = {"model": "gpt-4o-mini", "messages": messages}

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {openai_api_key}",
        },
        data=json.dumps(api_request_body),
    )

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        raise Exception(
            f"Request failed with status code {response.status_code}: {response.text}"
        )
