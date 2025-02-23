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
    },
    {
      name: 'Janie Rosales',
      type: 'PT',
      category: 'standard',
      areas: 'Hollywood, Silverlake, Hollywood Hills, Hancock Park, Los Feliz, Echo Park, West Hollywood',
      languages: 'no spanish',
      phone: '(323) 207-2488',
      email: 'janie.rosales@gmail.com',
      status: 'NO PTA'
    },
    {
      type: 'PT',
      name: 'Kevin Kang',
      areas: 'Diamond Bar, Rowland Heights, Walnut, La Puente, Hacienda Heights, City of Industry, West Covina, La Mirada, Norwalk',
      languages: 'Korean, English',
      phone: '(626) 417-3013',
      email: 'benjamin.kang@gmail.com',
      status: 'NO PTA',
      category: 'basic'
    },
    {
      type: 'PT',
      name: 'Josiah Paek',
      areas: 'Los Angeles, Koreatown, Mid-City, West Los Angeles, Santa Monica, Culver City',
      languages: 'Korean, English',
      phone: '(323) 793-6522',
      email: 'josiah.paek@gmail.com',
      status: 'NO PTA',
      category: 'basic'
    },
    {
      name: 'Willie Blackwell',
      type: 'PT',
      category: 'premium',
      areas: 'Lives in Gardens, 90047, 90044, 90037, 90003, 90061, 90002, 90059, 90220',
      languages: 'bilingual',
      phone: '(323) 640-4546',
      email: 'WillieBlackwell872@gmail.com',
      status: 'NO PTA'
    },
    {
      type: 'PT',
      name: 'Kate Vance',
      areas: 'Covina, Glendora, Azusa, Baldwin Park, West Covina, San Dimas',
      languages: 'speaks cantonese',
      phone: '(626) 493-5516',
      email: 'kate.vance@gmail.com',
      status: 'SEE PTS ONLY WEEKENDS',
      category: 'basic'
    },
    {
      type: 'PT',
      name: 'Ivan Duarte',
      areas: 'Santa Ana, Ana Anaheim, Fullerton, some parts of Norwalk',
      languages: 'Spanish',
      phone: '(714) 505-4712',
      email: 'ivan.duarte@gmail.com',
      status: 'NO PTA',
      category: 'basic'
    },
    {
      type: 'PT',
      name: 'Romualdo Alpert Tai',
      areas: 'Orange County, Anaheim, Orange, Santa Ana, Westminster, Fullerton, and Tustin',
      languages: 'Chinese and therapeutic Spanish',
      phone: '(714) 323-2564',
      email: 'albert.tai@gmail.com',
      status: 'NO PTA',
      category: 'basic'
    },
    {
      type: 'PT',
      name: 'Charles Benson',
      areas: 'Live in San Pedro, cube goes up to Compton, Lawndale and Manhattan Beach (city of LA), Rialto, Alameda Hermosa Beach, San Luis Obispo, Rancho Cucamonga',
      languages: 'A bit Spanish',
      phone: '(310) 432-0595',
      email: 'charles.benson@gmail.com',
      status: 'NO PTA',
      category: 'basic'
    },
    {
      type: 'PT',
      name: 'Cynthia Ridley',
      areas: 'Cerritos, Long Beach, Lakewood, Bellflower, Paramount, Downey',
      languages: 'Korean',
      phone: '(562) 434-5438',
      email: 'cynthia.ridley@gmail.com',
      status: 'NO PTA',
      category: 'basic'
    },
    {
      type: 'PT',
      name: 'Ronald Raymond Wed 4pm-7pm',
      areas: 'Woodland Hills, Thousand Oaks, Agoura Hills, Calabasas, Simi Valley, Moorpark, Bell Canyon, Oak Park, West Hills, Chatsworth, Reseda, Northridge, Sherman Oaks, North Hollywood, Winnetka',
      languages: 'Fluent Spanish',
      phone: '(818) 662-7149',
      email: 'ronald.raymond@gmail.com',
      status: 'NO PTA',
      category: 'basic'
    },
    
  ];
  
  function saveTherapists() {
      localStorage.setItem('therapists', JSON.stringify(therapists));
  }

