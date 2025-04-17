from pydantic import BaseModel
from typing import List, Optional, Union

"""
class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    reply: str
# --- Define Chat Message format ---"""
class ChatMessage(BaseModel):
    role: str  # 'user', 'assistant', 'system'
    content: Optional[str] = None
    data: Optional[Union[List[dict], dict]] = None

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    session_id: str 
    messages: List[ChatMessage]