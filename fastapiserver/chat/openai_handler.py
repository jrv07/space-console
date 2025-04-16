from openai import OpenAI

from config import settings

OpenAI.api_key = settings.OPENAI_API_KEY
gpt_client = OpenAI(api_key=OpenAI.api_key)

def get_chat_response(prompt: str) -> str:
    response = gpt_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.replace("⁠  json", "").replace("  ⁠", "").replace("\n", "")
