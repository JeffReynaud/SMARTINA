from app import create_app, db
from app.config import Config
import os

app = create_app(Config)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000))) 