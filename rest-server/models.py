from sqlalchemy import Table, Column, Integer, String
from db import metadata

items = Table(
    "items",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100)),
    Column("description", String(250)),
)

