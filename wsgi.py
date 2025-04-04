import os
from app import create_app, db
from app.config import Config

app = create_app(Config)

# Asegurarse de que la aplicación esté configurada correctamente
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///smartina.db')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port) 