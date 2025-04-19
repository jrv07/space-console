### dependencies.py

from fastapi import Depends, HTTPException, Request
from auth.auth_handler import decode_access_token
from typing import Optional

def get_current_user(request: Request):
    token: Optional[str] = None

    # First try the Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    else:
        # Fallback: try getting token from cookies
        token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = decode_access_token(token)  # This should be your JWT decoding function
        return payload  # Usually includes user_id or user details
    except Exception as e:
        print(f"Token decode error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")


