from pydantic import BaseModel
from datetime import date
from typing import Optional

class SalesDataOut(BaseModel):
    Date: date
    Account_ID: int
    Account_Name: str
    Order_ID: int
    Revenue: Optional[float]
    Commission_Profit: Optional[float]
    Status: str
    Quantity: Optional[int]
    Target_Revenue: Optional[float]

    class Config:
        from_attributes = True  # for Pydantic v2
