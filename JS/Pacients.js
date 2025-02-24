// Pacients.js
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const patientForm = document.getElementById('patient-form');
    const patientName = document.getElementById('patient-name');
    const agencySearch = document.getElementById('agency-search');
    const agenciesList = document.getElementById('agencies-list');
    const selectedAgencyInput = document.getElementById('selected-agency');
    const tableBody = document.querySelector('.patients-table tbody') || document.getElementById('referrals-table-body');
    const searchInput = document.querySelector('.search-input');
    
    // Debug: Ver qué elementos están disponibles
    console.log("Elementos disponibles en Pacients.js:", {
        patientForm: !!patientForm,
        patientName: !!patientName,
        agencySearch: !!agencySearch,
        agenciesList: !!agenciesList,
        selectedAgencyInput: !!selectedAgencyInput,
        tableBody: !!tableBody,
        searchInput: !!searchInput
    });

    // Comprobar si hay un referido en la URL
    const params = new URLSearchParams(window.location.search);
    const referralId = params.get('referralId');
    
    // Debug: Ver si se recibió el ID del referido
    console.log("Referido ID recibido:", referralId);
    
    // Carga el referido si existe
    if (referralId) {
        loadReferralData(referralId);
    }
    
    // Función para cargar datos del referido
    function loadReferralData(refId) {
        try {
            // Obtener el referido de localStorage
            const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
            console.log("Referidos en localStorage:", referrals);
            
            const referral = referrals.find(r => r.id === refId);
            
            if (!referral) {
                console.error('Referido no encontrado:', refId);
                return;
            }
            
            console.log("Referido encontrado:", referral);
            
            // Obtener datos de la agencia
            const agencies = JSON.parse(localStorage.getItem('agencias') || '[]');
            const agency = agencies.find(a => a.id === referral.agenciaId);
            
            if (!agency) {
                console.error('Agencia no encontrada:', referral.agenciaId);
                return;
            }
            
            console.log("Agencia encontrada:", agency);
            
            // Rellenar el formulario con datos del referido
            if (selectedAgencyInput) selectedAgencyInput.value = referral.agenciaId;
            if (agencySearch) agencySearch.value = agency.nombre;
            
            // Si hay campo de nombre de paciente, sugerir uno basado en la dirección
            if (patientName && referral.direccion) {
                patientName.value = `Paciente - ${referral.direccion}`;
            }
            
            // Verificar si los campos existen antes de asignar valores
            const addressField = document.getElementById('patient-address');
            if (addressField) addressField.value = referral.direccion || '';
            
            const zipField = document.getElementById('patient-zip');
            if (zipField) zipField.value = referral.zipCode || '';
            
            const notesField = document.getElementById('notes');
            if (notesField) notesField.value = referral.notas || '';
            
            // Marcar los servicios
            if (referral.servicios && Array.isArray(referral.servicios)) {
                referral.servicios.forEach(service => {
                    const checkbox = document.querySelector(`input[name="services"][value="${service}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }
            
            // Mostrar mensaje indicando que se está trabajando con un referido
            showReferralNotification(referral, agency);
        } catch (error) {
            console.error('Error al cargar datos del referido:', error);
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
        
        // Insertar notificación al principio del formulario
        if (patientForm) {
            const formContainer = patientForm.closest('.container') || patientForm.parentElement;
            formContainer.insertBefore(notification, formContainer.firstChild);
            
            // Evento para cerrar notificación
            notification.querySelector('.close-notification').addEventListener('click', () => {
                notification.remove();
            });
        }
    }
    // Función para cargar agencias
    function loadAgencies() {
        fetch('./json/agencias.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Guardar datos en variable global
                window.agenciesData = data;
                
                // Guardar en localStorage y mantener contadores
                if (!localStorage.getItem('agencias')) {
                    localStorage.setItem('agencias', JSON.stringify(data));
                } else {
                    // Actualizar datos manteniendo los contadores existentes
                    const storedAgencies = JSON.parse(localStorage.getItem('agencias'));
                    data.forEach(agency => {
                        const stored = storedAgencies.find(a => a.id === agency.id);
                        if (stored) {
                            agency.referidos = stored.referidos || 0;
                            agency.pacientesActivos = stored.pacientesActivos || 0;
                        }
                    });
                    localStorage.setItem('agencias', JSON.stringify(data));
                }
                
                // Debug: Verificar datos cargados
                console.log("Agencias cargadas en Pacients.js:", data);
            })
            .catch(error => {
                console.error('Error cargando agencias:', error);
                if (agenciesList) {
                    agenciesList.innerHTML = '<p class="no-results">Error al cargar agencias: ' + error.message + '</p>';
                    agenciesList.style.display = 'block';
                }
            });
    }
    // Función para mostrar agencias en la lista
    function displayAgencies(searchTerm = '') {
        if (!agenciesList) return;
        
        agenciesList.innerHTML = '';
        agenciesList.style.display = 'block';
        if (!searchTerm.trim()) {
            agenciesList.innerHTML = '<p class="no-results">Escribe para buscar agencias...</p>';
            return;
        }
        const agencies = window.agenciesData || JSON.parse(localStorage.getItem('agencias') || '[]');
        
        const filteredAgencies = agencies.filter(agency =>
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
            // Obtener lista actual
            let patients = JSON.parse(localStorage.getItem('pacientes') || '[]');
            
            // Crear nuevo ID
            const patientId = `PAC${Date.now()}`;
            
            // Asegurar que tengamos un nombre
            const patientName = patientData.name && patientData.name !== "undefined" ? 
                patientData.name : 
                `Paciente ${new Date().toLocaleDateString()}`;
            
            // Crear nuevo objeto de paciente
            const newPatient = {
                id: patientId,
                date: new Date().toLocaleDateString(),
                name: patientName,
                status: 'new',
                agenciaId: patientData.agencyId,
                referralId: patientData.referralId || "",
                therapists: {
                    PT: patientData.services.includes('PT') ? null : null,
                    PTA: patientData.services.includes('PTA') ? null : null,
                    OT: patientData.services.includes('OT') ? null : null,
                    COTA: patientData.services.includes('COTA') ? null : null,
                    ST: patientData.services.includes('ST') ? null : null,
                    STA: null
                },
                decline: '',
                evalDate: new Date().toLocaleDateString(),
                address: patientData.address,
                zipCode: patientData.zipCode,
                notes: patientData.notes,
                agency: patientData.agencyName
            };
            
            // Agregar a la lista
            patients.push(newPatient);
            localStorage.setItem('pacientes', JSON.stringify(patients));
            
            console.log("Paciente guardado:", newPatient);
            
            // Si viene de un referido, actualizar su estado
            if (patientData.referralId) {
                updateReferralStatus(patientData.referralId, patientId);
            }
            
            // Actualizar contador de agencia
            updateAgencyPatientCount(patientData.agencyId);
            
            return true;
        } catch (error) {
            console.error('Error al guardar paciente:', error);
            return false;
        }
    }
    // Actualizar estado del referido
    function updateReferralStatus(referralId, patientId) {
        try {
            const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
            const referralIndex = referrals.findIndex(r => r.id === referralId);
            
            if (referralIndex !== -1) {
                referrals[referralIndex].pacienteId = patientId;
                referrals[referralIndex].estado = "activo";
                localStorage.setItem('referrals', JSON.stringify(referrals));
                console.log("Referido actualizado:", referrals[referralIndex]);
            }
        } catch (error) {
            console.error('Error al actualizar referido:', error);
        }
    }
    // Actualizar contador de pacientes de la agencia
    function updateAgencyPatientCount(agencyId) {
        try {
            const agencies = JSON.parse(localStorage.getItem('agencias') || '[]');
            const agencyIndex = agencies.findIndex(a => a.id === agencyId);
            
            if (agencyIndex !== -1) {
                agencies[agencyIndex].pacientesActivos = (agencies[agencyIndex].pacientesActivos || 0) + 1;
                localStorage.setItem('agencias', JSON.stringify(agencies));
                console.log("Contador de agencia actualizado:", agencies[agencyIndex]);
            }
        } catch (error) {
            console.error('Error al actualizar contador de agencia:', error);
        }
    }
    // Event Listeners para el formulario
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
            const agencies = JSON.parse(localStorage.getItem('agencias') || '[]');
            const selectedAgency = agencies.find(a => a.id === selectedAgencyInput.value);
            
            if (!selectedAgency) {
                alert('Agencia no encontrada');
                return;
            }
            
            // Recopilar datos
            const patientData = {
                name: patientName && patientName.value ? patientName.value : `Paciente ${new Date().toLocaleDateString()}`,
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
                
                // Redirigir o actualizar tabla
                if (tableBody) {
                    // Si estamos en la página de lista, actualizar
                    loadPatientsData();
                } else {
                    // Redirigir
                    window.location.href = 'Pacients.html';
                }
            } else {
                alert('Error al registrar el paciente');
            }
        });
    }
    // Event listeners para el buscador de agencias
    if (agencySearch) {
        agencySearch.addEventListener('focus', () => {
            if (!window.agenciesData) {
                loadAgencies();
            }
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
    // Función para cargar datos de pacientes
    function loadPatientsData() {
        if (!tableBody) return;
        
        const patients = JSON.parse(localStorage.getItem('pacientes') || '[]');
        console.log("Cargando pacientes en tabla:", patients);
        
        tableBody.innerHTML = '';
        
        patients.forEach(patient => {
            addPatientToTable(patient);
        });
    }
    // Función para añadir paciente a la tabla
    function addPatientToTable(patient) {
        if (!tableBody) return;
        
        const row = document.createElement('tr');
        row.classList.add(`row-${patient.status || 'new'}`);
        
        // Asegurar que tenemos un nombre
        const name = patient.name && patient.name !== "undefined" ? 
            patient.name : 
            `Paciente ${patient.id.substring(3)}`;
        
        // Crear celdas
        const cells = [
            createCell(patient.date, 'date-cell'),
            createCell(name),
            createTherapistCell('PT', patient.therapists?.PT),
            createTherapistCell('PTA', patient.therapists?.PTA),
            createTherapistCell('OT', patient.therapists?.OT),
            createTherapistCell('COTA', patient.therapists?.COTA),
            createTherapistCell('ST', patient.therapists?.ST),
            createTherapistCell('STA', patient.therapists?.STA),
            createCell(patient.decline || '-', 'decline-cell'),
            createCell(patient.evalDate || '-'),
            createCell(patient.address),
            createCell(patient.agency)
        ];
        
        // Añadir celdas a la fila
        cells.forEach(cell => {
            row.appendChild(cell);
        });
        
        tableBody.appendChild(row);
    }
    // Función para crear celda
    function createCell(text, className) {
        const cell = document.createElement('td');
        cell.textContent = text;
        if (className) cell.classList.add(className);
        return cell;
    }
    // Función para crear celda de terapeuta
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
            const select = createTherapistSelect(type);
            this.textContent = '';
            this.appendChild(select);
            select.focus();
        });
        
        return cell;
    }
    // Función para crear selector de terapeuta
    function createTherapistSelect(type) {
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
        if (therapists[type]) {
            therapists[type].forEach(therapist => {
                const option = document.createElement('option');
                option.value = therapist;
                option.textContent = therapist;
                select.appendChild(option);
            });
        }
        
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

    // Corregir pacientes existentes con nombres undefined
    function fixExistingPatients() {
        const patients = JSON.parse(localStorage.getItem('pacientes') || '[]');
        let modified = false;
        
        patients.forEach(patient => {
            if (!patient.name || patient.name === "undefined") {
                patient.name = `Paciente ${patient.id.substring(3)}`;
                modified = true;
            }
        });
        
        if (modified) {
            localStorage.setItem('pacientes', JSON.stringify(patients));
            console.log("Pacientes corregidos automáticamente");
        }
    }
    
    // Inicializar
    fixExistingPatients(); // Corregir pacientes existentes
    loadAgencies();
    if (agenciesList) agenciesList.style.display = 'none';
    if (tableBody) loadPatientsData();
});