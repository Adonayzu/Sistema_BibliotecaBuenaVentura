from app import create_app

# Crear la aplicación usando la función de fábrica
app = create_app()


# Ejecutar la aplicación
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(app.config.get("APP_PORT", 5000)),
        debug=app.config.get("ENV") == "development"
    )