document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const patientForm = document.getElementById('patient-form');
    const agencySearch = document.getElementById('agency-search');
    const agenciesList = document.getElementById('agencies-list');
    const selectedAgencyInput = document.getElementById('selected-agency');

    // Lista de agencias
    const agencies = [
        { id: '24-7', name: '24/7' },
        { id: '247hhs', name: '247hhs' },
        { id: 'able-hands', name: 'Able Hands' }
    ];

    // Función para mostrar las agencias
    function displayAgencies(searchTerm = '') {
        const filteredAgencies = agencies.filter(agency => 
            agency.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        agenciesList.innerHTML = '';

        if (filteredAgencies.length === 0) {
            agenciesList.innerHTML = '<p class="no-results">No se encontraron agencias</p>';
            return;
        }

        filteredAgencies.forEach(agency => {
            const agencyElement = document.createElement('div');
            agencyElement.className = 'agency-item';
            agencyElement.textContent = agency.name;
            agencyElement.dataset.id = agency.id;

            // Agregar evento de click
            agencyElement.addEventListener('click', () => selectAgency(agency));
            
            agenciesList.appendChild(agencyElement);
        });
    }

    // Función para seleccionar una agencia
    function selectAgency(agency) {
        selectedAgencyInput.value = agency.id;
        
        // Actualizar UI para mostrar la selección
        document.querySelectorAll('.agency-item').forEach(item => {
            item.classList.remove('selected');
            if (item.dataset.id === agency.id) {
                item.classList.add('selected');
            }
        });
    }

    // Función para guardar paciente
    function savePatient(patientData) {
        try {
            // Obtener lista actual de pacientes
            let patients = JSON.parse(localStorage.getItem('referrals') || '[]');
            
            // Crear nuevo paciente
            const newPatient = {
                date: new Date().toLocaleDateString(),
                patientName: patientData.name,
                PT: patientData.services.includes('PT') ? 'X' : '',
                PTA: patientData.services.includes('PTA') ? 'X' : '',
                OT: patientData.services.includes('OT') ? 'X' : '',
                COTA: patientData.services.includes('COTA') ? 'X' : '',
                ST: patientData.services.includes('ST') ? 'X' : '',
                STA: '',
                decline: '',
                dateOfEval: new Date().toLocaleDateString(),
                address: patientData.address,
                agency: patientData.agencyName
            };
            
            // Agregar a la lista
            patients.push(newPatient);
            
            // Guardar en localStorage
            localStorage.setItem('referrals', JSON.stringify(patients));
            
            return true;
        } catch (error) {
            console.error('Error al guardar:', error);
            return false;
        }
    }

    // Event Listeners
    agencySearch.addEventListener('input', (e) => {
        displayAgencies(e.target.value);
    });

    patientForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar servicios seleccionados
        const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
            .map(checkbox => checkbox.value);

        if (selectedServices.length === 0) {
            alert('Por favor, selecciona al menos un servicio');
            return;
        }

        // Validar agencia seleccionada
        if (!selectedAgencyInput.value) {
            alert('Por favor, selecciona una agencia');
            return;
        }

        const selectedAgency = agencies.find(a => a.id === selectedAgencyInput.value);

        // Recopilar datos del formulario
        const patientData = {
            name: document.getElementById('patient-name').value,
            agencyId: selectedAgencyInput.value,
            agencyName: selectedAgency.name,
            services: selectedServices,
            address: document.getElementById('patient-address').value,
            zipCode: document.getElementById('patient-zip').value,
            notes: document.getElementById('notes').value
        };

        // Guardar paciente
        if (savePatient(patientData)) {
            alert('Paciente registrado exitosamente');
            patientForm.reset();
            window.location.href = 'Referrals.html';
        } else {
            alert('Error al registrar el paciente');
        }
    });

    // Inicializar mostrando todas las agencias
    displayAgencies();
});