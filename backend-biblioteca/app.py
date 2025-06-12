from app import create_app

# Crear la aplicación Flask
app = create_app()

# Ejecutar la aplicación
if __name__ == "__main__":
    # Configurar puerto y modo debug directamente
    app.run(
        host="0.0.0.0",  # Permite acceso desde cualquier IP
        port=5000,  
        debug=False  #  modo producción
    )