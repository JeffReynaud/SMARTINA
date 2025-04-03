import pytest
from datetime import date
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

@pytest.fixture
def client(app):
    return app.test_client()

def test_get_folders(client, app):
    with app.app_context():
        folder = Folder(name='Test Folder')
        db.session.add(folder)
        db.session.commit()
        
        response = client.get('/api/folders')
        assert response.status_code == 200
        data = response.get_json()
        assert len(data) == 1
        assert data[0]['name'] == 'Test Folder'

def test_create_folder(client, app):
    with app.app_context():
        response = client.post('/api/folders', json={'name': 'New Folder'})
        assert response.status_code == 201
        data = response.get_json()
        assert data['name'] == 'New Folder'
        
        folder = Folder.query.get(data['id'])
        assert folder is not None
        assert folder.name == 'New Folder'

def test_create_project(client, app):
    with app.app_context():
        folder = Folder(name='Test Folder')
        db.session.add(folder)
        db.session.commit()
        
        project_data = {
            'name': 'New Project',
            'start_date': '2024-01-01',
            'end_date': '2024-12-31',
            'status': 'TODO',
            'folder_id': folder.id
        }
        
        response = client.post('/api/projects', json=project_data)
        assert response.status_code == 201
        data = response.get_json()
        assert data['name'] == 'New Project'
        
        project = Project.query.get(data['id'])
        assert project is not None
        assert project.name == 'New Project'
        assert project.folder_id == folder.id

def test_create_subproject(client, app):
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
        
        subproject_data = {
            'name': 'New Subproject',
            'start_date': '2024-01-01',
            'end_date': '2024-06-30',
            'status': 'IN PROGRESS',
            'project_id': project.id
        }
        
        response = client.post('/api/subprojects', json=subproject_data)
        assert response.status_code == 201
        data = response.get_json()
        assert data['name'] == 'New Subproject'
        
        subproject = Subproject.query.get(data['id'])
        assert subproject is not None
        assert subproject.name == 'New Subproject'
        assert subproject.project_id == project.id

def test_update_folder(client, app):
    with app.app_context():
        folder = Folder(name='Test Folder')
        db.session.add(folder)
        db.session.commit()
        
        response = client.put(f'/api/folders/{folder.id}', json={'name': 'Updated Folder'})
        assert response.status_code == 200
        data = response.get_json()
        assert data['name'] == 'Updated Folder'
        
        updated_folder = Folder.query.get(folder.id)
        assert updated_folder.name == 'Updated Folder'

def test_delete_folder(client, app):
    with app.app_context():
        folder = Folder(name='Test Folder')
        db.session.add(folder)
        db.session.commit()
        
        response = client.delete(f'/api/folders/{folder.id}')
        assert response.status_code == 204
        
        deleted_folder = Folder.query.get(folder.id)
        assert deleted_folder is None 