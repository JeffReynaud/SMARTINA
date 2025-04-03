import pytest
from datetime import datetime, date
from app import create_app, db
from app.models import Folder, Project, Subproject
from app.config import Config

@pytest.fixture
def app():
    app = create_app(Config)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

def test_folder_creation(app):
    with app.app_context():
        folder = Folder(name='Test Folder')
        db.session.add(folder)
        db.session.commit()
        
        assert folder.id is not None
        assert folder.name == 'Test Folder'
        assert isinstance(folder.created_at, datetime)

def test_project_creation(app):
    with app.app_context():
        folder = Folder(name='Test Folder')
        db.session.add(folder)
        db.session.commit()
        
        project = Project(
            name='Test Project',
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            status='TODO',
            folder_id=folder.id
        )
        db.session.add(project)
        db.session.commit()
        
        assert project.id is not None
        assert project.name == 'Test Project'
        assert project.folder_id == folder.id
        assert project.status == 'TODO'

def test_subproject_creation(app):
    with app.app_context():
        folder = Folder(name='Test Folder')
        db.session.add(folder)
        db.session.commit()
        
        project = Project(
            name='Test Project',
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            status='TODO',
            folder_id=folder.id
        )
        db.session.add(project)
        db.session.commit()
        
        subproject = Subproject(
            name='Test Subproject',
            start_date=date(2024, 1, 1),
            end_date=date(2024, 6, 30),
            status='IN PROGRESS',
            project_id=project.id
        )
        db.session.add(subproject)
        db.session.commit()
        
        assert subproject.id is not None
        assert subproject.name == 'Test Subproject'
        assert subproject.project_id == project.id
        assert subproject.status == 'IN PROGRESS'

def test_folder_project_relationship(app):
    with app.app_context():
        folder = Folder(name='Test Folder')
        db.session.add(folder)
        db.session.commit()
        
        project = Project(
            name='Test Project',
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            status='TODO',
            folder_id=folder.id
        )
        db.session.add(project)
        db.session.commit()
        
        assert project in folder.projects
        assert project.folder == folder

def test_project_subproject_relationship(app):
    with app.app_context():
        folder = Folder(name='Test Folder')
        db.session.add(folder)
        db.session.commit()
        
        project = Project(
            name='Test Project',
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            status='TODO',
            folder_id=folder.id
        )
        db.session.add(project)
        db.session.commit()
        
        subproject = Subproject(
            name='Test Subproject',
            start_date=date(2024, 1, 1),
            end_date=date(2024, 6, 30),
            status='IN PROGRESS',
            project_id=project.id
        )
        db.session.add(subproject)
        db.session.commit()
        
        assert subproject in project.subprojects
        assert subproject.project == project 