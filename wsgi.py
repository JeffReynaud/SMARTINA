import os
from app import create_app
from app.config import Config

# Crear la aplicación
application = create_app(Config)

# Asegurarse de que la aplicación esté configurada correctamente
if os.getenv('DATABASE_URL'):
    application.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
if os.getenv('SECRET_KEY'):
    application.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    application.run(host='0.0.0.0', port=port) 