from .conexion_db import db


class TipoEstado(db.Model):
    __tablename__ = 'tipo_estado'
    
    id_tipo_estado = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla tipo_estado')
    nombre_tipo_estado = db.Column(db.String(200), nullable=False, comment='Nombres del tipo de estado')
    
    
    def __repr__(self):
        return f"<TipoEstado(id_tipo_estado={self.id_tipo_estado}, nombre_tipo_estado='{self.nombre_tipo_estado}')>"
