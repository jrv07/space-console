from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    db_host: str
    db_user: str
    db_password: str 
    db_name: str
    port: int
    SECRET_KEY: str = "super-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    @property
    def DATABASE_URL(self):
        return f"mysql+pymysql://{self.db_user}:{self.db_password}@{self.db_host}:{self.port}/{self.db_name}"

    class Config:
        env_file = ".env"

settings = Settings()
