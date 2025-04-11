from databases import Database
from sqlalchemy import create_engine, MetaData
import pymysql
DATABASE_URL = "mysql+pymysql://root:HappyBirthdayDearPavan2024.@localhost:3306/finaltable"

database = Database(DATABASE_URL)

engine = create_engine(DATABASE_URL)
metadata = MetaData()
