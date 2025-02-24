document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const patientForm = document.getElementById('patient-form');
    const agencySearch = document.getElementById('agency-search');
    const agenciesList = document.getElementById('agencies-list');
    const selectedAgencyInput = document.getElementById('selected-agency');

    let agenciesData = []; // Variable para almacenar las agencias cargadas

    // Función para cargar las agencias desde agencias.json
    function loadAgencies() {
        fetch('./JSON/agencias.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                agenciesData = data; // Guardar las agencias en una variable global
                if (!localStorage.getItem('agencias')) {
                    localStorage.setItem('agencias', JSON.stringify(data));
                }
            })
            .catch(error => {
                console.error('Error cargando agencias:', error);
                agenciesList.innerHTML = '<p class="no-results">Error al cargar agencias: ' + error.message + '</p>';
                agenciesList.style.display = 'block'; // Mostrar el mensaje de error
            });
    }

    // Función para mostrar las agencias (filtradas por búsqueda)
    function displayAgencies(searchTerm = '') {
        agenciesList.innerHTML = '';
        agenciesList.style.display = 'block'; // Mostrar la lista solo cuando hay búsqueda

        if (!searchTerm.trim()) {
            agenciesList.innerHTML = '<p class="no-results">Escribe para buscar agencias...</p>';
            return;
        }

        const filteredAgencies = agenciesData.filter(agency =>
            agency.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredAgencies.length === 0) {
            agenciesList.innerHTML = '<p class="no-results">No se encontraron agencias</p>';
            return;
        }

        filteredAgencies.forEach(agency => {
            const agencyElement = document.createElement('div');
            agencyElement.className = 'agency-item';
            agencyElement.textContent = `${agency.nombre} (${agency.referidos} referidos)`; // Mostrar contador
            agencyElement.dataset.id = agency.nombre; // Usamos nombre como ID por simplicidad

            // Agregar evento de click
            agencyElement.addEventListener('click', () => selectAgency(agency));
            
            agenciesList.appendChild(agencyElement);
        });
    }

    // Función para seleccionar una agencia
    function selectAgency(agency) {
        selectedAgencyInput.value = agency.nombre;
        agencySearch.value = agency.nombre; // Mostrar la agencia seleccionada en el campo de búsqueda
        agenciesList.style.display = 'none'; // Ocultar la lista después de seleccionar
        agencySearch.focus(); // Mantener el foco en el campo para seguir editando si es necesario
    }

    // Función para guardar paciente y actualizar datos
    function savePatient(patientData) {
        try {
            // Obtener lista actual de pacientes desde localStorage
            let patients = JSON.parse(localStorage.getItem('pacientes') || '[]');
            
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
                zipCode: patientData.zipCode,
                notes: patientData.notes,
                agency: patientData.agencyName
            };
            
            // Agregar a la lista de pacientes
            patients.push(newPatient);
            localStorage.setItem('pacientes', JSON.stringify(patients));

            // Actualizar el contador de la agencia en localStorage
            let agencies = JSON.parse(localStorage.getItem('agencias'));
            const selectedAgency = agencies.find(a => a.nombre === patientData.agencyName);
            if (selectedAgency) {
                selectedAgency.referidos += 1;
                localStorage.setItem('agencias', JSON.stringify(agencias));
            }

            return true;
        } catch (error) {
            console.error('Error al guardar:', error);
            return false;
        }
    }

    // Event Listeners
    agencySearch.addEventListener('focus', () => {
        // Mostrar un mensaje inicial cuando el usuario hace clic en el campo
        if (!agenciesData.length) {
            loadAgencies(); // Cargar agencias si aún no están cargadas
        } else {
            displayAgencies(agencySearch.value); // Mostrar lista con el texto actual
        }
    });

    agencySearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        if (agenciesData.length) {
            displayAgencies(searchTerm);
        }
    });

    agencySearch.addEventListener('blur', () => {
        // Ocultar la lista si el usuario hace clic fuera, pero no si está seleccionando una agencia
        setTimeout(() => {
            if (!agenciesList.contains(document.activeElement)) {
                agenciesList.style.display = 'none';
            }
        }, 200); // Pequeño retraso para permitir clics en las agencias
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

        const selectedAgency = JSON.parse(localStorage.getItem('agencias')).find(
            a => a.nombre === selectedAgencyInput.value
        );

        // Recopilar datos del formulario
        const patientData = {
            name: document.getElementById('patient-name').value,
            agencyId: selectedAgencyInput.value,
            agencyName: selectedAgency.nombre,
            services: selectedServices,
            address: document.getElementById('patient-address').value,
            zipCode: document.getElementById('patient-zip').value,
            notes: document.getElementById('notes').value
        };

        // Guardar paciente
        if (savePatient(patientData)) {
            alert('Paciente registrado exitosamente');
            patientForm.reset();
            selectedAgencyInput.value = ''; // Limpiar selección
            agencySearch.value = ''; // Limpiar el campo de búsqueda
            agenciesList.style.display = 'none'; // Ocultar la lista después de guardar
        } else {
            alert('Error al registrar el paciente');
        }
    });

    // Inicializar (no cargar agencias automáticamente)
    agenciesList.style.display = 'none'; // Ocultar la lista inicialmente
});

document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos de pacientes desde localStorage
    let patientsData = DataManager.getPatients();

    // Función para cargar datos en la tabla
    function loadTableData(data) {
        tableBody.innerHTML = '';
        data.forEach(patient => {
            const row = createPatientRow(patient);
            tableBody.appendChild(row);
        });
    }

    // Cargar datos iniciales
    loadTableData(patientsData);

    // Las demás funciones de filtrado y búsqueda pueden permanecer igual
});

