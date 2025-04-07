from flask import Blueprint, render_template, jsonify, request
from app import db
from app.models import Folder, Project, Subproject
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('base.html')

@main.route('/api/folders', methods=['GET'])
def get_folders():
    folders = Folder.query.all()
    return jsonify([folder.to_dict() for folder in folders])

@main.route('/api/folders', methods=['POST'])
def create_folder():
    data = request.get_json()
    new_folder = Folder(name=data['name'])
    db.session.add(new_folder)
    db.session.commit()
    return jsonify(new_folder.to_dict()), 201

@main.route('/api/folders/<int:folder_id>', methods=['PUT'])
def update_folder(folder_id):
    folder = Folder.query.get_or_404(folder_id)
    data = request.get_json()
    folder.name = data.get('name', folder.name)
    db.session.commit()
    return jsonify(folder.to_dict())

@main.route('/api/folders/<int:folder_id>', methods=['DELETE'])
def delete_folder(folder_id):
    folder = Folder.query.get_or_404(folder_id)
    db.session.delete(folder)
    db.session.commit()
    return '', 204

@main.route('/api/projects', methods=['POST'])
def create_project():
    data = request.get_json()
    new_project = Project(
        name=data['name'],
        folder_id=data['folder_id'],
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d'),
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d')
    )
    db.session.add(new_project)
    db.session.commit()
    return jsonify(new_project.to_dict()), 201

@main.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.get_json()
    project.name = data.get('name', project.name)
    if 'start_date' in data:
        project.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
    if 'end_date' in data:
        project.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')
    db.session.commit()
    return jsonify(project.to_dict())

@main.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return '', 204

@main.route('/api/subprojects', methods=['POST'])
def create_subproject():
    data = request.get_json()
    new_subproject = Subproject(
        name=data['name'],
        project_id=data['project_id'],
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d'),
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d')
    )
    db.session.add(new_subproject)
    db.session.commit()
    return jsonify(new_subproject.to_dict()), 201

@main.route('/api/subprojects/<int:subproject_id>', methods=['PUT'])
def update_subproject(subproject_id):
    subproject = Subproject.query.get_or_404(subproject_id)
    data = request.get_json()
    subproject.name = data.get('name', subproject.name)
    if 'start_date' in data:
        subproject.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
    if 'end_date' in data:
        subproject.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')
    db.session.commit()
    return jsonify(subproject.to_dict())

@main.route('/api/subprojects/<int:subproject_id>', methods=['DELETE'])
def delete_subproject(subproject_id):
    subproject = Subproject.query.get_or_404(subproject_id)
    db.session.delete(subproject)
    db.session.commit()
    return '', 204 