from .conexion_db import db
from sqlalchemy.orm import relationship

class Libro(db.Model):
    __tablename__ = 'libro'

    id_libro = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla libro')
    titulo = db.Column(db.String(300), nullable=False, comment='Título del libro')
    isbn = db.Column(db.String(13), nullable=False, unique=True, comment='ISBN único del libro')
    año_publicacion = db.Column(db.Integer, nullable=False, comment='Año de publicación del libro')  # YEAR(4) se mapea como Integer
    nombre_autor = db.Column(db.String(200), nullable=False, comment='Nombre completo del autor')
    nombre_editorial = db.Column(db.String(200), nullable=False, comment='Nombre de la editorial')
    cantidad_disponible = db.Column(db.Integer, nullable=False, default=0, comment='Cantidad disponible para préstamo')
    cantidad_total = db.Column(db.Integer, nullable=False, default=0, comment='Cantidad total de ejemplares del libro')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=4, comment='Llave foránea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foránea a la tabla de estado')

    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )

    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='libros')
    prestamos = relationship('Prestamo', back_populates='libro')

    def __repr__(self):
        return (
            f"<Libro(id_libro={self.id_libro}, titulo='{self.titulo}', isbn='{self.isbn}', "
            f"año_publicacion={self.año_publicacion}, nombre_autor='{self.nombre_autor}', "
            f"nombre_editorial='{self.nombre_editorial}', cantidad_disponible={self.cantidad_disponible}, "
            f"cantidad_total={self.cantidad_total}, id_estado={self.id_estado}, id_tipo_estado={self.id_tipo_estado})>"
        )