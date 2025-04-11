from pydantic import BaseModel

class ItemIn(BaseModel):
    name: str
    description: str

class ItemOut(ItemIn):
    id: int