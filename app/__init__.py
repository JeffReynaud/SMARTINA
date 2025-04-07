from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app(config_class):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Inicializar extensiones
    db.init_app(app)
    CORS(app)
    
    # Registrar blueprints
    from app.routes import main
    app.register_blueprint(main)
    
    # Crear tablas de la base de datos
    with app.app_context():
        db.create_all()
    
    return app 