// Constantes y configuración
const CATEGORIES = {
    'premium': 'Premium (Verde)',
    'standard': 'Estándar (Azul)',
    'basic': 'Básico (Naranja)'
};

const DISCIPLINES = {
    'PT': 'Physical Therapy',
    'PTA': 'Physical Therapy Assistant',
    'OT': 'Occupational Therapy',
    'COTA': 'Occupational Therapy Assistant',
    'ST': 'Speech Therapy',
    'STA': 'Speech Therapy Assistant'
};

const STATUS_TYPES = {
    'active': 'Activo',
    'NO PTA': 'NO PTA',
    'pending': 'Documentos Pendientes',
    'unsigned': 'No ha firmado'
};

// Datos iniciales y funciones de almacenamiento
let therapists = JSON.parse(localStorage.getItem('therapists')) || [
    {
        type: 'PT',
        name: 'Peggie McCaffrey',
        areas: 'Inglewood, Culver City, Westchester, Playa del Rey, El Segundo, Marina del Rey, Playa Vista',
        languages: 'english',
        phone: '(310) 294-2556',
        email: 'stellamarie751@gmail.com',
        status: 'NO PTA',
        category: 'basic'
    }
];

function saveTherapists() {
    localStorage.setItem('therapists', JSON.stringify(therapists));
}

