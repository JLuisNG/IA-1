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
        "name": "Ivan Lins",
        "type": "PTA",
        "category": "standard",
        "areas": "San Fernando Valley, Van Nuys, Sherman Oaks, Northridge, Winnetka, Woodland Hills, West Hills, Porter Ranch, Reseda",
        "languages": "english",
        "phone": "(818) 697-3948",
        "email": "ivanlins24@yahoo.com",
        "status": "active"
      },
      {
        "name": "Mikaela Chua",
        "type": "PTA",
        "category": "basic",
        "areas": "Marina, Venice (some), Playa del Rey, Playa Vista, El Segundo, Manhattan Beach, Hermosa Beach, Redondo Beach, Lawndale, Torrance, Santa Monica (weekends for $75)",
        "languages": "english",
        "phone": "(310) 658-0493",
        "email": "mikavchua@gmail.com",
        "status": "active"
      },
      {
        "name": "Vincent Grepo",
        "type": "PTA",
        "category": "basic",
        "areas": "Gardena, Manhattan Beach, Redondo Beach, Torrance, Lomita, Wilmington, Coastal San Pedro",
        "languages": "English",
        "phone": "(310) 465-6597",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Cynthia Razon",
        "type": "PTA",
        "category": "basic",
        "areas": "Calimesa, Yucaipa, Cherry Valley, Beaumont, Banning, Hemet, San Jacinto, Perris, Moreno Valley, Nuevo, Homeland",
        "languages": "Spanish",
        "phone": "123456789",
        "email": "cynraz.pt1@gmail.com",
        "status": "active"
      },
      {
        "name": "Stan Sitnitski",
        "type": "PTA",
        "category": "basic",
        "areas": "Studio City, Hollywood, Hollywood Hills",
        "languages": "Ukrainian, Russian",
        "phone": "(213) 321-2226",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Alicia Feuerstein",
        "type": "PTA",
        "category": "basic",
        "areas": "Ventura, Oxnard, Port Hueneme, Camarillo, Santa Paula",
        "languages": "Spanish",
        "phone": "(716) 341-3612",
        "email": "avon.alicia@yahoo.com",
        "status": "active"
      },
      {
        "name": "Ciecile Oduca",
        "type": "PTA",
        "category": "basic",
        "areas": "Tarzana, Northridge, Winnetka, Canoga Park, Woodland Hills, Mission Hills",
        "languages": "Filipino, Understands Spanish and Farsi",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Kim Thomer",
        "type": "PTA",
        "category": "basic",
        "areas": "Huntington Beach, San Clemente, Westminster, Santa Ana, Orange, Tustin, Irvine, Lake Forest, Mission Viejo, Ladera Ranch, San Juan Capistrano, Dana Point, Laguna Niguel",
        "languages": "english",
        "phone": "949-294-2517",
        "email": "kimthomer@gmail.com",
        "status": "active"
      },
      {
        "name": "Joseph Blackwell",
        "type": "PTA",
        "category": "basic",
        "areas": "Central LA (90044, 90047, 90028, 90043, 90062, 90018)",
        "languages": "english",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Edgardo Nicanor",
        "type": "PTA",
        "category": "basic",
        "areas": "Chino Hills, Chino, Pomona, Montclair, Ontario",
        "languages": "Spanish, Tagalog",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Brian Drake",
        "type": "PTA",
        "category": "basic",
        "areas": "Highland, Loma Linda, Redlands, Grand Terrace, Colton, Bloomington, San Bernardino, Rialto, Fontana",
        "languages": "Spanish",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Kristine Revilla",
        "type": "PTA",
        "category": "basic",
        "areas": "Moreno Valley, Riverside",
        "languages": "english",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Jordyn Frazier",
        "type": "PTA",
        "category": "basic",
        "areas": "Sherman Oaks, North Hollywood, Glendale, Van Nuys, Burbank",
        "languages": "english",
        "phone": "(602) 708-6419",
        "email": "jordynfrazier1993@gmail.com",
        "status": "active"
      },
      {
        "name": "Sandra Cerda",
        "type": "PTA",
        "category": "basic",
        "areas": "Montebello, Monterey Park, Pico Rivera",
        "languages": "Spanish",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Kelsey Mussleman",
        "type": "PTA",
        "category": "basic",
        "areas": "West Hollywood, Los Feliz, Beverly Hills, East Hollywood, Silverlake",
        "languages": "Some Spanish",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Zeeshan",
        "type": "PTA",
        "category": "basic",
        "areas": "",
        "languages": "Urdu",
        "phone": "9498723796",
        "email": "zeeshansultan1998@gmail.com",
        "status": "active"
      },
      {
        "name": "Angelito Sicat",
        "type": "PTA",
        "category": "basic",
        "areas": "",
        "languages": "english",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "pending"
      },
      {
        "name": "Stacy Kim",
        "type": "OT",
        "category": "standard",
        "areas": "90020, 90004, 90010, 90057, 90006, 90007, 90037, 90018, 90019, 90016, 90008, 90043, 90062, 90047, 90302, 90056, 90036, 90048, Koreatown",
        "languages": "english",
        "phone": "(213) 327-6093",
        "email": "stacyk321@outlook.com",
        "status": "active"
      },
      {
        "name": "Karen Cassel",
        "type": "OT",
        "category": "standard",
        "areas": "Chatsworth, Canoga Park, Calabasas, Hidden Hills",
        "languages": "english",
        "phone": "818-314-7080",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Betty An 'BA' Torchiano",
        "type": "OT",
        "category": "premium",
        "areas": "Central LA, West LA",
        "languages": "english",
        "phone": "808-388-3109",
        "email": "prestigerehabinc@gmail.com",
        "status": "NO PTA"
      },
      {
        "name": "Devorah Haboosheh",
        "type": "OT",
        "category": "standard",
        "areas": "90035, Culver City, Surrounding Neighborhoods",
        "languages": "english",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Annette Arredondo",
        "type": "OT",
        "category": "premium",
        "areas": "Whittier (10 mile radius), 90022, 90063",
        "languages": "Spanish",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "NO PTA"
      },
      {
        "name": "Richard Lai",
        "type": "OT",
        "category": "premium",
        "areas": "South Pasadena (91030), 91108, 91007, 91780, 91776, 91801, 91803, 90032, 91731, 91770, 91733, 91754, 90063, 90201, 90660, 90058, 90640, 90022, 90023, 90021, 90057, 90017, 90015, 90014, 90013, 90033, Monterey Park, Alhambra, Montebello, East LA, Rosemead",
        "languages": "english",
        "phone": "626-543-5503",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Eyouel Hailu",
        "type": "OT",
        "category": "standard",
        "areas": "Koreatown, Beverly Hills, Santa Monica, West Hollywood, Mid-City, Central LA, East Hollywood, Westlake, Echo Park, Century City, Silver Lake",
        "languages": "english",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Megan Rose Dominguez",
        "type": "OT",
        "category": "premium",
        "areas": "90042",
        "languages": "english",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Marie Zhong",
        "type": "OT",
        "category": "standard",
        "areas": "Rancho Cucamonga",
        "languages": "english",
        "phone": "6263192302",
        "email": "viamariee@yahoo.com",
        "status": "active"
      },
      {
        "name": "Blaire Burkit",
        "type": "OT",
        "category": "standard",
        "areas": "Orange County, Santa Ana (by South Coast Plaza), Long Beach (by the VA)",
        "languages": "english",
        "phone": "7143607258",
        "email": "blaire.nakano@gmail.com",
        "status": "active"
      },
      {
        "name": "Nai Kinsbursky",
        "type": "OT",
        "category": "standard",
        "areas": "Anaheim Hills, Yorba Linda, Fullerton, Placentia, Santa Ana, Tustin, Irvine, Costa Mesa",
        "languages": "Some Spanish",
        "phone": "(209) 482-7679",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Bharati Sahu",
        "type": "OT",
        "category": "standard",
        "areas": "East Lakewood (10-12 miles radius to Orange County, 5-7 miles into LA County), Long Beach",
        "languages": "Spanish, South Asian Languages",
        "phone": "(972) 987-9688",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Summer McNeal Beacher",
        "type": "OT",
        "category": "standard",
        "areas": "Baldwin Hills, 90008 (5 mile radius)",
        "languages": "english",
        "phone": "(323) 244-6753",
        "email": "SummerOTR@gmail.com",
        "status": "active"
      },
      {
        "name": "Deisi Pereida",
        "type": "COTA",
        "category": "standard",
        "areas": "Compton, Lynwood, 90044, 90047, 90061, 90003, 90059, 90805",
        "languages": "english",
        "phone": "(310) 897-4164",
        "email": "ds_peredia@yahoo.com",
        "status": "active"
      },
      {
        "name": "Megan Kleschka",
        "type": "COTA",
        "category": "standard",
        "areas": "South and North County, Long Beach, Lakewood",
        "languages": "english",
        "phone": "(714) 757-0447",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Bianca Nguyen",
        "type": "COTA",
        "category": "standard",
        "areas": "10 miles around Diamond Bar",
        "languages": "Conversational Vietnamese, Farsi",
        "phone": "9096805774",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Mary Mecate",
        "type": "COTA",
        "category": "basic",
        "areas": "Long Beach, Cypress, Los Alamitos, Seal Beach, Cerritos, Norwalk, Artesia, Anaheim, Surrounding Areas",
        "languages": "english",
        "phone": "(310) 270-7659",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Ed Gultom",
        "type": "COTA",
        "category": "standard",
        "areas": "Downtown LA, Mid-City, Mid-Wilshire, Baldwin Hills, West LA, Leimert Park, Inglewood, Cheviot Hills",
        "languages": "english",
        "phone": "(909) 255-1223",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Laura Marriot",
        "type": "COTA",
        "category": "standard",
        "areas": "Palos Verdes Area",
        "languages": "english",
        "phone": "123456789",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Oziel Alba",
        "type": "COTA",
        "category": "standard",
        "areas": "South LA, Hacienda Heights, Downey, West Covina",
        "languages": "english",
        "phone": "(714) 326-9830",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Jane An",
        "type": "COTA",
        "category": "standard",
        "areas": "Glendora, San Dimas, Azusa, Monrovia, Surrounding Areas",
        "languages": "english",
        "phone": "(213) 820-5231",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Ream Hanna",
        "type": "COTA",
        "category": "standard",
        "areas": "Mission Viejo, Aliso Viejo, Irvine, Santa Ana, Garden Grove, Fountain Valley, Huntington Beach, Bellflower, Cerritos",
        "languages": "english",
        "phone": "(310) 618-4497",
        "email": "REAMHANNA@GMAIL.COM",
        "status": "active"
      },
      {
        "name": "Carla Gianzon",
        "type": "COTA",
        "category": "basic",
        "areas": "Eagle Rock, Highland Park, Greater Los Angeles, East LA, South LA, Huntington Park, Inglewood, Culver City, Santa Monica, Mid-City",
        "languages": "english",
        "phone": "(818) 450-9724",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Michelle Rehn",
        "type": "COTA",
        "category": "premium",
        "areas": "Encino, Tarzana, Sherman Oaks, Granada Hills, Porter Ranch, Van Nuys, Canoga Park (parts)",
        "languages": "english",
        "phone": "8182997949",
        "email": "ohsooocute@aol.com",
        "status": "active"
      },
      {
        "name": "Cindy Gutierrez",
        "type": "COTA",
        "category": "standard",
        "areas": "15-20 mile radius of Duarte",
        "languages": "Spanish",
        "phone": "6267333577",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Kristine Frogge",
        "type": "COTA",
        "category": "standard",
        "areas": "Tustin, Santa Ana, Irvine, Orange (City), Fountain Valley, Costa Mesa, Westminster, Huntington Beach (emergencies), Newport Beach (emergencies)",
        "languages": "english",
        "phone": "7146548110",
        "email": "kefrogge@hotmail.com",
        "status": "active"
      },
      {
        "name": "Brandi Reindl",
        "type": "COTA",
        "category": "standard",
        "areas": "Anaheim, Anaheim Hills, Yorba Linda, Orange (part), Placentia",
        "languages": "english",
        "phone": "(714) 609-1573",
        "email": "Nohay@gmail.com",
        "status": "active"
      },
      {
        "name": "Grace de Guzman",
        "type": "COTA",
        "category": "standard",
        "areas": "Duarte, Arcadia, Eagle Rock, Pasadena, San Marino, El Monte, Alhambra, Rosemead",
        "languages": "english",
        "phone": "3235409705",
        "email": "gracedeguzman1207@gmail.com",
        "status": "active"
      },
      {
        "name": "Susan Taylor",
        "type": "COTA",
        "category": "standard",
        "areas": "Azusa, La Puente, Covina, West Covina, San Dimas",
        "languages": "english",
        "phone": "6266217397",
        "email": "Nohay@gmail.com",
        "status": "active"
      }
    
          
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