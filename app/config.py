import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class Config:
    # Configuración de la base de datos
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///smartina.db')
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de la aplicación
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev')
    DEBUG = False  # Siempre False en producción
    
    # Configuración de la API
    JSON_AS_ASCII = False
    JSON_SORT_KEYS = False
    
    # Configuración de Render
    HOST = '0.0.0.0'
    PORT = int(os.environ.get('PORT', 10000)) 