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
        folderCard.className = 'folder-card';
        folderCard.innerHTML = `
            <div class="folder-header">
                <h4>${folder.name}</h4>
                <button class="button button-small">
                    <i class="lucide lucide-plus"></i>
                </button>
            </div>
            <div class="folder-projects">
                ${folder.projects.map(project => `
                    <div class="project-item">
                        <div class="project-header">
                            <span>${project.name}</span>
                            <button class="button button-small toggle-expand" data-project-id="${project.id}">
                                <i class="lucide lucide-chevron-down"></i>
                            </button>
                        </div>
                        ${project.subprojects && project.subprojects.length > 0 ? `
                            <div class="subprojects" id="subprojects-${project.id}">
                                ${project.subprojects.map(subproject => `
                                    <div class="subproject-item">
                                        <span>${subproject.name}</span>
                                        <span class="status-badge status-${subproject.status.toLowerCase().replace(' ', '-')}">
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
    emptyCell.className = 'gantt-item';
    emptyCell.textContent = 'Proyectos';
    daysHeader.appendChild(emptyCell);

    // Celdas de días
    const daysInMonth = getDaysInMonth(currentDate);
    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'gantt-item';
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
        <div class="project-name">
            <button class="toggle-expand" data-project-id="${project.id}">
                <i class="lucide lucide-chevron-down"></i>
            </button>
            <span>${project.name}</span>
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
            bar.className = `gantt-bar status-${project.status.toLowerCase().replace(' ', '-')}`;
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
        document.getElementById('filterPopup').style.display = 'block';
    });

    document.getElementById('applyFilters').addEventListener('click', () => {
        // Implementar lógica de filtros
        document.getElementById('filterPopup').style.display = 'none';
    });

    document.getElementById('clearFilters').addEventListener('click', () => {
        statusFilter = [];
        document.getElementById('filterPopup').style.display = 'none';
        renderGantt();
    });
}); 