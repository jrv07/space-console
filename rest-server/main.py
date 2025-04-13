from datetime import date
from fastapi import FastAPI, HTTPException, Query
from sqlalchemy import select, and_
from db import database, engine, metadata
from models import items, SalesData
from schemas import ItemIn, ItemOut, SalesDataIn, SalesDataOut

app = FastAPI()

# Create tables if not already created
metadata.create_all(engine)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/items/", response_model=ItemOut)
async def create_item(item: ItemIn):
    query = items.insert().values(name=item.name, description=item.description)
    item_id = await database.execute(query)
    return {**item.dict(), "id": item_id}

@app.get("/items/{item_id}", response_model=ItemOut)
async def read_item(item_id: int):
    query = items.select().where(items.c.id == item_id)
    item = await database.fetch_one(query)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

"""@app.post("/sales/", response_model=SalesDataOut)
async def create_sales_data(sales_data: SalesDataIn):
    query = SalesData.__table__.insert().values(
        Date=sales_data.Date,
        Account_ID=sales_data.Account_ID,
        Account_Name=sales_data.Account_Name,
        Order_ID=sales_data.Order_ID,
        Revenue=sales_data.Revenue,
        Commission_Profit=sales_data.Commission_Profit,
        Status=sales_data.Status,
        Quantity=sales_data.Quantity,
        Target_Revenue=sales_data.Target_Revenue
    )
    sales_data_id = await database.execute(query)  # Insert sales data into the database
    return {**sales_data.dict(), "id": sales_data_id}  # Return the inserted data with its ID
"""
@app.get("/sales/", response_model=list[SalesDataOut])
async def read_sales_data(    
    start_date: date = Query(..., description="Start date in YYYY-MM-DD format"),
    end_date: date = Query(..., description="End date in YYYY-MM-DD format")
):
    query = select(SalesData).where(
        and_(
            SalesData.c.Date >= start_date,
            SalesData.c.Date <= end_date
        )
    )
    sales_data = await database.fetch_all(query) # Fetch sales data from the database

    if sales_data is None:
        raise HTTPException(status_code=404, detail="Sales data not found")
    return sales_data  # Return the found sales data