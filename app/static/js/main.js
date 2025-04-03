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
        }
    ]
};

// Estado de la aplicación
let currentDate = new Date();
let viewMode = "month";
let expandedProjects = {};

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
    nameCell.textContent = project.name;
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

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el diagrama
    renderGantt();
    document.getElementById('currentMonth').textContent = formatDate(currentDate);

    // Eventos de navegación
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        document.getElementById('currentMonth').textContent = formatDate(currentDate);
        renderGantt();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        document.getElementById('currentMonth').textContent = formatDate(currentDate);
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
}); 