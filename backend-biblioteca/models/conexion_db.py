from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Crear instancia global de SQLAlchemy
db = SQLAlchemy()

def init_db(app):
    # Cargar las variables de entorno desde el archivo .env
    load_dotenv()

    # Obtener las variables de entorno necesarias
    db_host = os.getenv('DB_HOST', '').strip()
    db_port = os.getenv('DB_PORT', '3306').strip()  # Valor predeterminado: 3306
    db_user = os.getenv('DB_USER', '').strip()
    db_password = os.getenv('DB_PASSWORD', '').strip()
    db_name = os.getenv('DB_NAME', '').strip()

    # Configurar URI de conexión a la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desactivar el seguimiento de modificaciones para evitar advertencias

    # Inicializar SQLAlchemy con la app Flask
    db.init_app(app)
