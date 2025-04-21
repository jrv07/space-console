from typing import List
from chat.openai_handler import get_chat_response
from schemas.chat import ChatMessage

def generate_response(history: List[ChatMessage]):
    return get_chat_response(history)
