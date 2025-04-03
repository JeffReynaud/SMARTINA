# SMARTINA - Frontend

## Estructura del Proyecto
```
Front/
├── app/
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   ├── images/
│   │   └── fonts/
│   ├── templates/
│   │   ├── base.html
│   │   └── components/
│   └── __init__.py
├── config/
│   └── config.py
├── tests/
├── requirements.txt
└── README.md
```

## Instalación
1. Crear un entorno virtual:
```bash
python -m venv venv
```

2. Activar el entorno virtual:
- Windows:
```bash
.\venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

## Configuración
1. Copiar el archivo `.env.example` a `.env`
2. Configurar las variables de entorno necesarias

## Ejecución
```bash
python run.py
``` 