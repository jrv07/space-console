from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from auth.auth_handler import create_access_token, verify_password
from db.models import get_user_by_username, users
from config import settings
from schemas.user import UserBase, UserCreate, UserLogin, UserOut
from utils.security import hash_password
from sqlalchemy import select
from db.database import database

router = APIRouter()

max_age = 60 * 60  # 1 hour

@router.post("/login", operation_id="login_user")
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    user = await get_user_by_username(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": user.username, "role": user.role})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # Set Secure=False for HTTP connections in local development
        samesite="Lax",  # Lax is fine for first-party requests
        max_age=3600
    )
    return JSONResponse(
        content={"message": "Login successful"},
        status_code=200,
        headers=response.headers  # carry over the Set-Cookie header
    )

@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED, operation_id="signup_user")
async def signup(user: UserCreate):
    # Check if the username or email already exists
    query = select(users).where((users.c.username == user.username) | (users.c.email == user.email))
    existing_user = await database.fetch_one(query)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered.")

    # Hash the password
    hashed_password = hash_password(user.password)

    # Insert the new user into the database
    insert_query = users.insert().values(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role  
    )
    user_id = await database.execute(insert_query)

    return UserOut(id=user_id, username=user.username, email=user.email, role="viewer")
