from setuptools import setup, find_packages

setup(
    name='smartina',
    version='0.1.0',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'Flask==2.3.3',
        'Flask-SQLAlchemy==3.1.1',
        'Flask-CORS==4.0.0',
        'python-dotenv==1.0.0',
        'Werkzeug==2.3.7',
        'gunicorn==21.2.0',
        'SQLAlchemy==2.0.23',
    ],
    python_requires='>=3.9',
) 