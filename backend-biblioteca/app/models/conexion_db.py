from flask_sqlalchemy import SQLAlchemy


# Crear instancia global de SQLAlchemy
db = SQLAlchemy()

# Función para inicializar la base de datos
def init_db(app):
    """Inicializa la base de datos con la aplicación Flask"""
    db.init_app(app)
    