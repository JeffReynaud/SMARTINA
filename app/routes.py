from flask import Blueprint, render_template, jsonify, request
from app import app, db
from app.models import Folder, Project, Subproject
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('base.html')

@app.route('/api/folders', methods=['GET'])
def get_folders():
    folders = Folder.query.all()
    return jsonify([folder.to_dict() for folder in folders])

@app.route('/api/folders', methods=['POST'])
def create_folder():
    data = request.get_json()
    new_folder = Folder(name=data['name'])
    db.session.add(new_folder)
    db.session.commit()
    return jsonify(new_folder.to_dict()), 201

@app.route('/api/folders/<int:folder_id>', methods=['PUT'])
def update_folder(folder_id):
    folder = Folder.query.get_or_404(folder_id)
    data = request.get_json()
    folder.name = data['name']
    db.session.commit()
    return jsonify(folder.to_dict())

@app.route('/api/folders/<int:folder_id>', methods=['DELETE'])
def delete_folder(folder_id):
    folder = Folder.query.get_or_404(folder_id)
    db.session.delete(folder)
    db.session.commit()
    return '', 204

@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.get_json()
    new_project = Project(
        name=data['name'],
        start_date=datetime.strptime(data['startDate'], '%Y-%m-%d').date(),
        end_date=datetime.strptime(data['endDate'], '%Y-%m-%d').date(),
        status=data.get('status', 'TODO'),
        folder_id=data['folderId']
    )
    db.session.add(new_project)
    db.session.commit()
    return jsonify(new_project.to_dict()), 201

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.get_json()
    project.name = data['name']
    project.start_date = datetime.strptime(data['startDate'], '%Y-%m-%d').date()
    project.end_date = datetime.strptime(data['endDate'], '%Y-%m-%d').date()
    project.status = data['status']
    db.session.commit()
    return jsonify(project.to_dict())

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return '', 204

@app.route('/api/subprojects', methods=['POST'])
def create_subproject():
    data = request.get_json()
    new_subproject = Subproject(
        name=data['name'],
        start_date=datetime.strptime(data['startDate'], '%Y-%m-%d').date(),
        end_date=datetime.strptime(data['endDate'], '%Y-%m-%d').date(),
        status=data.get('status', 'TODO'),
        project_id=data['projectId']
    )
    db.session.add(new_subproject)
    db.session.commit()
    return jsonify(new_subproject.to_dict()), 201

@app.route('/api/subprojects/<int:subproject_id>', methods=['PUT'])
def update_subproject(subproject_id):
    subproject = Subproject.query.get_or_404(subproject_id)
    data = request.get_json()
    subproject.name = data['name']
    subproject.start_date = datetime.strptime(data['startDate'], '%Y-%m-%d').date()
    subproject.end_date = datetime.strptime(data['endDate'], '%Y-%m-%d').date()
    subproject.status = data['status']
    db.session.commit()
    return jsonify(subproject.to_dict())

@app.route('/api/subprojects/<int:subproject_id>', methods=['DELETE'])
def delete_subproject(subproject_id):
    subproject = Subproject.query.get_or_404(subproject_id)
    db.session.delete(subproject)
    db.session.commit()
    return '', 204 