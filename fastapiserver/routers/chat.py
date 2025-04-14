from fastapi import APIRouter, Depends
from chat.chat_service import generate_response
from auth.dependencies import get_current_user
from schemas.chat import ChatRequest, ChatResponse

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint( chat_request: ChatRequest,user=Depends(get_current_user)):
    reply = generate_response(chat_request.prompt)
    return ChatResponse(reply=reply)