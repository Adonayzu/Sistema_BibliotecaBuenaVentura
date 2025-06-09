from .conexion_db import db
from sqlalchemy.sql import func

class Cliente(db.Model):
    __tablename__ = 'cliente'

    id_cliente = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla cliente')
    nombre = db.Column(db.String(200), nullable=False, comment='Nombres del cliente')
    apellido = db.Column(db.String(200), nullable=False, comment='Apellidos del cliente')
    correo = db.Column(db.String(250), nullable=False, unique=True, comment='Correo electrónico del cliente')
    numero_identificacion = db.Column(db.Integer, nullable=False, unique=True, comment='Número de identificación único')
    telefono = db.Column(db.Integer, nullable=False, comment='Teléfono del cliente')
    direccion = db.Column(db.String(300), nullable=False, comment='Dirección del cliente')
    fecha_registro = db.Column(db.DateTime, nullable=False, default=func.now(), comment='Fecha de registro del cliente')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=5, comment='Llave foránea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foránea a la tabla de estado')

    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )

    # Relaciones
    estado = db.relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], backref='cliente')

    def __repr__(self):
        return (
            f"<Cliente(id_cliente={self.id_cliente}, nombre='{self.nombre}', apellido='{self.apellido}', "
            f"correo='{self.correo}', numero_identificacion={self.numero_identificacion}, telefono={self.telefono}, "
            f"direccion='{self.direccion}', fecha_registro='{self.fecha_registro}', "
            f"id_estado={self.id_estado}, id_tipo_estado={self.id_tipo_estado})>"
        )