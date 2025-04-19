from typing import List
from openai import OpenAI

from config import settings
from schemas.chat import ChatMessage
from logger import logger
OpenAI.api_key = settings.OPENAI_API_KEY
gpt_client = OpenAI(api_key=OpenAI.api_key)

def get_chat_response(history: dict[ChatMessage]) -> str:
    # Extract role and content from the ChatMessage objects
    logger.debug(history)


    # Make the API call with the correct format
    response = gpt_client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=history
    )
    # Return the assistant's response, stripping unwanted characters
    return response.choices[0].message.content.replace("⁠  json", "").replace("  ⁠", "").replace("\n", "")
