from .conexion_db import db

class Roles(db.Model):
    __tablename__ = 'roles'

    id_rol = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla')
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False, comment='Llave foránea a la tabla de usuario')
    id_menu_navegacion = db.Column(db.Integer, db.ForeignKey('menu_navegacion.id_menu_navegacion'), nullable=False, comment='Llave foránea a la tabla de menu_navegacion')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=3, comment='LLave foranea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foranea a la tabla de estado')

    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado'],
            
        ),
    )

    # Relaciones
    usuario = db.relationship('Usuario', foreign_keys=[id_usuario], backref='roles')
    menu_navegacion = db.relationship('MenuNavegacion', backref='roles')
    estado = db.relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], backref='roles')


    def __repr__(self):
        return (
            f"<Roles(id_rol={self.id_rol}, "
            f"id_usuario={self.id_usuario}, "
            f"id_menu_navegacion={self.id_menu_navegacion}, "
            f"id_estado={self.id_estado}, "
            f"id_tipo_estado={self.id_tipo_estado})>"
        )