from .conexion_db import db 

from .usuario import Usuario
from .estado import Estado
from .cliente import Cliente
from .libro import Libro
from .prestamo import Prestamo
from .roles import Roles
from .menu_navegacion import MenuNavegacion
from .modulo import Modulo
from .tipo_estado import TipoEstado

# Esto es para que al importar el paquete, se importen automáticamente los modelos
__all__ = [
    'Usuario',
    'Estado',
    'Cliente',
    'Libro',
    'Prestamo',
    'Roles',
    'MenuNavegacion',
    'Modulo',
    'TipoEstado'
]