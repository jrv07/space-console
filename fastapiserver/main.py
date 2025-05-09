# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import database
from routers import auth, sales, chat

app = FastAPI(title="SpaceConsole API", version="1.0.0")
# --- CORS SETUP ---
origins = [
    "http://localhost:3000",            # your React app
    "https://localhost:3000",           # if you ever run React over HTTPS
    # "https://your-production-domain", # add your prod domains here
]
# Allow CORS from frontend PRODUCTION LEVEL
app.add_middleware(
    CORSMiddleware,  #  `middleware_class`
    allow_origins=origins,  # or ["*"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup & shutdown
@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# Register routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(sales.router, prefix="/data", tags=["data"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
