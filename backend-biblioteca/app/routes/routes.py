from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from sqlalchemy.orm import joinedload
from app.routes.utils import FuncionesController
from app.models.conexion_db import db
from app.models import Cliente, Libro, Prestamo, Usuario, Estado, Roles, MenuNavegacion, Modulo, TipoEstado
from app.schemas import (
    usuario_schema, usuarios_schema,
    cliente_schema, clientes_schema,
    roles_schema, roles_schema_many, AsignarRolSchema,
    libro_schema, libros_schema,
    prestamo_schema, prestamos_schema,
    estado_schema, estados_schema,
    menu_navegacion_schema, menu_navegaciones_schema,
    modulo_schema, modulos_schema,
    tipo_estado_schema, tipo_estados_schema
)

#----Blueprint-----------
modulos_bp = Blueprint('modulos', __name__, url_prefix='/modulos')
usuarios_bp = Blueprint('usuarios', __name__, url_prefix='/usuarios')
roles_bp = Blueprint('roles', __name__, url_prefix='/roles')

# Obtener modulos y menus segun el rol del usuario y sus roles
@modulos_bp.route('/', methods=['GET'])
@jwt_required()
def obtener_modulos():
    """
    Obtener módulos y menús según el rol del usuario autenticado.
    """
    try:
        # Obtener el ID del usuario autenticado desde el token
        user_id = get_jwt_identity()
        print("Token recibido, ID del usuario autenticado:", user_id)  # Log para depuración

        if not user_id:
            return jsonify({"msg": "No se pudo obtener el usuario autenticado"}), 401

        # Consultar los roles del usuario autenticado
        roles = Roles.query.options(
            joinedload(Roles.menu_navegacion).joinedload(MenuNavegacion.modulo)
        ).filter_by(
            id_usuario=user_id,  # Filtrar por el usuario autenticado
            id_estado=1  # Solo roles activos
        ).all()

        if not roles:
            return jsonify({"msg": "No se encontraron roles para el usuario"}), 404

        # Procesar los módulos y menús relacionados
        modulos = {}
        for rol in roles:
            menu = rol.menu_navegacion
            if menu and menu.modulo:
                modulo = menu.modulo
                if modulo.id_modulo not in modulos:
                    modulos[modulo.id_modulo] = {
                        "id_modulo": modulo.id_modulo,
                        "nombre_modulo": modulo.nombre_modulo,
                        "menus": []
                    }
                modulos[modulo.id_modulo]["menus"].append({
                    "id_menu": menu.id_menu_navegacion,
                    "nombre_menu": menu.nombre_menu_navegacion,
                    "url_menu": menu.url_menu
                })

        # Convertir el diccionario de módulos a una lista
        modulos_serializados = list(modulos.values())

        # Incluir el id_usuario en la respuesta
        respuesta = {
            "id_usuario": user_id,
            "modulos": modulos_serializados
        }

        return jsonify(respuesta), 200
    except Exception as e:
        print("Error al obtener módulos:", str(e))  # Log para depuración
        return jsonify({"msg": "Error al obtener módulos", "error": str(e)}), 500



# MODULO DE CONFIGURACION 
# Obtener todos los usuarios
@usuarios_bp.route('/', methods=['GET'])
@jwt_required() # para que pida el token de autenticación
def get_usuarios():
    # Filtrar usuarios con id_estado == 1
    usuarios_activos = Usuario.query.filter_by(id_estado=1).all()
    return usuarios_schema.dump(usuarios_activos), 200


