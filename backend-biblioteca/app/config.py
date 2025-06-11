 
import os

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URI",
        "mysql+pymysql://biblioteca:12345@localhost:3306/bd_biblioteca"
        # "mysql+pymysql://biblioteca:12345@mysql-biblioteca-container:3306/bd_biblioteca"
    )
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "clave-secreta")  # Valor por defecto
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 7200))  
    SECRET_KEY = os.getenv("SECRET_KEY", "clave-secreta")  
    ENV = os.getenv("FLASK_ENV", "development")  
    APP_PORT = int(os.getenv("APP_PORT", 5000))  
    CORS_ORIGINS = "*"  