from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import Config
from .models.conexion_db import db
from .schemas import ma
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
    app = Flask(__name__)
    
    
    app.config.from_object(Config)

    # Permitir cualquier origen para CORS
    CORS(app, supports_credentials=True)

    # Inicializar JWT Manager
    jwt = JWTManager(app)

    # Inicializar SQLAlchemy
    db.init_app(app)

    # Inicializar Marshmallow
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