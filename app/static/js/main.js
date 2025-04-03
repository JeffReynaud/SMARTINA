// Datos de ejemplo (simulando los datos de TASKSMART-VIEW.TSX)
const sampleData = {
    folders: [
        {
            id: "1",
            name: "Proyecto Principal",
            projects: [
                {
                    id: "p1",
                    name: "Desarrollo Web",
                    startDate: "2024-01-01",
                    endDate: "2024-01-31",
                    status: "IN PROGRESS",
                    subprojects: [
                        {
                            id: "sp1",
                            name: "Frontend",
                            startDate: "2024-01-01",
                            endDate: "2024-01-15",
                            status: "DONE"
                        },
                        {
                            id: "sp2",
                            name: "Backend",
                            startDate: "2024-01-16",
                            endDate: "2024-01-31",
                            status: "IN PROGRESS"
                        }
                    ]
                }
            ]
        },
        {
            id: "2",
            name: "Proyecto Secundario",
            projects: [
                {
                    id: "p2",
                    name: "Diseño UI/UX",
                    startDate: "2024-01-10",
                    endDate: "2024-01-25",
                    status: "READY FOR REVIEW",
                    subprojects: []
                }
            ]
        }
    ]
};

// Estado de la aplicación
let currentDate = new Date();
let viewMode = "month";
let expandedProjects = {};
let statusFilter = [];

