// Referrals.js

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const patientForm = document.getElementById('patient-form');
    const agencySearch = document.getElementById('agency-search');
    const agenciesList = document.getElementById('agencies-list');
    const selectedAgencyInput = document.getElementById('selected-agency');

    let agenciesData = []; // Variable para almacenar las agencias cargadas

    // Función para cargar las agencias desde agencias.json
    async function loadAgencies() {
        try {
            const response = await fetch('./json/agencias.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            agenciesData = data;
            
            // Guardar en localStorage y mantener los contadores
            if (!localStorage.getItem('agencias')) {
                localStorage.setItem('agencias', JSON.stringify(data));
            } else {
                // Actualizar datos manteniendo los contadores existentes
                const storedAgencies = JSON.parse(localStorage.getItem('agencias'));
                data.forEach(agency => {
                    const stored = storedAgencies.find(a => a.id === agency.id);
                    if (stored) {
                        agency.referidos = stored.referidos;
                        agency.pacientesActivos = stored.pacientesActivos;
                    }
                });
                localStorage.setItem('agencias', JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error cargando agencias:', error);
            agenciesList.innerHTML = '<p class="no-results">Error al cargar agencias: ' + error.message + '</p>';
            agenciesList.style.display = 'block';
        }
    }

    // Función para mostrar las agencias filtradas
    function displayAgencies(searchTerm = '') {
        agenciesList.innerHTML = '';
        agenciesList.style.display = 'block';

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
            agencyElement.textContent = `${agency.nombre} (${agency.referidos} referidos)`;
            agencyElement.dataset.id = agency.id; // Usar ID en lugar de nombre
            agencyElement.dataset.nombre = agency.nombre;

            agencyElement.addEventListener('click', () => selectAgency(agency));
            agenciesList.appendChild(agencyElement);
        });
    }

    // Función para seleccionar una agencia
    function selectAgency(agency) {
        selectedAgencyInput.value = agency.id; // Guardar ID
        agencySearch.value = agency.nombre; // Mostrar nombre
        agenciesList.style.display = 'none';
    }

    // Función para guardar referido y actualizar datos
    async function saveReferral(referralData) {
        try {
            // Crear nuevo referido
            const referralId = `REF${Date.now()}`;
            const newReferral = {
                id: referralId,
                fecha: new Date().toISOString().split('T')[0],
                pacienteId: "", // Se llenará cuando se cree el paciente
                agenciaId: referralData.agencyId,
                estado: "pendiente",
                servicios: referralData.services,
                direccion: referralData.address,
                zipCode: referralData.zipCode,
                notas: referralData.notes
            };

            // Guardar en localStorage
            let referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
            referrals.push(newReferral);
            localStorage.setItem('referrals', JSON.stringify(referrals));

            // Actualizar contador de la agencia
            let agencies = JSON.parse(localStorage.getItem('agencias'));
            const agencyIndex = agencies.findIndex(a => a.id === referralData.agencyId);
            if (agencyIndex !== -1) {
                agencies[agencyIndex].referidos++;
                localStorage.setItem('agencias', JSON.stringify(agencies));
            }

            // Redirigir a la página de pacientes con el ID del referido
            window.location.href = `Pacients.html?referralId=${referralId}`;
            return true;
        } catch (error) {
            console.error('Error al guardar:', error);
            return false;
        }
    }

    // Event Listeners
    if (patientForm) {
        patientForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validar servicios seleccionados
            const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
                .map(checkbox => checkbox.value);

            if (selectedServices.length === 0) {
                alert('Por favor, selecciona al menos un servicio');
                return;
            }

            if (!selectedAgencyInput.value) {
                alert('Por favor, selecciona una agencia');
                return;
            }

            // Recopilar datos del formulario
            const referralData = {
                agencyId: selectedAgencyInput.value,
                services: selectedServices,
                address: document.getElementById('patient-address').value,
                zipCode: document.getElementById('patient-zip').value,
                notes: document.getElementById('notes').value
            };

            // Guardar referido
            if (await saveReferral(referralData)) {
                alert('Referido registrado exitosamente');
                patientForm.reset();
                selectedAgencyInput.value = '';
                agencySearch.value = '';
                agenciesList.style.display = 'none';
            } else {
                alert('Error al registrar el referido');
            }
        });
    }

    // Event listeners para el buscador de agencias
    agencySearch.addEventListener('focus', () => {
        if (!agenciesData.length) {
            loadAgencies();
        }
        displayAgencies(agencySearch.value);
    });

    agencySearch.addEventListener('input', (e) => {
        displayAgencies(e.target.value);
    });

    agencySearch.addEventListener('blur', () => {
        setTimeout(() => {
            if (!agenciesList.contains(document.activeElement)) {
                agenciesList.style.display = 'none';
            }
        }, 200);
    });

    // Cargar agencias al iniciar
    loadAgencies();
});