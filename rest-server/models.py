from sqlalchemy import Table, Column, Integer, String, Date, Float
from db import metadata

items = Table(
    "items",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100)),
    Column("description", String(250)),
)

# Create the sales_data table
SalesData = Table(
    "sales_data",
    metadata,
    Column("Date", Date, nullable=False),  # Date of the sale (non-nullable)
    Column("Account_ID", Integer, nullable=False),  # Account ID (non-nullable)
    Column("Account_Name", String(100), nullable=False),  # Account name (non-nullable)
    Column("Order_ID", Integer, nullable=False),  # Order ID 
    Column("Revenue", Float, nullable=False),  # Revenue from the sale (non-nullable)
    Column("Commission_Profit", Float, nullable=False),  # Profit/commission from the sale (non-nullable)
    Column("Status", String(100), nullable=False),  # Status (shipped or cancelled)
    Column("Quantity", Integer, nullable=False),  # Quantity of items sold (non-nullable)
    Column("Target_Revenue", Float, nullable=False),  # Target revenue for the sale (non-nullable)
)