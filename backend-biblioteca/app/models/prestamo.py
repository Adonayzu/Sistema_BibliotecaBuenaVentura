from .conexion_db import db

class Prestamo(db.Model):
    __tablename__ = 'prestamo'

    id_prestamo = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla prestamo')
    id_cliente = db.Column(db.Integer, db.ForeignKey('cliente.id_cliente'), nullable=False, comment='Llave foránea a la tabla de cliente')
    id_libro = db.Column(db.Integer, db.ForeignKey('libro.id_libro'), nullable=False, comment='Llave foránea a la tabla de libro')
    fecha_prestamo = db.Column(db.Date, nullable=False, comment='Fecha del préstamo')
    fecha_devolucion_esperada = db.Column(db.Date, nullable=False, comment='Fecha esperada de devolución')
    fecha_devolucion_real = db.Column(db.Date, nullable=True, comment='Fecha real de devolución')
    observaciones = db.Column(db.String(500), nullable=False, comment='Anotaciones de la devolución del libro')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=6, comment='Llave foránea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foránea a la tabla de estado (1=ACTIVO, 2=DEVUELTO, 3=VENCIDO)')

    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )

    # Relaciones
    cliente = db.relationship('Cliente', backref='prestamo')
    libro = db.relationship('Libro', backref='prestamo')
    estado = db.relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], backref='prestamo')

    def __repr__(self):
        return (
            f"<Prestamo(id_prestamo={self.id_prestamo}, id_cliente={self.id_cliente}, id_libro={self.id_libro}, "
            f"fecha_prestamo='{self.fecha_prestamo}', fecha_devolucion_esperada='{self.fecha_devolucion_esperada}', "
            f"fecha_devolucion_real='{self.fecha_devolucion_real}', observaciones='{self.observaciones}', "
            f"id_estado={self.id_estado}, id_tipo_estado={self.id_tipo_estado})>"
        )