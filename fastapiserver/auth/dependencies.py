### dependencies.py

from fastapi import Depends, HTTPException, Request
from auth.auth_handler import decode_access_token


def get_current_user(request: Request):
    # Try to get the token from the Authorization header first (Bearer Token)
    auth_header = request.headers.get("Authorization")
    
    if auth_header:
        if "Bearer " in auth_header:
            token = auth_header.split(" ")[1]  # Extract token from Bearer header
        else:
            raise HTTPException(status_code=401, detail="Invalid token format")
    else:
        # If Authorization header is not present, check the cookies for the token
        token = request.cookies.get("access_token")
    
    # If no token is found, raise unauthorized error
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Try to decode the token and return the payload (user data)
    try:
        payload = decode_access_token(token)
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
