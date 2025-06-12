from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from sqlalchemy.orm import joinedload
from app.routes.utils import FuncionesController
from app.models.conexion_db import db
from app.models import Cliente, Libro, Prestamo, Usuario, Estado, Roles, MenuNavegacion, Modulo, TipoEstado
from sqlalchemy import func
from app.schemas import (
    usuario_schema, usuarios_schema,
    cliente_schema, clientes_schema,
    roles_schema, roles_schema_many, AsignarRolSchema,
    libro_schema, libros_schema,
    prestamo_schema, prestamos_schema,
    menu_navegacion_schema, menu_navegaciones_schema
   
)

#----Blueprint-----------
modulos_bp = Blueprint('modulos', __name__, url_prefix='/modulos')
usuarios_bp = Blueprint('usuarios', __name__, url_prefix='/usuarios')
roles_bp = Blueprint('roles', __name__, url_prefix='/roles')
libros_bp = Blueprint('libros', __name__, url_prefix='/libros')
clientes_bp = Blueprint('clientes', __name__, url_prefix='/clientes')
prestamos_bp = Blueprint('prestamos', __name__, url_prefix='/prestamos')


# Obtener modulos y menus segun el rol del usuario y sus roles
@modulos_bp.route('/', methods=['GET'])
@jwt_required()
def obtener_modulos():
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
    try:
        # Filtrar usuarios con id_estado == 1
        usuarios_activos = Usuario.query.filter_by(id_estado=1).all()
        
        if not usuarios_activos: 
            return jsonify({"msg": "No se encontraron usuarios activos"}), 404
        # Serializar los usuarios utilizando el esquema
        
        return usuarios_schema.dump(usuarios_activos), 200
    except Exception as e: 
        print("Error al obtener usuarios:", str(e)) 
        return jsonify({"msg": "Error al obtener usuarios", "error": str(e)}), 500

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
    
    

# MODULO CONTROL DE BIBLIOTECA
# Obtener todos los libros
@libros_bp.route('/', methods=['GET'])  
@jwt_required()
def get_libros():
    try:
        # Consultar todos los libros activos
        libros = Libro.query.filter_by(id_estado=1).all()

        if not libros:
            return jsonify({"msg": "No se encontraron libros disponibles"}), 404

        # Serializar los libros utilizando el esquema
        libros_serializados = libros_schema.dump(libros)

        return jsonify(libros_serializados), 200
    except Exception as e:
        print("Error al obtener libros:", str(e))
        return jsonify({"msg": "Error al obtener libros", "error": str(e)}), 500
    

