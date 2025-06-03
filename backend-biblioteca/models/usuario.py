from conexion_bd import bd
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class Usuario(bd.Model):
    _tablename_ = 'usuario'

    id_usuario = bd.Column(bd.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla de usuario')
    usuario = bd.Column(bd.String(200), nullable=False, unique=True, comment='Usuario de la persona que utilizara el sistema')
    clave = bd.Column(bd.String(200), nullable=False, comment='Clave o contraseña del usuario')
    id_tipo_estado = bd.Column(bd.Integer, nullable=False, default=2, comment='Llave foránea a la tabla de estado')
    id_estado = bd.Column(bd.Integer, nullable=False, default=1, comment='Llave foránea a la tabla de estado')

    # Clave compuesta para el FK
    _table_args_ = (
        bd.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )

    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='usuarios')
    roles = relationship('Roles', back_populates='usuario')
    
    
    
    


    # Definición del método __repr__ para una representación legible del objeto
    def _repr_(self):
        return (
            f"<Usuario(id_usuario={self.id_usuario}, "
            f"usuario='{self.usuario}', "
            f"id_estado={self.id_estado}, "
            f"id_tipo_estado={self.id_tipo_estado})>"
        )