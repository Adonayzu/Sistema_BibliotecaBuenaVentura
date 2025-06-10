from flask import Flask
from .config import Config
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .models.conexion_db import db
from .schemas import ma
from dotenv import load_dotenv
from .routes.routes import (
    modulos_bp,  
    usuarios_bp,  
    roles_bp,
    libros_bp,
    clientes_bp,
    prestamos_bp
)
from .routes.auth import auth_bp


def create_app():
    # Load environment variables from .env file
    #load_dotenv()

    # Create Flask application instance
    app = Flask(__name__)

    # Load configuration from Config class
    app.config.from_object(Config)

    # Initialize CORS
    cors_origins = app.config.get("CORS_ORIGINS", "*").split(",")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True)

    # Initialize JWT Manager
    jwt = JWTManager(app)

    # Initialize SQLAlchemy
    db.init_app(app)

    # Initialize Marshmallow
    ma.init_app(app)

    # Registrar el blueprint de autenticación
    app.register_blueprint(auth_bp)
    
    # Registrar el blueprint de obtener modulos y menús
    app.register_blueprint(modulos_bp)
    
    # Registrar el blueprint de roles
    app.register_blueprint(roles_bp)

    # Registrar blueprints de routes
    app.register_blueprint(usuarios_bp)
    
    # Registrar blueprints de libros
    app.register_blueprint(libros_bp)
    
    # Registrar blueprints de clientes
    app.register_blueprint(clientes_bp)
    
    # Registrar blueprints de prestamos
    app.register_blueprint(prestamos_bp)


    return app