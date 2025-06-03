from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from models.conexion_db import db, init_db  
from sqlalchemy import text
from models.usuario import Usuario  # Asegúrate de que este modelo esté definido correctamente
from models.modulo import Modulo
from models.menu_navegacion import MenuNavegacion



# Cargar variables de entorno desde .env
load_dotenv()

app = Flask(__name__)

# Configuración JWT y Flask
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "clave-secreta")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 7200))  # 2 horas
app.secret_key = os.getenv("SECRET_KEY", "clave-secreta")
app.config["ENV"] = os.getenv("FLASK_ENV", "development")

# Configuración de CORS
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True)

# Inicializar JWT
jwt = JWTManager(app)

# Inicializar la conexión a la base de datos
init_db(app)

# Ruta de prueba para verificar que la API está funcionando
@app.route('/', methods=['GET'])
def hello():
    return {"message": "API funcionando correctamente"}

# Probar la conexión a la base de datos 
@app.route('/test-db', methods=['GET'])
def test_db():
    try:
        with app.app_context():
            db.session.execute(text("SELECT 1")) # Ejecutar una consulta simple para verificar la conexión
        return {"message": "Conexión a la base de datos exitosa"}
    except Exception as e:
        return {"error": str(e)}







if __name__== "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("APP_PORT", 5000)),
        debug=os.getenv("FLASK_ENV") == "development"
    )