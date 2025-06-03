from .conexion_db import db
from sqlalchemy.orm import relationship

class Estado(db.Model):
    __tablename__ = 'estado'

    id_estado = db.Column(db.Integer, primary_key=True, comment='Llave primaria')
    id_tipo_estado = db.Column(db.Integer, db.ForeignKey('tipo_estado.id_tipo_estado'), primary_key=True, comment='Llave foránea a la tabla de tipo estado')
    nombre_estado = db.Column(db.String(200), nullable=False, comment='Nombre de estado')
    estado = db.Column(db.CHAR(1), nullable=False, default='A', comment='Estado de la tupla A = Activo e I = Inactivo')

    # Relaciones
    tipo_estado = relationship('TipoEstado', back_populates='estados')
    
    #usuarios = relationship('Usuario', back_populates='estado')
    usuarios = relationship('Usuario', back_populates='estado')

    menus_navegacion = relationship('MenuNavegacion', back_populates='estado')
    roles = relationship('Roles', back_populates='estado')
    
    libros = relationship('Libro', back_populates='estado')
    clientes = relationship('Cliente', back_populates='estado')
    prestamos = relationship('Prestamo', back_populates='estado')
    
    
    
    
    

    def __repr__(self):
        return f"<Estado(id_estado={self.id_estado}, id_tipo_estado={self.id_tipo_estado}, nombre_estado='{self.nombre_estado}', estado='{self.estado}')>"