from pydantic import BaseModel
from datetime import date

class ItemIn(BaseModel):
    name: str
    description: str

class ItemOut(ItemIn):
    id: int

# Input schema for creating sales data
class SalesDataIn(BaseModel):
    Date: date
    Account_ID: int
    Account_Name: str
    Order_ID: int
    Revenue: float
    Commission_Profit: float
    Status: str
    Quantity: int
    Target_Revenue: float



# Output schema for returning sales data details
class SalesDataOut(SalesDataIn):
    Date: date
    Account_ID: int
    Account_Name: str
    Order_ID: int
    Revenue: float
    Commission_Profit: float
    Status: str
    Quantity: int
    Target_Revenue: float