// Funciones de utilidad
function formatDate(date) {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

// Renderizar carpetas
function renderFolders() {
    const foldersGrid = document.getElementById('foldersGrid');
    foldersGrid.innerHTML = '';

    sampleData.folders.forEach(folder => {
        const folderCard = document.createElement('div');
        folderCard.className = 'bg-white dark:bg-gray-800 rounded-lg shadow p-4';
        folderCard.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white">${folder.name}</h4>
                <button class="new-project-btn p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white" data-folder-id="${folder.id}">
                    <i class="lucide lucide-plus"></i>
                </button>
            </div>
            <div class="space-y-2">
                ${folder.projects.map(project => `
                    <div class="project-item bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-700 dark:text-gray-300">${project.name}</span>
                            <div class="flex space-x-2">
                                <button class="new-subproject-btn p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white" data-project-id="${project.id}">
                                    <i class="lucide lucide-plus"></i>
                                </button>
                                <button class="toggle-expand p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white" data-project-id="${project.id}">
                                    <i class="lucide lucide-chevron-down"></i>
                                </button>
                            </div>
                        </div>
                        ${project.subprojects && project.subprojects.length > 0 ? `
                            <div class="subprojects mt-2 space-y-2" id="subprojects-${project.id}">
                                ${project.subprojects.map(subproject => `
                                    <div class="subproject-item bg-white dark:bg-gray-600 rounded p-2 flex items-center justify-between">
                                        <span class="text-sm text-gray-600 dark:text-gray-300">${subproject.name}</span>
                                        <span class="status-badge px-2 py-1 rounded-full text-xs ${getStatusClass(subproject.status)}">
                                            ${subproject.status}
                                        </span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        foldersGrid.appendChild(folderCard);
    });

    // Agregar event listeners para los botones de nuevo proyecto y subproyecto
    document.querySelectorAll('.new-project-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const folderId = e.currentTarget.dataset.folderId;
            document.getElementById('newProjectBtn').dataset.folderId = folderId;
            showDialog('newProjectDialog');
        });
    });

    document.querySelectorAll('.new-subproject-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const projectId = e.currentTarget.dataset.projectId;
            document.getElementById('newSubprojectBtn').dataset.projectId = projectId;
            showDialog('newSubprojectDialog');
        });
    });
}

// Renderizar el diagrama de Gantt
function renderGantt() {
    const ganttTimeline = document.getElementById('ganttTimeline');
    ganttTimeline.innerHTML = '';

    // Crear encabezado de días
    const daysHeader = document.createElement('div');
    daysHeader.className = 'gantt-header-row';
    
    // Celda vacía para el encabezado de proyectos
    const emptyCell = document.createElement('div');
    emptyCell.className = 'gantt-item font-semibold text-gray-700 dark:text-gray-300';
    emptyCell.textContent = 'Proyectos';
    daysHeader.appendChild(emptyCell);

    // Celdas de días
    const daysInMonth = getDaysInMonth(currentDate);
    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'gantt-item text-center text-gray-600 dark:text-gray-400';
        dayCell.textContent = i;
        daysHeader.appendChild(dayCell);
    }

    ganttTimeline.appendChild(daysHeader);

    // Renderizar proyectos
    sampleData.folders.forEach(folder => {
        folder.projects.forEach(project => {
            renderProject(project, ganttTimeline);
        });
    });
}

function renderProject(project, container) {
    // Fila del proyecto
    const projectRow = document.createElement('div');
    projectRow.className = 'gantt-row';

    // Celda del nombre del proyecto
    const nameCell = document.createElement('div');
    nameCell.className = 'gantt-item';
    nameCell.innerHTML = `
        <div class="flex items-center">
            <button class="toggle-expand p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mr-2" data-project-id="${project.id}">
                <i class="lucide lucide-chevron-down"></i>
            </button>
            <span class="text-gray-700 dark:text-gray-300">${project.name}</span>
        </div>
    `;
    projectRow.appendChild(nameCell);

    // Celdas de días
    const daysInMonth = getDaysInMonth(currentDate);
    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'gantt-item';
        
        // Verificar si el día está dentro del rango del proyecto
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);

        if (currentDay >= startDate && currentDay <= endDate) {
            const bar = document.createElement('div');
            bar.className = `gantt-bar ${getStatusClass(project.status)}`;
            dayCell.appendChild(bar);
        }

        projectRow.appendChild(dayCell);
    }

    container.appendChild(projectRow);

    // Renderizar subproyectos si están expandidos
    if (expandedProjects[project.id] && project.subprojects) {
        project.subprojects.forEach(subproject => {
            renderProject(subproject, container);
        });
    }
}

// Función auxiliar para obtener la clase de estado
function getStatusClass(status) {
    const statusMap = {
        'TODO': 'status-todo',
        'IN PROGRESS': 'status-in-progress',
        'DONE': 'status-done',
        'READY FOR REVIEW': 'status-ready-for-review'
    };
    return statusMap[status] || 'status-todo';
}

// Toggle project expansion
function toggleProjectExpansion(projectId) {
    expandedProjects[projectId] = !expandedProjects[projectId];
    renderGantt();
    renderFolders();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar vistas
    renderFolders();
    renderGantt();
    document.getElementById('currentPeriod').textContent = formatDate(currentDate);

    // Eventos de navegación
    document.getElementById('prevPeriod').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        document.getElementById('currentPeriod').textContent = formatDate(currentDate);
        renderGantt();
    });

    document.getElementById('nextPeriod').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        document.getElementById('currentPeriod').textContent = formatDate(currentDate);
        renderGantt();
    });

    // Eventos de cambio de vista
    document.getElementById('viewMonth').addEventListener('click', () => {
        viewMode = "month";
        renderGantt();
    });

    document.getElementById('viewWeek').addEventListener('click', () => {
        viewMode = "week";
        renderGantt();
    });

    // Eventos de expansión de proyectos
    document.addEventListener('click', (e) => {
        if (e.target.closest('.toggle-expand')) {
            const projectId = e.target.closest('.toggle-expand').dataset.projectId;
            toggleProjectExpansion(projectId);
        }
    });

    // Eventos de filtros
    document.getElementById('filterButton').addEventListener('click', () => {
        document.getElementById('filterPopup').classList.remove('hidden');
    });

    document.getElementById('applyFilters').addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('#filterPopup input[type="checkbox"]:checked');
        statusFilter = Array.from(checkboxes).map(checkbox => checkbox.value);
        document.getElementById('filterPopup').classList.add('hidden');
        renderGantt();
        renderFolders();
    });

    document.getElementById('clearFilters').addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('#filterPopup input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
        statusFilter = [];
        document.getElementById('filterPopup').classList.add('hidden');
        renderGantt();
        renderFolders();
    });

    // Cerrar popup al hacer clic fuera
    document.getElementById('filterPopup').addEventListener('click', (e) => {
        if (e.target === document.getElementById('filterPopup')) {
            document.getElementById('filterPopup').classList.add('hidden');
        }
    });
}); 