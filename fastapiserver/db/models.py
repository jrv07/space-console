### models.py

from sqlalchemy import Table, Column, Integer, String, Float, Date, MetaData
from db.database import metadata, database
# Users table (if needed)
users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("username", String(50), unique=True, nullable=False),
    Column("email", String(100), unique=True, nullable=False),
    Column("hashed_password", String(255), nullable=False),
    Column("role", String(20), nullable=False, default="viewer")
)

# Sales Data table
sales_data = Table(
    "sales_data",
    metadata,
    Column("Date", Date, nullable=False),
    Column("Account_ID", Integer, nullable=False),
    Column("Account_Name", String(255), nullable=False),
    Column("Order_ID", Integer, primary_key=True),
    Column("Revenue", Float),
    Column("Commission_Profit", Float),
    Column("Status", String(255)),
    Column("Quantity", Integer),
    Column("Target_Revenue", Float)
)

async def get_user_by_username(username: str):
    query = users.select().where(users.c.username == username)
    return await database.fetch_one(query)
