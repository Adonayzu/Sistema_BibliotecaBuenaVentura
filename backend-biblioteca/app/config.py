import os

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")  # Cargado desde .env
    
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")  
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600))  
    SECRET_KEY = os.getenv("SECRET_KEY") 
    ENV = os.getenv("FLASK_ENV", "production")  
    APP_PORT = int(os.getenv("APP_PORT", 5000))  
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost,http://frontend-biblioteca-container:3000,http://backend-biblioteca-container:5000")