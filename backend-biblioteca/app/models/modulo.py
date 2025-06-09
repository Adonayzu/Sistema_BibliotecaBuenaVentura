from .conexion_db import db

class Modulo(db.Model):
    __tablename__ = 'modulo'

    id_modulo = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria')
    nombre_modulo = db.Column(db.String(200), nullable=False, comment='Nombre del modulo')


    def __repr__(self):
        return (
            f"<Modulo(id_modulo={self.id_modulo}, "
            f"nombre_modulo='{self.nombre_modulo}')>"
        )