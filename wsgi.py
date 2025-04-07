import os
from app import create_app
from app.config import Config

application = create_app(Config)

# Asegurarse de que la aplicación esté configurada correctamente
application.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///smartina.db')
application.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    application.run(host='0.0.0.0', port=port) 