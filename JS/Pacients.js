document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos
    const filterBtn = document.getElementById('filter-btn');
    const exportBtn = document.getElementById('export-btn');
    const filterModal = document.getElementById('filter-modal');
    const tableBody = document.getElementById('referrals-table-body');
    const searchInput = document.querySelector('.search-input');

    // Datos de ejemplo (esto vendría de tu backend)
    let patientsData = [
        {
            date: '3-24-23',
            name: 'Kruse Marian',
            status: 'new', // rojo
            therapists: {
                PT: null,
                PTA: null,
                OT: null,
                COTA: null,
                ST: 'Arya',
                STA: null
            },
            decline: '',
            evalDate: '',
            address: '429 S. Rodeo Dr.Beverly Hills,Santa CA Z',
            agency: 'Universal'
        },
        // Más datos...
    ];

    // Estados de los pacientes
    const PATIENT_STATES = {
        NEW: 'new',           // rojo
        ACCEPTED: 'accepted', // amarillo
        PENDING: 'pending',   // morado
        COMPLETED: 'completed', // blanco
        CANCELLED: 'cancelled'  // negro
    };

    // Estados de los terapeutas
    const THERAPIST_STATES = {
        UNASSIGNED: 'unassigned', // blanco
        CONSULTING: 'consulting', // naranja
        ACCEPTED: 'accepted'      // verde
    };

    // Función para cargar datos en la tabla
    function loadTableData(data) {
        tableBody.innerHTML = '';
        data.forEach(patient => {
            const row = createPatientRow(patient);
            tableBody.appendChild(row);
        });
    }

    // Crear fila de paciente
    function createPatientRow(patient) {
        const row = document.createElement('tr');
        row.classList.add(`row-${patient.status || 'new'}`);

        const cells = [
            { text: patient.date, class: 'date-cell' },
            { text: patient.name },
            createTherapistCell('PT', patient.therapists?.PT),
            createTherapistCell('PTA', patient.therapists?.PTA),
            createTherapistCell('OT', patient.therapists?.OT),
            createTherapistCell('COTA', patient.therapists?.COTA),
            createTherapistCell('ST', patient.therapists?.ST),
            createTherapistCell('STA', patient.therapists?.STA),
            { text: patient.decline || '-', class: 'decline-cell' },
            { text: patient.evalDate || '-' },
            { text: patient.address },
            { text: patient.agency }
        ];

        cells.forEach(cell => {
            if (typeof cell === 'object' && !(cell instanceof Node)) {
                const td = document.createElement('td');
                td.textContent = cell.text;
                if (cell.class) td.classList.add(cell.class);
                row.appendChild(td);
            } else {
                row.appendChild(cell);
            }
        });

        return row;
    }

    // Crear celda de terapeuta
    function createTherapistCell(type, currentTherapist) {
        const cell = document.createElement('td');
        cell.classList.add('therapist-cell');

        if (currentTherapist) {
            cell.textContent = currentTherapist;
            cell.classList.add('state-accepted');
        } else {
            cell.classList.add('state-unassigned');
        }

        // Hacer la celda editable
        cell.addEventListener('dblclick', function() {
            const currentState = this.className.includes('state-accepted') ? 'accepted' : 'unassigned';
            const select = createTherapistSelect(type, currentState);
            
            this.textContent = '';
            this.appendChild(select);
            select.focus();
        });

        return cell;
    }

    // Crear selector de terapeuta
    function createTherapistSelect(type, currentState) {
        const select = document.createElement('select');
        select.classList.add('therapist-state-select');

        // Opciones del selector
        const therapists = {
            PT: ['Alex', 'Peggy', 'James'],
            PTA: ['Tanya', 'Oswaldo'],
            OT: ['Betty', 'Rosalind', 'Gordon'],
            COTA: ['Shari', 'April Kim', 'Ed'],
            ST: ['Arya', 'James Steven'],
            STA: ['Vincent', 'Wilma']
        };

        // Opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccionar';
        select.appendChild(defaultOption);

        // Agregar terapeutas disponibles
        therapists[type].forEach(therapist => {
            const option = document.createElement('option');
            option.value = therapist;
            option.textContent = therapist;
            select.appendChild(option);
        });

        // Evento de cambio
        select.addEventListener('change', function() {
            const cell = this.parentElement;
            const selectedTherapist = this.value;

            if (selectedTherapist) {
                cell.textContent = selectedTherapist;
                cell.classList.remove('state-unassigned');
                cell.classList.add('state-accepted');
            } else {
                cell.textContent = '';
                cell.classList.remove('state-accepted');
                cell.classList.add('state-unassigned');
            }
        });

        return select;
    }

    // Función de búsqueda
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = patientsData.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm) ||
            patient.address.toLowerCase().includes(searchTerm)
        );
        loadTableData(filteredData);
    });

    // Función de filtrado
    filterBtn.addEventListener('click', () => {
        // Mostrar modal de filtros
        filterModal.style.display = 'block';
    });

    // Aplicar filtros
    document.getElementById('apply-filters').addEventListener('click', () => {
        const dateFrom = document.getElementById('filter-date-from').value;
        const dateTo = document.getElementById('filter-date-to').value;
        const agency = document.getElementById('filter-agency').value;

        let filteredData = [...patientsData];

        if (dateFrom) {
            filteredData = filteredData.filter(patient => {
                const patientDate = new Date(patient.date);
                return patientDate >= new Date(dateFrom);
            });
        }

        if (dateTo) {
            filteredData = filteredData.filter(patient => {
                const patientDate = new Date(patient.date);
                return patientDate <= new Date(dateTo);
            });
        }

        if (agency) {
            filteredData = filteredData.filter(patient => 
                patient.agency.toLowerCase() === agency.toLowerCase()
            );
        }

        loadTableData(filteredData);
        filterModal.style.display = 'none';
    });

    // Función de exportación
    exportBtn.addEventListener('click', () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Headers
        const headers = [
            "Date", "Patient's name", "PT", "PTA", "OT", "COTA", "ST", "STA",
            "Decline", "DATE OF EVAL", "Address", "Agency"
        ];
        csvContent += headers.join(",") + "\n";

        // Datos
        patientsData.forEach(patient => {
            const row = [
                patient.date,
                patient.name,
                patient.therapists?.PT || "",
                patient.therapists?.PTA || "",
                patient.therapists?.OT || "",
                patient.therapists?.COTA || "",
                patient.therapists?.ST || "",
                patient.therapists?.STA || "",
                patient.decline || "",
                patient.evalDate || "",
                `"${patient.address}"`, // Usando comillas para manejar comas en direcciones
                patient.agency
            ];
            csvContent += row.join(",") + "\n";
        });

        // Crear y descargar el archivo
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "referrals_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Cerrar modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        filterModal.style.display = 'none';
    });

    // Limpiar filtros
    document.getElementById('clear-filters').addEventListener('click', () => {
        document.getElementById('filter-date-from').value = '';
        document.getElementById('filter-date-to').value = '';
        document.getElementById('filter-agency').value = '';
        loadTableData(patientsData);
        filterModal.style.display = 'none';
    });

    // Cargar datos iniciales
    loadTableData(patientsData);
});


// Modificar la función loadAgencies
function loadAgencies() {
    fetch('./JSON/agencias.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Guardar en localStorage si no existe
            if (!localStorage.getItem('agencias')) {
                localStorage.setItem('agencias', JSON.stringify(data));
            }
            agenciesData = data;
        })
        .catch(error => {
            console.error('Error cargando agencias:', error);
        });
}

patientForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validaciones existentes...

    // Obtener agencias de localStorage
    let agencies = JSON.parse(localStorage.getItem('agencias') || '[]');
    
    // Encontrar la agencia seleccionada
    const agencyIndex = agencies.findIndex(
        agency => agency.nombre === selectedAgencyInput.value
    );

    if (agencyIndex !== -1) {
        // Incrementar referidos
        agencies[agencyIndex].referidos++;
        
        // Guardar cambios en localStorage
        localStorage.setItem('agencias', JSON.stringify(agencies));
    }

    // Resto de tu lógica de guardado...
});

