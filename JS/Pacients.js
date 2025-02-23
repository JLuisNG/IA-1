document.addEventListener('DOMContentLoaded', () => {
    // Estados de color para disciplinas
    const DISCIPLINE_STATES = {
        WHITE: 'blanco',      // Estado inicial
        ORANGE: 'naranja',    // Consultando
        GREEN: 'verde'        // Aceptado
    };

    // Referencias a elementos del DOM
    const referralsTableBody = document.getElementById('referrals-table-body');
    const filterBtn = document.getElementById('filter-btn');
    const filterModal = document.getElementById('filter-modal');
    const exportBtn = document.getElementById('export-btn');

    // Función para crear celda de disciplina con selector de estado
    function createDisciplineCell(discipline, currentState) {
        const cell = document.createElement('td');
        cell.classList.add('discipline-cell');

        // Checkbox para disciplina
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = currentState !== DISCIPLINE_STATES.WHITE;

        // Selector de estado
        const stateSelect = document.createElement('select');
        stateSelect.classList.add('discipline-state-select');
        
        // Opciones de estado
        const states = [
            { value: DISCIPLINE_STATES.WHITE, label: 'Sin asignar' },
            { value: DISCIPLINE_STATES.ORANGE, label: 'Consultando' },
            { value: DISCIPLINE_STATES.GREEN, label: 'Aceptado' }
        ];

        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state.value;
            option.textContent = state.label;
            stateSelect.appendChild(option);
        });

        // Establecer estado actual
        stateSelect.value = currentState;

        // Aplicar color de fondo según estado
        cell.classList.add(`bg-${currentState}`);

        // Cambiar estado
        stateSelect.addEventListener('change', () => {
            // Quitar clases de color anteriores
            cell.classList.remove('bg-blanco', 'bg-naranja', 'bg-verde');
            
            // Añadir nueva clase de color
            cell.classList.add(`bg-${stateSelect.value}`);

            // Actualizar estado de la disciplina
            updatePatientDisciplineState(
                cell.closest('tr').dataset.patientId, 
                discipline, 
                stateSelect.value
            );

            // Actualizar checkbox
            checkbox.checked = stateSelect.value !== DISCIPLINE_STATES.WHITE;
        });

        // Contenedor para agrupar checkbox y selector
        const cellContainer = document.createElement('div');
        cellContainer.classList.add('discipline-cell-container');
        cellContainer.appendChild(checkbox);
        cellContainer.appendChild(stateSelect);

        cell.appendChild(cellContainer);
        return cell;
    }

    // Función para actualizar estado de disciplina de un paciente
    function updatePatientDisciplineState(patientId, discipline, state) {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patientIndex = patients.findIndex(p => p.id.toString() === patientId);

        if (patientIndex !== -1) {
            // Asegurar que existe el objeto de estados de disciplina
            if (!patients[patientIndex].disciplineStates) {
                patients[patientIndex].disciplineStates = {};
            }

            // Actualizar estado de la disciplina
            patients[patientIndex].disciplineStates[discipline] = state;

            // Guardar cambios
            localStorage.setItem('patients', JSON.stringify(patients));
        }
    }

    // Función para cargar y renderizar pacientes
    function loadPatients() {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        referralsTableBody.innerHTML = '';

        patients.forEach((patient, index) => {
            const row = document.createElement('tr');
            row.dataset.patientId = patient.id;
            
            // Formatear fecha
            const formattedDate = new Date(patient.admissionDate).toLocaleDateString('es-ES');

            // Crear celdas
            const dateCell = createEditableCell(formattedDate, (newValue) => {
                patient.admissionDate = new Date(newValue).toISOString();
                savePatients();
            });

            const nameCell = createEditableCell(patient.patientName, (newValue) => {
                patient.patientName = newValue;
                savePatients();
            });

            // Disciplinas con estados
            const disciplines = ['PT', 'PTA', 'OT', 'COTA', 'ST', 'STA'];
            const disciplineCells = disciplines.map(disc => {
                // Obtener estado actual de la disciplina
                const currentState = (patient.disciplineStates && patient.disciplineStates[disc]) 
                    || DISCIPLINE_STATES.WHITE;
                
                return createDisciplineCell(disc, currentState);
            });

            const notesCell = createEditableCell(patient.notes || '', (newValue) => {
                patient.notes = newValue;
                savePatients();
            });

            // Estado general de disponibilidad
            const availabilityCell = createAvailabilityCell(patient);

            // Celdas estáticas
            const evaluationDateCell = createEditableCell('-', (newValue) => {
                // Lógica para fecha de evaluación
            });

            const addressCell = createEditableCell(patient.address, (newValue) => {
                patient.address = newValue;
                savePatients();
            });

            const agencyCell = createEditableCell(patient.agency, (newValue) => {
                patient.agency = newValue;
                savePatients();
            });

            // Botones de acción
            const actionsCell = createActionsCell(patient);

            // Agregar celdas a la fila
            row.appendChild(dateCell);
            row.appendChild(nameCell);
            disciplineCells.forEach(cell => row.appendChild(cell));
            row.appendChild(notesCell);
            row.appendChild(availabilityCell);
            row.appendChild(evaluationDateCell);
            row.appendChild(addressCell);
            row.appendChild(agencyCell);
            row.appendChild(actionsCell);

            referralsTableBody.appendChild(row);
        });
    }

    // Función para crear celda de disponibilidad
    function createAvailabilityCell(patient) {
        const cell = document.createElement('td');
        const select = document.createElement('select');
        const options = [
            'Pendiente eval.',
            'Consultando',
            'Aceptado',
            'No disponible'
        ];
        
        options.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option;
            optionEl.textContent = option;
            select.appendChild(optionEl);
        });

        select.value = 'Pendiente eval.';
        cell.appendChild(select);
        return cell;
    }

    // Función para crear celdas editables
    function createEditableCell(value, onBlur) {
        const cell = document.createElement('td');
        cell.textContent = value;
        cell.setAttribute('contenteditable', 'true');
        cell.classList.add('editable-cell');
        
        cell.addEventListener('blur', () => {
            onBlur(cell.textContent);
        });

        return cell;
    }

    // Función para crear celdas de acciones
    function createActionsCell(patient) {
        const cell = document.createElement('td');
        
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.classList.add('action-btn', 'edit-btn');
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add('action-btn', 'delete-btn');
        
        deleteBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de eliminar este paciente?')) {
                const patients = JSON.parse(localStorage.getItem('patients') || '[]');
                const updatedPatients = patients.filter(p => p.id !== patient.id);
                localStorage.setItem('patients', JSON.stringify(updatedPatients));
                loadPatients();
            }
        });

        cell.appendChild(editBtn);
        cell.appendChild(deleteBtn);

        return cell;
    }

    // Guardar pacientes
    function savePatients() {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        localStorage.setItem('patients', JSON.stringify(patients));
    }

    // Inicialización
    function init() {
        loadPatients();
        
        // Configuraciones adicionales...
        const loadingScreen = document.getElementById('loading-screen');
        
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 300);
        }, 2000);
    }

    // Ejecutar inicialización
    init();
});