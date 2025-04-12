from databases import Database
from sqlalchemy import create_engine, MetaData
import pymysql
DATABASE_URL = "mysql+pymysql://root:admin@db:3306/space_console"

database = Database(DATABASE_URL)

engine = create_engine(DATABASE_URL)
metadata = MetaData()
