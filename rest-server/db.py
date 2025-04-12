from databases import Database
from sqlalchemy import create_engine, MetaData
import pymysql
from dotenv import load_dotenv
import os
# Load .env variables
load_dotenv()

# Read from environment
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:3306/{DB_NAME}"

database = Database(DATABASE_URL)

engine = create_engine(DATABASE_URL)
metadata = MetaData()
