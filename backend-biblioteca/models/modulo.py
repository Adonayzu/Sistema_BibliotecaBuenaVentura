from conexion_bd import bd

class Modulo(bd.Model):
    __tablename__ = 'modulo'

    id_modulo = bd.Column(bd.Integer, primary_key=True, autoincrement=True, comment='Llave primaria')
    nombre_modulo = bd.Column(bd.String(200), nullable=False, comment='Nombre del modulo')

    # Relaciones
    menus_navegacion = bd.relationship('MenuNavegacion', back_populates='modulo')

    def __repr__(self):
        return (
            f"<Modulo(id_modulo={self.id_modulo}, "
            f"nombre_modulo='{self.nombre_modulo}')>"
        )