from conexion_bd import bd
from sqlalchemy.orm import relationship

class MenuNavegacion(bd.Model):
    __tablename__ = 'menu_navegacion'

    id_menu_navegacion = bd.Column(bd.Integer, primary_key=True, autoincrement=True, comment='Llave foránea de la tabla menu_navegacion')
    nombre_menu_navegacion = bd.Column(bd.String(200), nullable=False, comment='Nombre de menu a seleccionar')
    url_menu = bd.Column(bd.String(50), nullable=False, comment='La url del menu')
    id_modulo = bd.Column(bd.Integer, bd.ForeignKey('modulo.id_modulo'), nullable=False, comment='Llave foránea a la tabla de modulos')
    id_tipo_estado = bd.Column(bd.Integer, nullable=False, default=2, comment='Llave foranea a la tabla de estado')
    id_estado = bd.Column(bd.Integer, nullable=False, default=1, comment='Llave foranea a la tabla de estado')

    __table_args__ = (
        bd.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado'],
        ),
    )

    # Relaciones
    modulo = relationship('Modulo', back_populates='menus_navegacion')
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='menus_navegacion')
    roles = relationship('Roles', back_populates='menu_navegacion')

    def __repr__(self):
        return (
            f"<MenuNavegacion(id_menu_navegacion={self.id_menu_navegacion}, "
            f"nombre_menu_navegacion='{self.nombre_menu_navegacion}', "
            f"url_menu='{self.url_menu}', "
            f"id_modulo={self.id_modulo}, "
            f"id_estado={self.id_estado}, "
            f"id_tipo_estado={self.id_tipo_estado})>"
        )