from flask_marshmallow import Marshmallow
from app.models import Cliente, Prestamo, Estado, Libro, Modulo, Roles, TipoEstado, Usuario, MenuNavegacion

# Inicializar Marshmallow
ma = Marshmallow()


# Esquema para TipoEstado
class TipoEstadoSchema(ma.SQLAlchemyAutoSchema):
    class Meta: 
        model = TipoEstado
        load_instance = True
        include_fk = True
        
tipo_estado_schema = TipoEstadoSchema()  # Esquema para un solo tipo de estado
tipo_estados_schema = TipoEstadoSchema(many=True)  # Esquema para múltiples tipos de estado

# Esquema para Estado
class EstadoSchema(ma.SQLAlchemyAutoSchema):
    tipo_estado = ma.Nested(TipoEstadoSchema)
    
    class Meta: 
        model = Estado
        load_instance = True
        include_fk = True
        
estado_schema = EstadoSchema()  # Esquema para un solo estado


# Esquema para Cliente
class ClienteSchema(ma.SQLAlchemyAutoSchema):
    estado = ma.Nested(EstadoSchema)
    
    class Meta: 
        model = Cliente
        load_instance = True
        include_fk = True
        
cliente_schema = ClienteSchema()  # Esquema para un solo cliente
clientes_schema = ClienteSchema(many=True)  # Esquema para múltiples clientes

# Esquema para Libro
class LibroSchema(ma.SQLAlchemyAutoSchema):
    estado = ma.Nested(EstadoSchema)
    
    class Meta: 
        model = Libro
        load_instance = True
        include_fk = True
        
libro_schema = LibroSchema()  # Esquema para un solo libro
libros_schema = LibroSchema(many=True)  # Esquema para múltiples libros



# Esquema para Prestamo
class PrestamoSchema(ma.SQLAlchemyAutoSchema):
    cliente = ma.Nested(ClienteSchema)
    libro = ma.Nested(LibroSchema)
    estado = ma.Nested(EstadoSchema)
    
    class Meta: 
        model = Prestamo
        load_instance = True
        include_fk = True
        
prestamo_schema = PrestamoSchema()  # Esquema para un solo préstamo
prestamos_schema = PrestamoSchema(many=True)  # Esquema para múltiples préstamos
estados_schema = EstadoSchema(many=True)  # Esquema para múltiples estados



# Esquema para Modulo
class ModuloSchema(ma.SQLAlchemyAutoSchema):
    class Meta: 
        model = Modulo
        load_instance = True
        
modulo_schema = ModuloSchema()  # Esquema para un solo módulo
modulos_schema = ModuloSchema(many=True)  # Esquema para múltiples módulos

# Esquema para MenuNavegacion
class MenuNavegacionSchema(ma.SQLAlchemyAutoSchema):
    modulo = ma.Nested(ModuloSchema)
    estado = ma.Nested(EstadoSchema)
    
    class Meta: 
        model = MenuNavegacion
        load_instance = True
        include_fk = True

menu_navegacion_schema = MenuNavegacionSchema()  # Esquema para un solo menú de navegación
menu_navegaciones_schema = MenuNavegacionSchema(many=True)  # Esquema para múltiples menús de navegación

# Esquema para Usuario
class UsuarioSchema(ma.SQLAlchemyAutoSchema):
    class Meta: 
        model = Usuario
        load_instance = True
        include_fk = True
        
usuario_schema = UsuarioSchema()  # Esquema para un solo usuario
usuarios_schema = UsuarioSchema(many=True)  # Esquema para múltiples usuarios

# Esquema para Roles
class RolesSchema(ma.SQLAlchemyAutoSchema):
    usuario = ma.Nested(UsuarioSchema)
    menu_navegacion = ma.Nested(MenuNavegacionSchema)
    estado = ma.Nested(EstadoSchema)
    
    class Meta: 
        model = Roles
        load_instance = True
        include_fk = True
        
roles_schema = RolesSchema()  # Esquema para un solo rol
roles_schema_many = RolesSchema(many=True)  # Esquema para múltiples roles


from marshmallow import Schema, fields

class AsignarRolSchema(Schema):
    id_menu_navegacion = fields.Int(required=True)

