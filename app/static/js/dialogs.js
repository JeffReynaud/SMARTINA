// Funciones para manejar diálogos modales
function showDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (dialog) {
        dialog.classList.remove('hidden');
        dialog.classList.add('block');
    }
}

function hideDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (dialog) {
        dialog.classList.remove('block');
        dialog.classList.add('hidden');
    }
}

// Diálogo para crear nueva carpeta
function createNewFolder() {
    const folderName = document.getElementById('folderName').value;
    if (folderName.trim()) {
        // Aquí iría la llamada a la API para crear la carpeta
        const newFolder = {
            id: Date.now().toString(),
            name: folderName,
            projects: []
        };
        
        // Actualizar los datos locales
        sampleData.folders.push(newFolder);
        
        // Actualizar la vista
        renderFolders();
        
        // Limpiar y cerrar el diálogo
        document.getElementById('folderName').value = '';
        hideDialog('newFolderDialog');
    }
}

// Diálogo para crear nuevo proyecto
function createNewProject(folderId) {
    const projectName = document.getElementById('projectName').value;
    const startDate = document.getElementById('projectStartDate').value;
    const endDate = document.getElementById('projectEndDate').value;
    
    if (projectName.trim() && startDate && endDate) {
        const newProject = {
            id: Date.now().toString(),
            name: projectName,
            startDate: startDate,
            endDate: endDate,
            status: 'TODO',
            subprojects: []
        };
        
        // Encontrar la carpeta y agregar el proyecto
        const folder = sampleData.folders.find(f => f.id === folderId);
        if (folder) {
            folder.projects.push(newProject);
            
            // Actualizar la vista
            renderFolders();
            renderGantt();
            
            // Limpiar y cerrar el diálogo
            document.getElementById('projectName').value = '';
            document.getElementById('projectStartDate').value = '';
            document.getElementById('projectEndDate').value = '';
            hideDialog('newProjectDialog');
        }
    }
}

// Diálogo para crear nuevo subproyecto
function createNewSubproject(projectId) {
    const subprojectName = document.getElementById('subprojectName').value;
    const startDate = document.getElementById('subprojectStartDate').value;
    const endDate = document.getElementById('subprojectEndDate').value;
    
    if (subprojectName.trim() && startDate && endDate) {
        const newSubproject = {
            id: Date.now().toString(),
            name: subprojectName,
            startDate: startDate,
            endDate: endDate,
            status: 'TODO'
        };
        
        // Encontrar el proyecto y agregar el subproyecto
        for (const folder of sampleData.folders) {
            const project = folder.projects.find(p => p.id === projectId);
            if (project) {
                project.subprojects.push(newSubproject);
                
                // Actualizar la vista
                renderFolders();
                renderGantt();
                
                // Limpiar y cerrar el diálogo
                document.getElementById('subprojectName').value = '';
                document.getElementById('subprojectStartDate').value = '';
                document.getElementById('subprojectEndDate').value = '';
                hideDialog('newSubprojectDialog');
                break;
            }
        }
    }
}

// Inicializar eventos de diálogos
document.addEventListener('DOMContentLoaded', function() {
    // Eventos para el diálogo de nueva carpeta
    document.getElementById('newFolderBtn').addEventListener('click', () => showDialog('newFolderDialog'));
    document.getElementById('cancelNewFolder').addEventListener('click', () => hideDialog('newFolderDialog'));
    document.getElementById('saveNewFolder').addEventListener('click', createNewFolder);
    
    // Eventos para el diálogo de nuevo proyecto
    document.getElementById('newProjectBtn').addEventListener('click', () => showDialog('newProjectDialog'));
    document.getElementById('cancelNewProject').addEventListener('click', () => hideDialog('newProjectDialog'));
    document.getElementById('saveNewProject').addEventListener('click', () => {
        const folderId = document.getElementById('newProjectBtn').dataset.folderId;
        createNewProject(folderId);
    });
    
    // Eventos para el diálogo de nuevo subproyecto
    document.getElementById('newSubprojectBtn').addEventListener('click', () => showDialog('newSubprojectDialog'));
    document.getElementById('cancelNewSubproject').addEventListener('click', () => hideDialog('newSubprojectDialog'));
    document.getElementById('saveNewSubproject').addEventListener('click', () => {
        const projectId = document.getElementById('newSubprojectBtn').dataset.projectId;
        createNewSubproject(projectId);
    });
}); 