// Función para exportar datos
function exportTherapists() {
    const therapistsString = JSON.stringify(therapists, null, 2)
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
        
        const disciplineType = DISCIPLINES[therapist.type] || therapist.type;
        
        tr.innerHTML = `
            <td>${disciplineType}</td>
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
    const areas = [...new Set(
        therapists.flatMap(t => {
            const areasStr = t.areas || '';
            return areasStr
                .split(',')
                .map(a => a.trim())
                .filter(a => a.length > 0);
        })
    )].sort((a, b) => a.localeCompare(b));

    // Configurar los filtros
    const filterConfigs = [
        { 
            id: 'areaFilter', 
            options: areas.map(area => [area, area]),
            defaultText: 'Todas las áreas' 
        },
        { 
            id: 'disciplineFilter', 
            options: Object.entries(DISCIPLINES), 
            defaultText: 'Todas las disciplinas' 
        },
        { 
            id: 'categoryFilter', 
            options: Object.entries(CATEGORIES), 
            defaultText: 'Todas las categorías' 
        }
    ];

    filterConfigs.forEach(config => {
        const filter = document.getElementById(config.id);
        if (filter) {
            filter.innerHTML = `<option value="">${config.defaultText}</option>`;
            config.options.forEach(([value, label]) => {
                const optionEl = document.createElement('option');
                optionEl.value = value;
                optionEl.textContent = label;
                filter.appendChild(optionEl);
            });
        }
    });
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
    const fields = ['Name', 'Type', 'Category', 'Areas', 'Languages', 'Phone', 'Email', 'Status'];
    
    fields.forEach(field => {
        const element = document.getElementById(`edit${field}`);
        if (element) {
            element.value = therapist[field.toLowerCase()] || '';
        }
    });
    
    form.dataset.originalName = therapist.name;
    document.getElementById('editModal').classList.add('active');
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

// Función de logout
function handleLogout() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (!loadingScreen) return;
    
    loadingScreen.style.display = 'flex';
    loadingScreen.offsetHeight; // Forzar reflow
    loadingScreen.classList.add('show');
    
    localStorage.clear();
    sessionStorage.clear();
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderTherapists(therapists);
    initializeFilters();

    const modal = document.getElementById('editModal');
    const addBtn = document.getElementById('addTherapistBtn');
    const closeBtn = document.getElementById('closeEditModal');
    const cancelBtn = document.getElementById('cancelEdit');
    const form = document.getElementById('editTherapistForm');

    // Inicializar selects del modal
    ['Type', 'Category'].forEach(field => {
        const select = document.getElementById(`edit${field}`);
        if (select) {
            const options = field === 'Type' ? DISCIPLINES : CATEGORIES;
            select.innerHTML = Object.entries(options)
                .map(([key, value]) => `<option value="${key}">${value}</option>`)
                .join('');
        }
    });

    // Event listeners
    addBtn?.addEventListener('click', () => {
        form.reset();
        form.dataset.originalName = '';
        modal.classList.add('active');
    });

    [closeBtn, cancelBtn].forEach(btn => {
        btn?.addEventListener('click', () => modal.classList.remove('active'));
    });

    form?.addEventListener('submit', handleFormSubmit);

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // Configurar búsqueda y filtros
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

    // Configurar menú de usuario y logout
    const userMenuToggle = document.getElementById('user-menu-toggle');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    userMenuToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown?.classList.toggle('active');
        if (userDropdown) {
            userDropdown.style.display = userDropdown.classList.contains('active') ? 'block' : 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!userMenuToggle?.contains(e.target) && !userDropdown?.contains(e.target)) {
            userDropdown?.classList.remove('active');
            if (userDropdown) userDropdown.style.display = 'none';
        }
    });

    logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });

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
});