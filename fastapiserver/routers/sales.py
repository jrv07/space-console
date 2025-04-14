from fastapi import APIRouter, Depends, HTTPException, Query
from auth.dependencies import get_current_user
from db.models import sales_data as sales_table  # avoid name clash
from db.database import database
from sqlalchemy import select, and_
from datetime import date
from typing import List
from schemas.sales import SalesDataOut  # you'll define this Pydantic model

router = APIRouter()


@router.get("/get_sales", response_model=List[SalesDataOut])
async def get_sales_data(
    user=Depends(get_current_user),
    start_date: date = Query(..., description="Start date in YYYY-MM-DD format"),
    end_date: date = Query(..., description="End date in YYYY-MM-DD format")
):
    if user["role"] not in ["admin", "viewer", "manager"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    if start_date > end_date:
        raise HTTPException(status_code=400, detail="start_date must be before end_date")

    query = select(sales_table).where(
        and_(
            sales_table.c.Date >= start_date,
            sales_table.c.Date <= end_date
        )
    )
    records = await database.fetch_all(query)

    if not records:
        raise HTTPException(status_code=404, detail="No sales data found for the given timeframe")

    return records
