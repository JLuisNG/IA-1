// Datos de los terapeutas
const therapists = [
    {
        type: 'PT',
        name: 'Peggie McCaffrey',
        areas: 'Inglewood, Culver City, Westchester, Playa del Rey, El Segundo, Marina del Rey, Playa Vista',
        languages: 'english',
        phone: '(310) 294-2556',
        email: 'stellamarie751@gmail.com',
        status: 'NO PTA',
        category: 'basic'
    },
    // ... más terapeutas aquí
];

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const areaFilter = document.querySelectorAll('.filter-btn')[0];
    const disciplineFilter = document.querySelectorAll('.filter-btn')[1];
    const categoryFilter = document.querySelectorAll('.filter-btn')[2];
    
    // Inicializar tabla
    renderTherapists(therapists);

    // Event listener para búsqueda en tiempo real
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTherapists = filterTherapists(searchTerm);
        renderTherapists(filteredTherapists);
    });

    // Evento para los filtros
    [areaFilter, disciplineFilter, categoryFilter].forEach(filter => {
        filter.addEventListener('click', function() {
            // Aquí irá la lógica de filtrado cuando implementemos los dropdowns
        });
    });
});

// Función para filtrar terapeutas
function filterTherapists(searchTerm) {
    if (!searchTerm) return therapists;
    
    return therapists.filter(therapist => {
        return (
            therapist.name.toLowerCase().includes(searchTerm) ||
            therapist.areas.toLowerCase().includes(searchTerm) ||
            therapist.languages.toLowerCase().includes(searchTerm) ||
            therapist.email.toLowerCase().includes(searchTerm) ||
            (therapist.status && therapist.status.toLowerCase().includes(searchTerm))
        );
    });
}

// Función para renderizar la tabla
function renderTherapists(therapistsToRender) {
    const tbody = document.querySelector('.therapists-table tbody');
    tbody.innerHTML = '';

    therapistsToRender.forEach(therapist => {
        const tr = document.createElement('tr');
        tr.className = `category-${therapist.category}`;
        
        tr.innerHTML = `
            <td>${therapist.type}</td>
            <td>${therapist.name}</td>
            <td>${therapist.areas}</td>
            <td>${therapist.languages}</td>
            <td>${therapist.phone}</td>
            <td>${therapist.email}</td>
            <td>${therapist.status || ''}</td>
            <td>${getCategoryDisplay(therapist.category)}</td>
            <td class="actions">
                <button class="action-btn" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Función para mostrar categoría en formato legible
function getCategoryDisplay(category) {
    const categories = {
        'premium': 'Premium (Verde)',
        'standard': 'Estándar (Azul)',
        'basic': 'Básico (Naranja)'
    };
    return categories[category] || category;
}

// Función para inicializar los filtros
function initializeFilters() {
    const areas = [...new Set(therapists.map(t => t.areas.split(',').map(a => a.trim())).flat())];
    const disciplines = [...new Set(therapists.map(t => t.type))];
    
    // Aquí irá la lógica para popular los dropdowns cuando los implementemos
}

// Actualizar la función renderTherapists para incluir los colores en los nombres
function renderTherapists(therapistsToRender) {
    const tbody = document.querySelector('.therapists-table tbody');
    tbody.innerHTML = '';

    therapistsToRender.forEach(therapist => {
        const tr = document.createElement('tr');
        tr.className = `category-${therapist.category}`;
        
        tr.innerHTML = `
            <td>${therapist.type}</td>
            <td class="name-${therapist.category}">${therapist.name}</td>
            <td>${therapist.areas}</td>
            <td>${therapist.languages}</td>
            <td>${therapist.phone}</td>
            <td>${therapist.email}</td>
            <td>${therapist.status || ''}</td>
            <td>${getCategoryDisplay(therapist.category)}</td>
            <td class="actions">
                <button class="action-btn" onclick="openEditModal('${therapist.name}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Funciones para manejar el modal de edición
function openEditModal(therapistName) {
    const therapist = therapists.find(t => t.name === therapistName);
    if (!therapist) return;

    // Llenar el formulario con los datos actuales
    document.getElementById('editName').value = therapist.name;
    document.getElementById('editType').value = therapist.type;
    document.getElementById('editCategory').value = therapist.category;
    document.getElementById('editAreas').value = therapist.areas;
    document.getElementById('editLanguages').value = therapist.languages;
    document.getElementById('editPhone').value = therapist.phone;
    document.getElementById('editEmail').value = therapist.email;
    document.getElementById('editStatus').value = therapist.status || 'active';

    // Mostrar el modal
    const modal = document.getElementById('editModal');
    modal.classList.add('active');
}

// Event Listeners para el modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('editModal');
    const closeBtn = document.getElementById('closeEditModal');
    const cancelBtn = document.getElementById('cancelEdit');
    const form = document.getElementById('editTherapistForm');

    // Cerrar modal
    [closeBtn, cancelBtn].forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    });

    // Manejar submit del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const updatedTherapist = {
            name: document.getElementById('editName').value,
            type: document.getElementById('editType').value,
            category: document.getElementById('editCategory').value,
            areas: document.getElementById('editAreas').value,
            languages: document.getElementById('editLanguages').value,
            phone: document.getElementById('editPhone').value,
            email: document.getElementById('editEmail').value,
            status: document.getElementById('editStatus').value
        };

        // Actualizar el terapeuta en el array
        const index = therapists.findIndex(t => t.name === updatedTherapist.name);
        if (index !== -1) {
            therapists[index] = { ...therapists[index], ...updatedTherapist };
            renderTherapists(therapists);
            modal.classList.remove('active');
        }
    });

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});