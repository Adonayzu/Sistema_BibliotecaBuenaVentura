from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.models import Usuario
from app.models import Roles
from app.routes.utils import FuncionesController
from flask_jwt_extended import jwt_required, get_jwt_identity


auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/', methods=['POST'])
def validar_login():

    # Validar las credenciales del usuario
    data = request.json

    if not data:
        return jsonify({"msg": "No se enviaron datos en la solicitud"}), 400

    usuario_input = data.get("txtUsr")
    clave_input = data.get("txtPass")

    if not usuario_input or not clave_input:
        return jsonify({"msg": "Usuario y clave son requeridos"}), 400

    usuario = Usuario.query.filter_by(usuario=usuario_input).first()

    if not usuario:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if not FuncionesController.verificar_password(clave_input, usuario.clave):
        return jsonify({"msg": "Clave incorrecta"}), 403

    # Crear token JWT
    access_token = create_access_token(identity=str(usuario.id_usuario))
    return jsonify({
        "msg": "Inicio de sesión exitoso",
        "access_token": access_token,
        "usuario": usuario.usuario,
        "id_usuario": usuario.id_usuario
    }), 200
    

# Verificar si el usuario está autenticado y devolver su información
@auth_bp.route('/check_user', methods=['GET'])
@jwt_required()
def check_sistema_user():
    
    # Verificar si el usuario está autenticado y devolver solo su nombre de usuario.

    try:
        # Obtener el ID del usuario autenticado desde el token JWT
        user_id = get_jwt_identity()

        # Validar que el ID del usuario sea válido
        if not user_id:
            return jsonify({"msg": "Token inválido o usuario no autenticado", "tipo": "error"}), 401

        # Buscar al usuario en la base de datos
        usuario = Usuario.query.filter_by(id_usuario=int(user_id)).first()

        if not usuario:
            return jsonify({"msg": "Usuario no encontrado", "tipo": "error"}), 404

        # Devolver solo el nombre del usuario
        return jsonify({
            "msg": "Usuario autenticado",
            "tipo": "success",
            "usuario": usuario.usuario
        }), 200
    except Exception as e:
        print("Error al verificar usuario:", str(e))  # Log para depuración
        return jsonify({"msg": "Error al verificar usuario", "error": str(e)}), 500
    