# Crear un nuevo usuario
@usuarios_bp.route('/create_user', methods=['POST'])
@jwt_required()
def create_user():
    try:
        # Validar y deserializar los datos enviados en la solicitud utilizando el schema
        # load es para hacer la conversión de los datos JSON a un objeto Usuario
        nuevo_usuario = usuario_schema.load(request.json)

        # Encriptar la contraseña antes de guardarla
        nuevo_usuario.clave = FuncionesController.creapass(nuevo_usuario.clave)

        # Agregar el usuario a la base de datos
        db.session.add(nuevo_usuario)
        db.session.commit()

        return jsonify({"msg": "Usuario creado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()  # Revertir cambios en caso de error
        print("Error al crear usuario:", str(e))
        return jsonify({"msg": "Error al crear usuario", "error": str(e)}), 500
    
# Actualizar un usuario existente
@usuarios_bp.route('/update_user/<int:id_usuario>', methods=['PUT'])
@jwt_required()
def update_user(id_usuario):

    try:
        # Buscar el usuario en la base de datos
        usuario = Usuario.query.get_or_404(id_usuario)

        # Validar y deserializar los datos enviados en la solicitud utilizando el schema
        usuario_schema.load(request.json, instance=usuario, partial=True)

        # Si se envía una nueva contraseña en la solicitud, encriptarla antes de guardarla
        if 'clave' in request.json:
            usuario.clave = FuncionesController.creapass(request.json['clave'])

        # Guardar los cambios en la base de datos
        db.session.commit()

        return jsonify({"msg": "Usuario actualizado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()  # Revertir cambios en caso de error
        print("Error al actualizar usuario:", str(e))
        return jsonify({"msg": "Error al actualizar usuario", "error": str(e)}), 500


# Eliminar un usuario existente
@usuarios_bp.route('/<int:id_usuario>', methods=['DELETE'])
@jwt_required()
def delete_user(id_usuario):
    try:
        # Buscar el usuario con estado activo (id_estado=1)
        usuario = Usuario.query.filter_by(id_usuario=id_usuario, id_estado=1).first()

        if not usuario:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        # Cambiar el estado del usuario a inactivo
        usuario.id_estado = 0
        db.session.commit()

        return jsonify({"msg": "Usuario eliminado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()  # Revertir cambios en caso de error
        print("Error al eliminar usuario:", str(e))
        return jsonify({"msg": "Error al eliminar usuario", "error": str(e)}), 500


# Obtener el listado de roles de un usuario
@usuarios_bp.route('/roles/<int:id_usuario>', methods=['GET'])
@jwt_required()
def obtener_roles_usuario(id_usuario):
    """
    Obtener los roles de un usuario, incluyendo los módulos y menús relacionados.
    """
    try:
        # Consultar los roles del usuario con las relaciones necesarias
        roles = Roles.query.options(
            joinedload(Roles.menu_navegacion).joinedload(MenuNavegacion.modulo)
        ).filter_by(
            id_usuario=id_usuario,
            id_estado=1  # Solo roles activos
        ).all()

        print("Roles encontrados:", roles)  # Log para depuración

        if not roles:
            return jsonify({"msg": "No se encontraron roles activos para el usuario"}), 404

        # Serializar los roles utilizando el schema
        roles_serializados = roles_schema_many.dump(roles)

        return jsonify(roles_serializados), 200
    except Exception as e:
        print("Error al obtener roles del usuario:", str(e))
        return jsonify({"msg": "Error al obtener roles del usuario", "error": str(e)}), 500
    
# Asifnar un rol a un usuario
@usuarios_bp.route('/asignar_rol/<int:id_usuario>', methods=['POST'])
@jwt_required()
def asignar_rol_usuario(id_usuario):
    """
    Asignar un rol a un usuario específico.
    """
    try:
        # Validar los datos enviados en la solicitud utilizando el nuevo esquema
        asignar_rol_schema = AsignarRolSchema()
        data = asignar_rol_schema.load(request.get_json())

        # Verificar que el usuario existe y está activo
        usuario = Usuario.query.filter_by(id_usuario=id_usuario, id_estado=1).first()
        if not usuario:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        # Verificar que el menú de navegación existe y está activo
        menu = MenuNavegacion.query.filter_by(id_menu_navegacion=data['id_menu_navegacion'], id_estado=1).first()
        if not menu:
            return jsonify({"msg": "Menú de navegación no encontrado"}), 404

        # Crear el nuevo rol
        nuevo_rol = Roles(
            id_usuario=id_usuario,
            id_menu_navegacion=data['id_menu_navegacion'],
            id_estado=1  # Activo por defecto
        )
        db.session.add(nuevo_rol)
        db.session.commit()

        # Serializar el rol recién creado para la respuesta
        return roles_schema.dump(nuevo_rol), 201
    except Exception as e:
        db.session.rollback()  # Revertir cambios en caso de error
        print("Error al asignar rol al usuario:", str(e))
        return jsonify({"msg": "Error al asignar rol al usuario", "error": str(e)}), 500
    
    
# Eliminar un rol de un usuario
@roles_bp.route('/eliminar_rol/<int:id_rol>', methods=['DELETE'])
@jwt_required()
def eliminar_rol(id_rol):
    try:
        # Buscar el rol por su ID
        rol = Roles.query.filter_by(id_rol=id_rol, id_estado=1).first()

        if not rol:
            return jsonify({"msg": "Rol no encontrado"}), 404

        # Cambiar el estado del rol a inactivo
        rol.id_estado = 0
        db.session.commit()

        return jsonify({"msg": "Rol eliminado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error al eliminar rol:", str(e))
        return jsonify({"msg": "Error al eliminar rol", "error": str(e)}), 500
    

    
    
# Obtener todos los menús de navegación activos
@roles_bp.route('/obtener_menus', methods=['GET'])
@jwt_required()
def obtener_menus():
    try:
        # Consultar todos los menús de navegación activos y ordenarlos por id_menu_navegacion
        menus = MenuNavegacion.query.filter_by(id_estado=1).order_by(MenuNavegacion.id_menu_navegacion).all()

        if not menus:
            return jsonify({"msg": "No se encontraron menús disponibles"}), 404

        # Serializar los menús utilizando el esquema
        menus_serializados = menu_navegaciones_schema.dump(menus)

        return jsonify(menus_serializados), 200
    except Exception as e:
        print("Error al obtener menús:", str(e))
        return jsonify({"msg": "Error al obtener menús", "error": str(e)}), 500