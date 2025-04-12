from fastapi import FastAPI, HTTPException
from db import database, engine, metadata
from models import items
from schemas import ItemIn, ItemOut

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