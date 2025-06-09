import bcrypt

class FuncionesController:
    @staticmethod
    def creapass(password):
        """
        Método para la creación de contraseñas hasheadas con bcrypt
        :param password: str
        :return: str
        """
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt)
        return hashed_password.decode('utf-8')

    @staticmethod
    def verificar_password(password, hashed_password):
        """
        Verificar si una contraseña coincide con su hash
        """
        password_bytes = password.encode('utf-8')
        hashed_password_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_password_bytes)