// Función para exportar datos
function exportTherapists() {
    const currentTherapists = [...therapists];
    
    const therapistsString = JSON.stringify(currentTherapists, null, 2)
        .replace(/"([^"]+)":/g, '$1:')
        .replace(/"/g, "'");
    
    const codeString = `// Datos actualizados de los terapeutas - ${new Date().toLocaleDateString()}
const therapists = ${therapistsString};`;
    
    const element = document.createElement('a');
    const file = new Blob([codeString], {type: 'text/javascript'});
    element.href = URL.createObjectURL(file);
    element.download = `therapists-data-${new Date().toISOString().split('T')[0]}.js`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Funciones de filtrado y búsqueda
function filterTherapists(searchTerm) {
    if (!searchTerm) return therapists;
    
    searchTerm = searchTerm.toLowerCase();
    return therapists.filter(therapist => {
        return Object.values(therapist).some(value => 
            value && value.toString().toLowerCase().includes(searchTerm)
        );
    });
}

function applyFilters() {
    const areaValue = document.getElementById('areaFilter').value.toLowerCase();
    const disciplineValue = document.getElementById('disciplineFilter').value;
    const categoryValue = document.getElementById('categoryFilter').value;
    
    return therapists.filter(therapist => {
        const matchesArea = !areaValue || therapist.areas.toLowerCase().includes(areaValue);
        const matchesDiscipline = !disciplineValue || therapist.type === disciplineValue;
        const matchesCategory = !categoryValue || therapist.category === categoryValue;
        
        return matchesArea && matchesDiscipline && matchesCategory;
    });
}

// Funciones de renderizado
function renderTherapists(therapistsToRender) {
    const tbody = document.querySelector('.therapists-table tbody');
    tbody.innerHTML = '';

    therapistsToRender.forEach(therapist => {
        const tr = document.createElement('tr');
        tr.className = `category-${therapist.category}`;
        
        tr.innerHTML = `
            <td>${DISCIPLINES[therapist.type] || therapist.type}</td>
            <td class="name-${therapist.category}">${therapist.name}</td>
            <td>${therapist.areas}</td>
            <td>${therapist.languages || ''}</td>
            <td>${therapist.phone || ''}</td>
            <td>${therapist.email || ''}</td>
            <td>${therapist.status || ''}</td>
            <td>${CATEGORIES[therapist.category] || therapist.category}</td>
            <td class="actions">
                <button class="action-btn" onclick="openEditModal('${therapist.name}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="deleteTherapist('${therapist.name}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

function initializeFilters() {
    // Obtener áreas únicas
    const areas = [...new Set(therapists.flatMap(t => 
        t.areas.split(',').map(a => a.trim())
    ))].sort();

    // Llenar el filtro de áreas
    const areaFilter = document.getElementById('areaFilter');
    if (areaFilter) {
        areaFilter.innerHTML = '<option value="">Todas las áreas</option>';
        areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area;
            option.textContent = area;
            areaFilter.appendChild(option);
        });
    }

    // Llenar el filtro de disciplinas
    const disciplineFilter = document.getElementById('disciplineFilter');
    if (disciplineFilter) {
        disciplineFilter.innerHTML = '<option value="">Todas las disciplinas</option>';
        Object.entries(DISCIPLINES).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = value;
            disciplineFilter.appendChild(option);
        });
    }

    // Llenar el filtro de categorías
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
        Object.entries(CATEGORIES).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = value;
            categoryFilter.appendChild(option);
        });
    }
}

// Funciones de manejo de terapeutas
function deleteTherapist(name) {
    if (confirm('¿Estás seguro de que deseas eliminar este terapeuta?')) {
        therapists = therapists.filter(t => t.name !== name);
        saveTherapists();
        renderTherapists(therapists);
        initializeFilters();
    }
}

function openEditModal(therapistName) {
    const therapist = therapists.find(t => t.name === therapistName);
    if (!therapist) return;

    const form = document.getElementById('editTherapistForm');
    
    // Llenar el formulario con los datos actuales
    document.getElementById('editName').value = therapist.name;
    document.getElementById('editType').value = therapist.type;
    document.getElementById('editCategory').value = therapist.category;
    document.getElementById('editAreas').value = therapist.areas;
    document.getElementById('editLanguages').value = therapist.languages || '';
    document.getElementById('editPhone').value = therapist.phone || '';
    document.getElementById('editEmail').value = therapist.email || '';
    document.getElementById('editStatus').value = therapist.status || 'active';
    
    // Guardar el nombre original para referencia
    form.dataset.originalName = therapist.name;
    document.getElementById('editModal').classList.add('active');
}

// Inicialización y event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tabla y filtros
    renderTherapists(therapists);
    initializeFilters();

    // Inicializar select de tipos en el modal
    const editType = document.getElementById('editType');
    if (editType) {
        editType.innerHTML = Object.entries(DISCIPLINES).map(([key, value]) => 
            `<option value="${key}">${value}</option>`
        ).join('');
    }

    // Inicializar select de categorías en el modal
    const editCategory = document.getElementById('editCategory');
    if (editCategory) {
        editCategory.innerHTML = Object.entries(CATEGORIES).map(([key, value]) => 
            `<option value="${key}">${value}</option>`
        ).join('');
    }

    // Agregar botón de exportar
    const actionsContainer = document.querySelector('.main-content__header');
    if (actionsContainer) {
        const exportButton = document.createElement('button');
        exportButton.className = 'add-therapist-btn';
        exportButton.style.marginLeft = '10px';
        exportButton.innerHTML = '<i class="fas fa-download"></i> Exportar Datos';
        exportButton.onclick = exportTherapists;
        actionsContainer.appendChild(exportButton);
    }

    // Event listeners para búsqueda y filtros
    const searchInput = document.querySelector('.search-input');
    searchInput?.addEventListener('input', (e) => {
        renderTherapists(filterTherapists(e.target.value));
    });

    ['areaFilter', 'disciplineFilter', 'categoryFilter'].forEach(filterId => {
        const filter = document.getElementById(filterId);
        filter?.addEventListener('change', () => {
            renderTherapists(applyFilters());
        });
    });

    // Setup del modal
    setupModal();
});

function setupModal() {
    const modal = document.getElementById('editModal');
    const addBtn = document.getElementById('addTherapistBtn');
    const closeBtn = document.getElementById('closeEditModal');
    const cancelBtn = document.getElementById('cancelEdit');
    const form = document.getElementById('editTherapistForm');

    // Botón de agregar
    addBtn?.addEventListener('click', () => {
        form.reset();
        form.dataset.originalName = '';
        modal.classList.add('active');
    });

    // Cerrar modal
    [closeBtn, cancelBtn].forEach(btn => {
        btn?.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    });

    // Submit del formulario
    form?.addEventListener('submit', handleFormSubmit);

    // Cerrar al hacer clic fuera
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const updatedTherapist = {
        name: document.getElementById('editName').value.trim(),
        type: document.getElementById('editType').value,
        category: document.getElementById('editCategory').value,
        areas: document.getElementById('editAreas').value.trim(),
        languages: document.getElementById('editLanguages').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        status: document.getElementById('editStatus').value
    };

    if (!updatedTherapist.name) {
        alert('El nombre es requerido');
        return;
    }

    const originalName = form.dataset.originalName;
    if (originalName) {
        const index = therapists.findIndex(t => t.name === originalName);
        if (index !== -1) {
            therapists[index] = updatedTherapist;
        }
    } else {
        therapists.push(updatedTherapist);
    }

    saveTherapists();
    renderTherapists(therapists);
    initializeFilters();
    document.getElementById('editModal').classList.remove('active');
}