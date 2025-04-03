# Guía de Contribución

¡Gracias por tu interés en contribuir a SMARTINA! Este documento proporciona una guía para contribuir al proyecto.

## Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [¿Cómo Contribuir?](#cómo-contribuir)
3. [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
4. [Proceso de Desarrollo](#proceso-de-desarrollo)
5. [Estándares de Código](#estándares-de-código)
6. [Pruebas](#pruebas)
7. [Documentación](#documentación)
8. [Pull Requests](#pull-requests)

## Código de Conducta

Por favor, lee y sigue nuestro [Código de Conducta](CODE_OF_CONDUCT.md).

## ¿Cómo Contribuir?

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Configuración del Entorno de Desarrollo

1. Clona el repositorio:
```bash
git clone https://github.com/JeffReynaud/SMARTINA.git
cd SMARTINA/Front
```

2. Crea y activa un entorno virtual:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Instala las dependencias de desarrollo:
```bash
pip install -r requirements-dev.txt
pre-commit install
```

## Proceso de Desarrollo

1. Crea una rama para tu feature:
```bash
git checkout -b feature/nombre-de-tu-feature
```

2. Desarrolla tu feature:
```bash
# Ejecuta las pruebas
make test

# Verifica el estilo del código
make lint

# Formatea el código
make format
```

3. Commit tus cambios:
```bash
git add .
git commit -m "Descripción de tus cambios"
```

4. Push a tu rama:
```bash
git push origin feature/nombre-de-tu-feature
```

## Estándares de Código

- Sigue [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Usa [Black](https://github.com/psf/black) para formatear el código
- Usa [isort](https://github.com/PyCQA/isort) para ordenar las importaciones
- Usa [flake8](https://flake8.pycqa.org/) para verificar el estilo del código
- Usa [mypy](http://mypy-lang.org/) para verificar los tipos

## Pruebas

- Escribe pruebas para todo el código nuevo
- Ejecuta todas las pruebas antes de hacer commit:
```bash
make test
```

## Documentación

- Documenta todo el código nuevo
- Actualiza la documentación existente cuando sea necesario
- Sigue las convenciones de documentación de Python

## Pull Requests

1. Asegúrate de que tu PR resuelve un issue específico
2. Incluye una descripción clara de los cambios
3. Incluye pruebas para los cambios
4. Asegúrate de que todas las pruebas pasan
5. Asegúrate de que el código cumple con los estándares
6. Actualiza la documentación si es necesario

## Preguntas

Si tienes alguna pregunta, por favor abre un issue en el repositorio. 