from .conexion_db import db

class Estado(db.Model):
    __tablename__ = 'estado'

    id_estado = db.Column(db.Integer, primary_key=True, comment='Llave primaria')
    id_tipo_estado = db.Column(db.Integer, db.ForeignKey('tipo_estado.id_tipo_estado'), primary_key=True, comment='Llave foránea a la tabla de tipo estado')
    nombre_estado = db.Column(db.String(200), nullable=False, comment='Nombre de estado')


    # Relaciones
    tipo_estado = db.relationship('TipoEstado', backref= 'estado')
    

    

    def __repr__(self):
        return f"<Estado(id_estado={self.id_estado}, id_tipo_estado={self.id_tipo_estado}, nombre_estado='{self.nombre_estado}', estado='{self.estado}')>"