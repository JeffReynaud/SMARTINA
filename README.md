# SMARTINA - Gestor de Proyectos

SMARTINA es una aplicación web para la gestión de proyectos con vista Gantt, inspirada en el diseño de Apple.

## Características

- Dashboard completo con vista Gantt
- Gestión de carpetas, proyectos y subproyectos
- Filtros por estado
- Vistas expandibles para proyectos y subproyectos
- Diseño responsive y moderno
- Persistencia de datos con SQLite

## Requisitos

- Python 3.9 o superior
- pip (gestor de paquetes de Python)
- Git (opcional, para clonar el repositorio)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/JeffReynaud/SMARTINA.git
cd SMARTINA/Front
```

2. Crear y activar un entorno virtual:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:
```bash
# Copiar el archivo .env.example a .env
cp .env.example .env
# Editar el archivo .env con tus configuraciones
```

## Uso

1. Iniciar la aplicación:
```bash
python run.py
```

2. Abrir en el navegador:
```
http://localhost:5000
```

## Estructura del Proyecto

```
Front/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── models.py
│   ├── routes.py
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   └── templates/
├── .env
├── .gitignore
├── Procfile
├── README.md
├── requirements.txt
└── run.py
```

## Despliegue

La aplicación está configurada para ser desplegada en Render.com. Para desplegar:

1. Crear una cuenta en Render.com
2. Conectar con el repositorio de GitHub
3. Configurar las variables de entorno
4. Desplegar la aplicación

## Contribuir

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 