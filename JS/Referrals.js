document.addEventListener('DOMContentLoaded', () => {
    // Configuración inicial de datos
    const THERAPISTS = [
        {
            id: 1,
            name: 'Peggie McCaffrey',
            type: 'PT',
            areas: ['Inglewood', 'Culver City', 'Westchester', 'Playa del Rey', 'El Segundo', 'Marina del Rey', 'Playa Vista'],
            languages: ['english']
        },
        {
            id: 2,
            name: 'Alex Martinez',
            type: 'PT',
            areas: ['Los Angeles', 'Glendale', 'Pasadena', 'Arcadia'],
            languages: ['Español', 'English']
        },
        {
            id: 3,
            name: 'Luis Nava G',
            type: 'PT',
            areas: ['Caracas', 'Bucaramanga'],
            languages: ['Español', 'English']
        }
    ];

    // Referencias a elementos del DOM
    const disciplineCheckboxes = document.querySelectorAll('input[name="discipline"]');
    const availableTherapistsContainer = document.getElementById('available-therapists-container');
    const unavailableTherapistsContainer = document.getElementById('unavailable-therapists-container');
    const agencySelect = document.getElementById('referral-agency');
    const otherAgencyInput = document.getElementById('other-agency');
    const patientForm = document.getElementById('patient-registration-form');

    // Función para mostrar terapeutas disponibles
    function updateAvailableTherapists() {
        // Obtener disciplinas seleccionadas
        const selectedDisciplines = Array.from(disciplineCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // Filtrar terapeutas
        const availableTherapists = THERAPISTS.filter(therapist => 
            selectedDisciplines.includes(therapist.type)
        );

        // Limpiar contenedor anterior
        availableTherapistsContainer.innerHTML = '';

        if (availableTherapists.length === 0) {
            availableTherapistsContainer.innerHTML = `
                <p class="placeholder">No hay terapeutas disponibles para las disciplinas seleccionadas</p>
            `;
            return;
        }

        // Crear lista de terapeutas
        const therapistList = document.createElement('div');
        therapistList.classList.add('therapist-list');

        availableTherapists.forEach(therapist => {
            const therapistItem = document.createElement('div');
            therapistItem.classList.add('therapist-item');
            therapistItem.innerHTML = `
                <label class="therapist-label">
                    <input type="checkbox" name="available-therapist" value="${therapist.id}">
                    ${therapist.name} (${therapist.type}) - Áreas: ${therapist.areas.join(', ')}
                </label>
            `;
            therapistList.appendChild(therapistItem);
        });

        availableTherapistsContainer.appendChild(therapistList);

        // Actualizar contenedor de terapeutas no disponibles
        updateUnavailableTherapistsContainer(availableTherapists);
    }

    // Función para actualizar contenedor de terapeutas no disponibles
    function updateUnavailableTherapistsContainer(availableTherapists) {
        unavailableTherapistsContainer.innerHTML = '';

        const unavailableList = document.createElement('div');
        unavailableList.classList.add('therapist-list');

        availableTherapists.forEach(therapist => {
            const therapistItem = document.createElement('div');
            therapistItem.classList.add('therapist-item');
            therapistItem.innerHTML = `
                <label class="therapist-label">
                    <input type="checkbox" name="unavailable-therapist" value="${therapist.id}">
                    ${therapist.name} (${therapist.type}) - Áreas: ${therapist.areas.join(', ')}
                </label>
            `;
            unavailableList.appendChild(therapistItem);
        });

        unavailableTherapistsContainer.appendChild(unavailableList);
    }

    // Función para manejar la selección de agencia
    function handleAgencySelection() {
        if (agencySelect.value === 'other') {
            otherAgencyInput.style.display = 'block';
            otherAgencyInput.required = true;
        } else {
            otherAgencyInput.style.display = 'none';
            otherAgencyInput.required = false;
        }
    }

    // Función para manejar el envío del formulario
    function handleFormSubmit(e) {
        e.preventDefault();

        // Recopilar datos del formulario
        const formData = {
            id: Date.now(), // Usar timestamp como ID único
            admissionDate: document.getElementById('patient-admission-date').value,
            patientName: document.getElementById('patient-name').value,
            disciplines: Array.from(document.querySelectorAll('input[name="discipline"]:checked'))
                .map(el => el.value),
            address: document.getElementById('patient-address').value,
            zipCode: document.getElementById('patient-zipcode').value,
            agency: agencySelect.value === 'other' 
                ? document.getElementById('other-agency').value 
                : agencySelect.value,
            notes: document.getElementById('additional-notes').value,
            availableTherapists: Array.from(document.querySelectorAll('input[name="available-therapist"]:checked'))
                .map(el => {
                    const therapist = THERAPISTS.find(t => t.id === parseInt(el.value));
                    return therapist ? therapist.name : null;
                }),
            unavailableTherapists: Array.from(document.querySelectorAll('input[name="unavailable-therapist"]:checked'))
                .map(el => {
                    const therapist = THERAPISTS.find(t => t.id === parseInt(el.value));
                    return therapist ? therapist.name : null;
                })
        };

        // Validaciones adicionales
        if (formData.disciplines.length === 0) {
            alert('Por favor, selecciona al menos una disciplina.');
            return;
        }

        // Guardar en localStorage
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        patients.push(formData);
        localStorage.setItem('patients', JSON.stringify(patients));

        // Mostrar modal de éxito
        const successModal = createSuccessModal();
        document.body.appendChild(successModal);

        // Limpiar formulario
        patientForm.reset();
        availableTherapistsContainer.innerHTML = `
            <p class="placeholder">Selecciona las disciplinas para ver terapeutas disponibles</p>
        `;
        unavailableTherapistsContainer.innerHTML = `
            <p class="placeholder">Selecciona los terapeutas que no cubrirán este caso</p>
        `;
    }

    // Función para crear modal de éxito
    function createSuccessModal() {
        const modal = document.createElement('div');
        modal.classList.add('success-modal');
        modal.innerHTML = `
            <div class="success-modal-content">
                <h2>Información del paciente guardada</h2>
                <p>Los datos se han almacenado correctamente.</p>
                <button id="close-success-modal">Aceptar</button>
            </div>
        `;

        // Estilos para el modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const modalContent = modal.querySelector('.success-modal-content');
        modalContent.style.cssText = `
            background: #233D6E;
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
        `;

        const closeBtn = modal.querySelector('#close-success-modal');
        closeBtn.style.cssText = `
            background-color: #4A90E2;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
            cursor: pointer;
        `;

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        return modal;
    }

    // Event Listeners
    disciplineCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateAvailableTherapists);
    });

    agencySelect.addEventListener('change', handleAgencySelection);
    patientForm.addEventListener('submit', handleFormSubmit);

    // Inicialización de la pantalla de carga
    const loadingScreen = document.getElementById('loading-screen');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.style.display = 'none', 300);
    }, 2000);
});