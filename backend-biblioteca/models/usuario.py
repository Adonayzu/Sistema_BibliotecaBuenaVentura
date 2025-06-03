from .conexion_db import db
from sqlalchemy.orm import relationship


class Usuario(db.Model):
    __tablename__ = 'usuario'

    id_usuario = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla de usuario')
    usuario = db.Column(db.String(200), nullable=False, unique=True, comment='Usuario de la persona que utilizara el sistema')
    clave = db.Column(db.String(200), nullable=False, comment='Clave o contraseña del usuario')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=2, comment='Llave foránea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foránea a la tabla de estado')

    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )

    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='usuarios')

    roles = relationship('Roles', back_populates='usuario')

    # Definición del método __repr__ para una representación legible del objeto
    def __repr__(self):
        return (
            f"<Usuario(id_usuario={self.id_usuario}, "
            f"usuario='{self.usuario}', "
            f"id_estado={self.id_estado}, "
            f"id_tipo_estado={self.id_tipo_estado})>"
        )