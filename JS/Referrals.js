// Pacients.js - Manejo de pacientes

document.addEventListener('DOMContentLoaded', async () => {
    // Referencias a elementos del DOM
    const patientForm = document.getElementById('patient-form');
    const patientName = document.getElementById('patient-name');
    const agencySearch = document.getElementById('agency-search');
    const agenciesList = document.getElementById('agencies-list');
    const selectedAgencyInput = document.getElementById('selected-agency');
    
    console.log("Elementos disponibles en Pacients.js:", {
        patientForm: !!patientForm,
        patientName: !!patientName,
        agencySearch: !!agencySearch,
        agenciesList: !!agenciesList,
        selectedAgencyInput: !!selectedAgencyInput
    });
    
    // Cargar agencias
    const agencias = await DataManager.getAgencias();
    
    // Comprobar si hay un referido en la URL
    const params = new URLSearchParams(window.location.search);
    const referralId = params.get('referralId');
    
    console.log("Referido ID recibido:", referralId);
    
    // Cargar datos del referido si existe
    if (referralId) {
        await loadReferralData(referralId);
    }
    
    // Función para cargar datos del referido
    async function loadReferralData(refId) {
        try {
            // Obtener referido
            const referrals = await DataManager.getReferrals();
            const referral = referrals.find(r => r.id === refId);
            
            if (!referral) {
                console.error("Referido no encontrado:", refId);
                return;
            }
            
            console.log("Referido encontrado:", referral);
            
            // Obtener datos de la agencia
            const agency = agencias.find(a => a.id === referral.agenciaId);
            
            if (!agency) {
                console.error("Agencia no encontrada:", referral.agenciaId);
                return;
            }
            
            console.log("Agencia encontrada:", agency);
            
            // Llenar formulario
            if (selectedAgencyInput) selectedAgencyInput.value = referral.agenciaId;
            if (agencySearch) agencySearch.value = agency.nombre;
            
            // Asignar un nombre de paciente sugerido
            if (patientName) {
                patientName.value = `Paciente - ${agency.nombre} - ${new Date().toLocaleDateString()}`;
            }
            
            // Rellenar dirección, código postal y notas
            const addressField = document.getElementById('patient-address');
            if (addressField) addressField.value = referral.direccion || '';
            
            const zipField = document.getElementById('patient-zip');
            if (zipField) zipField.value = referral.zipCode || '';
            
            const notesField = document.getElementById('notes');
            if (notesField) notesField.value = referral.notas || '';
            
            // Marcar servicios
            if (referral.servicios && Array.isArray(referral.servicios)) {
                referral.servicios.forEach(service => {
                    const checkbox = document.querySelector(`input[name="services"][value="${service}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }
            
            // Mostrar notificación
            showReferralNotification(referral, agency);
        } catch (error) {
            console.error("Error cargando datos del referido:", error);
        }
    }
    
    // Función para mostrar notificación de referido
    function showReferralNotification(referral, agency) {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = 'referral-notification';
        notification.style.backgroundColor = '#e8f5e9';
        notification.style.padding = '10px';
        notification.style.margin = '10px 0';
        notification.style.borderRadius = '4px';
        notification.style.border = '1px solid #a5d6a7';
        
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <p>Estás creando un paciente a partir del referido <strong>${referral.id}</strong> de la agencia <strong>${agency.nombre}</strong>.</p>
            <button class="close-notification" style="background: none; border: none; cursor: pointer; float: right;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Insertar al inicio del formulario
        if (patientForm) {
            const formContainer = patientForm.closest('.container') || patientForm.parentElement;
            formContainer.insertBefore(notification, formContainer.firstChild);
            
            // Evento para cerrar
            notification.querySelector('.close-notification').addEventListener('click', () => {
                notification.remove();
            });
        }
    }
    
    // Función para mostrar agencias en lista
    function displayAgencies(searchTerm = '') {
        if (!agenciesList) return;
        
        agenciesList.innerHTML = '';
        agenciesList.style.display = 'block';
        
        if (!searchTerm.trim()) {
            agenciesList.innerHTML = '<p class="no-results">Escribe para buscar agencias...</p>';
            return;
        }
        
        const filteredAgencies = agencias.filter(agency =>
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
            agencyElement.dataset.id = agency.id;
            agencyElement.dataset.nombre = agency.nombre;
            
            agencyElement.addEventListener('click', () => {
                if (selectedAgencyInput && agencySearch) {
                    selectedAgencyInput.value = agency.id;
                    agencySearch.value = agency.nombre;
                    agenciesList.style.display = 'none';
                }
            });
            
            agenciesList.appendChild(agencyElement);
        });
    }
    
    // Función para guardar paciente
    async function savePatient(patientData) {
        try {
            // Crear paciente
            const newPatient = await DataManager.createPatient(patientData);
            
            console.log("Paciente guardado:", newPatient);
            return true;
        } catch (error) {
            console.error("Error guardando paciente:", error);
            return false;
        }
    }
    
    // Event Listeners
    if (patientForm) {
        patientForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            console.log("Formulario enviado");
            
            // Validar servicios seleccionados
            const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
                .map(checkbox => checkbox.value);
            
            if (selectedServices.length === 0) {
                alert('Por favor, selecciona al menos un servicio');
                return;
            }
            
            // Validar agencia
            if (!selectedAgencyInput || !selectedAgencyInput.value) {
                alert('Por favor, selecciona una agencia');
                return;
            }
            
            // Obtener datos de la agencia
            const selectedAgency = agencias.find(a => a.id === selectedAgencyInput.value);
            
            if (!selectedAgency) {
                alert('Agencia no encontrada');
                return;
            }
            
            // Recopilar datos
            const patientData = {
                name: patientName ? patientName.value : `Paciente - ${new Date().toLocaleDateString()}`,
                agencyId: selectedAgencyInput.value,
                agencyName: selectedAgency.nombre,
                referralId: referralId, // ID del referido de la URL
                services: selectedServices,
                address: document.getElementById('patient-address')?.value || "",
                zipCode: document.getElementById('patient-zip')?.value || "",
                notes: document.getElementById('notes')?.value || ""
            };
            
            console.log("Datos del paciente a guardar:", patientData);
            
            // Guardar paciente
            if (await savePatient(patientData)) {
                alert('Paciente registrado exitosamente');
                patientForm.reset();
                
                // Limpiar campos
                if (selectedAgencyInput) selectedAgencyInput.value = '';
                if (agencySearch) agencySearch.value = '';
                if (agenciesList) agenciesList.style.display = 'none';
                
                // Redirigir a la lista de pacientes
                window.location.href = 'Referrals.html';
            } else {
                alert('Error al registrar el paciente');
            }
        });
    }
    
    // Event listeners para buscador de agencias
    if (agencySearch) {
        agencySearch.addEventListener('focus', () => {
            displayAgencies(agencySearch.value);
        });
        
        agencySearch.addEventListener('input', (e) => {
            displayAgencies(e.target.value);
        });
        
        agencySearch.addEventListener('blur', () => {
            setTimeout(() => {
                if (agenciesList && !agenciesList.contains(document.activeElement)) {
                    agenciesList.style.display = 'none';
                }
            }, 200);
        });
    }
    
    // Inicializar
    if (agenciesList) agenciesList.style.display = 'none';
});