from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv
import os


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / "dotenv-files" / ".env")


client = OpenAI(
    api_key=os.getenv("API_KEY", "change_me"),
    base_url="https://openrouter.ai/api/v1",
)


def send_message(message, messages_list=[]):
    messages_list.append(
        {
            "role": "user",
            "content": message,
        },
    )

    response = client.chat.completions.create(
        model="deepseek/deepseek-r1:free",
        messages=messages_list,
    )

    return response.choices[0].message.content
