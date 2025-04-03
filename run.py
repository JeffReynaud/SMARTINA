from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    # Obtener el puerto del entorno o usar 5000 por defecto
    port = int(os.environ.get('PORT', 5000))
    # Configurar para escuchar en todas las interfaces
    app.run(host='0.0.0.0', port=port, debug=False) 