# Crear un nuevo libro
@libros_bp.route('/create_book', methods=['POST'])
@jwt_required()
def create_book():
    try:
        data = request.json

        # Validar que el ISBN sea único
        if Libro.query.filter_by(isbn=data.get('isbn')).first():
            return jsonify({"msg": "El ISBN ya está registrado"}), 400

        # Validar que los valores numéricos sean positivos
        if int(data.get('cantidad_disponible', 0)) < 0 or int(data.get('cantidad_total', 0)) < 0:
            return jsonify({"msg": "Las cantidades deben ser valores positivos"}), 400

        # Deserializar y crear el libro
        nuevo_libro = libro_schema.load(data)
        db.session.add(nuevo_libro)
        db.session.commit()

        return jsonify({"msg": "Libro creado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        print("Error al crear libro:", str(e))
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500


# Actualizar un libro existente
@libros_bp.route('/update_book/<int:id_libro>', methods=['PUT'])
@jwt_required()
def update_book(id_libro):
    try:
        # Obtener los datos enviados en la solicitud
        data = request.json

        # Buscar el libro en la base de datos
        libro = Libro.query.get_or_404(id_libro)

        # Validar que los valores numéricos sean positivos
        if int(data.get('cantidad_disponible', libro.cantidad_disponible)) < 0 or int(data.get('cantidad_total', libro.cantidad_total)) < 0:
            return jsonify({"msg": "Las cantidades deben ser valores positivos"}), 400

        # Validar que el ISBN sea único (si se envía un nuevo ISBN)
        if 'isbn' in data and data['isbn'] != libro.isbn:
            if Libro.query.filter_by(isbn=data['isbn']).first():
                return jsonify({"msg": "El ISBN ya está registrado"}), 400

        # Validar y deserializar los datos enviados en la solicitud utilizando el schema
        libro_schema.load(data, instance=libro, partial=True)

        # Guardar los cambios en la base de datos
        db.session.commit()

        return jsonify({"msg": "Libro actualizado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error al actualizar libro:", str(e))
        return jsonify({"msg": "Error al actualizar libro", "error": str(e)}), 500
    
    
# Eliminar un libro existente
@libros_bp.route('/<int:id_libro>', methods=['DELETE'])
@jwt_required()
def delete_book(id_libro):
    try:
        # Buscar el libro con estado activo (id_estado=1)
        libro = Libro.query.filter_by(id_libro=id_libro, id_estado=1).first()

        if not libro:
            return jsonify({"msg": "Libro no encontrado"}), 404

        # Cambiar el estado del libro a inactivo
        libro.id_estado = 0
        db.session.commit()

        return jsonify({"msg": "Libro eliminado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error al eliminar libro:", str(e))
        return jsonify({"msg": "Error al eliminar libro", "error": str(e)}), 500
    

# CLIENTES
# Obtener todos los clientes
@clientes_bp.route('/', methods=['GET'])
@jwt_required()
def get_clientes():
    try:
        # Consultar todos los clientes activos
        clientes = Cliente.query.filter_by(id_estado=1).all()

        if not clientes:
            return jsonify({"msg": "No se encontraron clientes disponibles"}), 404

        # Serializar los clientes utilizando el esquema
        clientes_serializados = clientes_schema.dump(clientes)

        return jsonify(clientes_serializados), 200
    except Exception as e:
        print("Error al obtener clientes:", str(e))
        return jsonify({"msg": "Error al obtener clientes", "error": str(e)}), 500
    

# Crear un nuevo cliente
@clientes_bp.route('/create_client', methods=['POST'])
@jwt_required()
def create_client():
    try:
        # Obtener los datos enviados en la solicitud
        data = request.json

        # Validar que el número de identificación sea único
        if Cliente.query.filter_by(numero_identificacion=data['numero_identificacion']).first():
            return jsonify({"msg": "El número de identificación ya está registrado"}), 400

        # Validar que el correo electrónico sea único
        if Cliente.query.filter_by(correo=data['correo']).first():
            return jsonify({"msg": "El correo electrónico ya está registrado"}), 400

        # Validar y deserializar los datos enviados en la solicitud utilizando el schema
        nuevo_cliente = cliente_schema.load(data)

        # Agregar el cliente a la base de datos
        db.session.add(nuevo_cliente)
        db.session.commit()

        return jsonify({"msg": "Cliente creado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        print("Error al crear cliente:", str(e))
        return jsonify({"msg": "Error al crear cliente", "error": str(e)}), 500
    
    
# Actualizar un cliente existente
@clientes_bp.route('/update_client/<int:id_cliente>', methods=['PUT'])
@jwt_required()
def update_client(id_cliente):
    try:
        # Obtener los datos enviados en la solicitud
        data = request.json

        # Buscar el cliente en la base de datos
        cliente = Cliente.query.get_or_404(id_cliente)

        # Validar y deserializar los datos enviados en la solicitud utilizando el schema
        cliente_schema.load(data, instance=cliente, partial=True)

        # Guardar los cambios en la base de datos
        db.session.commit()

        return jsonify({"msg": "Cliente actualizado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error al actualizar cliente:", str(e))
        return jsonify({"msg": "Error al actualizar cliente", "error": str(e)}), 500

# Eliminar un cliente existente
@clientes_bp.route('/<int:id_cliente>', methods=['DELETE'])
@jwt_required()
def delete_client(id_cliente):
    try:
        # Buscar el cliente con estado activo (id_estado=1)
        cliente = Cliente.query.filter_by(id_cliente=id_cliente, id_estado=1).first()

        if not cliente:
            return jsonify({"msg": "Cliente no encontrado"}), 404

        # Cambiar el estado del cliente a inactivo
        cliente.id_estado = 0
        db.session.commit()

        return jsonify({"msg": "Cliente eliminado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error al eliminar cliente:", str(e))
        return jsonify({"msg": "Error al eliminar cliente", "error": str(e)}), 500
    
    


# Asignación de prestamos a clientes
@prestamos_bp.route('/asignar_prestamo', methods=['POST'])
@jwt_required()
def asignar_prestamo():
    try:
        # Obtener los datos enviados en la solicitud
        data = request.get_json()
        id_cliente = data.get('id_cliente')
        id_libro = data.get('id_libro')
        observaciones = data.get('observaciones', '')

        # Validar que el cliente existe y está activo
        cliente = Cliente.query.filter_by(id_cliente=id_cliente, id_estado=1).first()
        if not cliente:
            return jsonify({"msg": "Cliente no encontrado"}), 404

        # Validar que el libro existe y está activo
        libro = Libro.query.filter_by(id_libro=id_libro, id_estado=1).first()
        if not libro:
            return jsonify({"msg": "Libro no encontrado"}), 404

        # Verificar que el cliente no tenga un préstamo activo
        prestamo_activo = Prestamo.query.filter_by(id_cliente=id_cliente, id_estado=1).first()
        if prestamo_activo:
            return jsonify({"msg": "El cliente ya tiene un préstamo activo"}), 400

        # Verificar que el libro tenga ejemplares disponibles
        if libro.cantidad_disponible <= 0:
            return jsonify({"msg": "No hay ejemplares disponibles para este libro"}), 400

        # Crear el nuevo préstamo
        nuevo_prestamo = Prestamo(
            id_cliente=id_cliente,
            id_libro=id_libro,
            fecha_prestamo=func.now(),
            fecha_devolucion=None,  # La fecha de devolución se registrará cuando el libro sea devuelto
            observaciones=observaciones,
            id_estado=1  # Activo por defecto
        )

        # Reducir la cantidad disponible del libro
        libro.cantidad_disponible -= 1

        # Guardar el préstamo en la base de datos
        db.session.add(nuevo_prestamo)
        db.session.commit()

        return jsonify({"msg": "Préstamo asignado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        print("Error al asignar préstamo:", str(e))
        return jsonify({"msg": "Error al asignar préstamo", "error": str(e)}), 500
    
    
# Actualizar un préstamo existente
@prestamos_bp.route('/update_prestamo/<int:id_prestamo>', methods=['PUT'])
@jwt_required()
def update_prestamo(id_prestamo):
    try:
        # Buscar el préstamo en la base de datos
        prestamo = Prestamo.query.get_or_404(id_prestamo)

        # Validar y deserializar los datos enviados en la solicitud utilizando el schema
        prestamo_schema.load(request.json, instance=prestamo, partial=True)

        # Guardar los cambios en la base de datos
        db.session.commit()

        return jsonify({"msg": "Préstamo actualizado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error al actualizar préstamo:", str(e))
        return jsonify({"msg": "Error al actualizar préstamo", "error": str(e)}), 500
    
    
    
# ruta para registrar la devolución de un libro
@prestamos_bp.route('/devolver_prestamo/<int:id_prestamo>', methods=['PUT'])
@jwt_required()
def devolver_prestamo(id_prestamo):
    try:
        # Buscar el préstamo por su ID y que esté activo
        prestamo = Prestamo.query.filter_by(id_prestamo=id_prestamo, id_estado=1).first()

        if not prestamo:
            return jsonify({"msg": "Préstamo no encontrado o ya devuelto"}), 404

        # Registrar la fecha de devolución
        prestamo.fecha_devolucion = func.now()

        # Cambiar el estado del préstamo a "DEVUELTO"
        prestamo.id_estado = 2  # DEVUELTO

        # Incrementar la cantidad disponible del libro
        libro = Libro.query.filter_by(id_libro=prestamo.id_libro).first()
        if libro:
            libro.cantidad_disponible += 1

        # Guardar los cambios en la base de datos
        db.session.commit()

        return jsonify({"msg": "Préstamo devuelto exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error al devolver préstamo:", str(e))
        return jsonify({"msg": "Error al devolver préstamo", "error": str(e)}), 500
    




# Ruta para cancelar un préstamo
@prestamos_bp.route('/cancelar_prestamo/<int:id_prestamo>', methods=['PUT'])
@jwt_required()
def cancelar_prestamo(id_prestamo):
    try:
        # Buscar el préstamo con estado activo
        prestamo = Prestamo.query.filter_by(id_prestamo=id_prestamo, id_estado=1).first()

        if not prestamo:
            return jsonify({"msg": "Préstamo no encontrado o ya cancelado"}), 404

        # Cambiar el estado del préstamo a cancelado
        prestamo.id_estado = 0

        # Incrementar la cantidad disponible del libro
        libro = Libro.query.filter_by(id_libro=prestamo.id_libro).first()
        if libro:
            libro.cantidad_disponible += 1

        # Guardar los cambios en la base de datos
        db.session.commit()

        return jsonify({"msg": "Préstamo cancelado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error al cancelar préstamo:", str(e))
        return jsonify({"msg": "Error al cancelar préstamo", "error": str(e)}), 500
    


# Ruta para obtener todos los préstamos (independientemente del estado)
@prestamos_bp.route('/todos_prestamos', methods=['GET'])
@jwt_required()
def obtener_todos_prestamos():
    try:
        # Consultar todos los préstamos
        prestamos = Prestamo.query.filter_by(id_estado = 1).all()  # Filtrar solo los préstamos activos

        if not prestamos:
            return jsonify({"msg": "No se encontraron préstamos"}), 404

        # Serializar los préstamos utilizando el esquema
        prestamos_serializados = prestamos_schema.dump(prestamos)

        return jsonify(prestamos_serializados), 200
    except Exception as e:
        print("Error al obtener todos los préstamos:", str(e))
        return jsonify({"msg": "Error al obtener todos los préstamos", "error": str(e)}), 500




# Ruta para obtener todos los prestamos con estado devuelto para reportes
@prestamos_bp.route('/prestamos_devuelto', methods=['GET'])
@jwt_required()
def obtener_prestamos_devuelto():
    try:
        # Obtener los parámetros de búsqueda de la solicitud
        isbn = request.args.get('isbn', '').strip()
        titulo = request.args.get('titulo', '').strip()

        # Construir la consulta base para préstamos devueltos (id_estado=2)
        query = Prestamo.query.join(Cliente).join(Libro).filter(Prestamo.id_estado == 2)

        # Aplicar filtros dinámicos según los parámetros recibidos
        if isbn:
            query = query.filter(Libro.isbn.ilike(f"%{isbn}%"))  # Usar ilike para búsqueda insensible a mayúsculas
        if titulo:
            query = query.filter(Libro.titulo.ilike(f"%{titulo}%"))

        # Ejecutar la consulta
        prestamos = query.all()

        if not prestamos:
            return jsonify({"msg": "No se encontraron préstamos devueltos con los filtros aplicados"}), 404

        # Serializar los préstamos utilizando el esquema
        prestamos_serializados = prestamos_schema.dump(prestamos)

        return jsonify(prestamos_serializados), 200
    except Exception as e:
        print("Error al obtener préstamos devueltos:", str(e))
        return jsonify({"msg": "Error al obtener préstamos devueltos", "error": str(e)}), 500