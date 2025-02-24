// Referrals.js

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const patientForm = document.getElementById('patient-form');
    const agencySearch = document.getElementById('agency-search');
    const agenciesList = document.getElementById('agencies-list');
    const selectedAgencyInput = document.getElementById('selected-agency');
    const tableBody = document.getElementById('referrals-table-body');
    const searchInput = document.querySelector('.search-input');
    const filterBtn = document.getElementById('filter-btn');
    const exportBtn = document.getElementById('export-btn');

    // Imprimir elementos disponibles para depuración
    console.log("Elementos disponibles en Referrals.js:", {
        patientForm: !!patientForm,
        agencySearch: !!agencySearch,
        agenciesList: !!agenciesList,
        selectedAgencyInput: !!selectedAgencyInput,
        tableBody: !!tableBody,
        searchInput: !!searchInput
    });

    // Variable para almacenar datos de agencias
    let agenciesData = [];

    // Función para cargar las agencias
    async function loadAgencies() {
        try {
            const response = await fetch('./json/agencias.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            agenciesData = data;
            
            console.log("Agencias cargadas:", data);
            
            // Actualizar localStorage
            if (!localStorage.getItem('agencias')) {
                localStorage.setItem('agencias', JSON.stringify(data));
            } else {
                // Mantener contadores existentes
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
            
            // Si estamos en la página de filtrado, llenar el selector de agencias
            const filterAgencySelect = document.getElementById('filter-agency');
            if (filterAgencySelect) {
                filterAgencySelect.innerHTML = '<option value="">Todas las agencias</option>';
                data.forEach(agency => {
                    const option = document.createElement('option');
                    option.value = agency.nombre;
                    option.textContent = agency.nombre;
                    filterAgencySelect.appendChild(option);
                });
            }
            
            // Si estamos en la página con formulario, mostrar agencias
            if (agencySearch && agenciesList) {
                displayAgencies(agencySearch.value);
            }
            
        } catch (error) {
            console.error('Error cargando agencias:', error);
        }
    }

    // Función para mostrar agencias filtradas
    function displayAgencies(searchTerm = '') {
        if (!agenciesList) return;
        
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
            agencyElement.dataset.id = agency.id;
            agencyElement.dataset.nombre = agency.nombre;

            agencyElement.addEventListener('click', () => selectAgency(agency));
            
            agenciesList.appendChild(agencyElement);
        });
    }

    // Función para seleccionar una agencia
    function selectAgency(agency) {
        if (!selectedAgencyInput || !agencySearch) return;
        
        selectedAgencyInput.value = agency.id;
        agencySearch.value = agency.nombre;
        agenciesList.style.display = 'none';
    }

    // Función para guardar un nuevo referido
    function saveReferral(referralData) {
        try {
            // Asegurarnos de tener un array de referidos
            const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
            
            // Crear nuevo ID único
            const referralId = `REF${Date.now()}`;
            
            // Crear el nuevo objeto de referido
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
            
            // Añadir a la lista y guardar
            referrals.push(newReferral);
            localStorage.setItem('referrals', JSON.stringify(referrals));
            
            console.log("Referido guardado:", newReferral);
            
            // Actualizar contador de agencia
            const agencies = JSON.parse(localStorage.getItem('agencias') || '[]');
            const agencyIndex = agencies.findIndex(a => a.id === referralData.agencyId);
            
            if (agencyIndex !== -1) {
                agencies[agencyIndex].referidos = (agencies[agencyIndex].referidos || 0) + 1;
                localStorage.setItem('agencias', JSON.stringify(agencies));
                console.log("Contador de agencia actualizado:", agencies[agencyIndex]);
            }
            
            // Redirigir a la página de pacientes
            window.location.href = `Pacients.html?referralId=${referralId}`;
            return true;
        } catch (error) {
            console.error('Error al guardar referido:', error);
            return false;
        }
    }

    // Función para cargar referidos en la tabla
    function loadReferralsToTable() {
        if (!tableBody) return;
        
        const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
        const patients = JSON.parse(localStorage.getItem('pacientes') || '[]');
        
        console.log("Cargando referidos en tabla:", referrals);
        console.log("Pacientes disponibles:", patients);
        
        // Limpiar tabla
        tableBody.innerHTML = '';
        
        if (patients.length === 0 && referrals.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="12" style="text-align: center; padding: 20px;">
                    No hay pacientes o referidos para mostrar
                </td>
            `;
            tableBody.appendChild(emptyRow);
            return;
        }
        
        // Añadir pacientes a la tabla
        patients.forEach(patient => {
            addPatientToTable(patient);
        });
        
        // Añadir referidos que no tienen paciente asociado
        referrals.filter(ref => !ref.pacienteId).forEach(referral => {
            addReferralToTable(referral);
        });
    }

    // Función para añadir paciente a la tabla
    function addPatientToTable(patient) {
        if (!tableBody) return;
        
        const row = document.createElement('tr');
        row.classList.add(`row-${patient.status || 'new'}`);
        
        // Obtener nombre de agencia
        const agencies = JSON.parse(localStorage.getItem('agencias') || '[]');
        const agencyName = patient.agency || agencies.find(a => a.id === patient.agenciaId)?.nombre || '';
        
        row.innerHTML = `
            <td>${patient.date}</td>
            <td>${patient.name}</td>
            <td class="therapist-cell ${patient.therapists?.PT ? 'state-accepted' : 'state-unassigned'}">${patient.therapists?.PT || ''}</td>
            <td class="therapist-cell ${patient.therapists?.PTA ? 'state-accepted' : 'state-unassigned'}">${patient.therapists?.PTA || ''}</td>
            <td class="therapist-cell ${patient.therapists?.OT ? 'state-accepted' : 'state-unassigned'}">${patient.therapists?.OT || ''}</td>
            <td class="therapist-cell ${patient.therapists?.COTA ? 'state-accepted' : 'state-unassigned'}">${patient.therapists?.COTA || ''}</td>
            <td class="therapist-cell ${patient.therapists?.ST ? 'state-accepted' : 'state-unassigned'}">${patient.therapists?.ST || ''}</td>
            <td class="therapist-cell ${patient.therapists?.STA ? 'state-accepted' : 'state-unassigned'}">${patient.therapists?.STA || ''}</td>
            <td>${patient.decline || '-'}</td>
            <td>${patient.evalDate || '-'}</td>
            <td>${patient.address}</td>
            <td>${agencyName}</td>
        `;
        
        tableBody.appendChild(row);
    }

    // Función para añadir referido a la tabla
    function addReferralToTable(referral) {
        if (!tableBody) return;
        
        const row = document.createElement('tr');
        row.classList.add('row-pending');
        
        // Obtener nombre de agencia
        const agencies = JSON.parse(localStorage.getItem('agencias') || '[]');
        const agencyName = agencies.find(a => a.id === referral.agenciaId)?.nombre || '';
        
        row.innerHTML = `
            <td>${referral.fecha}</td>
            <td>[Referido pendiente]</td>
            <td class="therapist-cell state-unassigned"></td>
            <td class="therapist-cell state-unassigned"></td>
            <td class="therapist-cell state-unassigned"></td>
            <td class="therapist-cell state-unassigned"></td>
            <td class="therapist-cell state-unassigned"></td>
            <td class="therapist-cell state-unassigned"></td>
            <td>-</td>
            <td>-</td>
            <td>${referral.direccion || '-'}</td>
            <td>${agencyName}</td>
        `;
        
        tableBody.appendChild(row);
    }

    // Manejar envío del formulario
    if (patientForm) {
        patientForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validar campos
            const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
                .map(checkbox => checkbox.value);
                
            if (selectedServices.length === 0) {
                alert('Por favor, selecciona al menos un servicio');
                return;
            }
            
            if (!selectedAgencyInput || !selectedAgencyInput.value) {
                alert('Por favor, selecciona una agencia');
                return;
            }
            
            // Recopilar datos
            const referralData = {
                agencyId: selectedAgencyInput.value,
                services: selectedServices,
                address: document.getElementById('patient-address')?.value || "",
                zipCode: document.getElementById('patient-zip')?.value || "",
                notes: document.getElementById('notes')?.value || ""
            };
            
            console.log("Datos del referido a guardar:", referralData);
            
            // Guardar referido
            if (saveReferral(referralData)) {
                alert('Referido registrado exitosamente');
                patientForm.reset();
                if (selectedAgencyInput) selectedAgencyInput.value = '';
                if (agencySearch) agencySearch.value = '';
                if (agenciesList) agenciesList.style.display = 'none';
            } else {
                alert('Error al registrar el referido');
            }
        });
    }

    // Event listeners para agencySearch
    if (agencySearch) {
        agencySearch.addEventListener('focus', () => {
            if (!agenciesData.length) {
                loadAgencies();
            } else {
                displayAgencies(agencySearch.value);
            }
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

    // Event listener para búsqueda en tabla
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            if (!tableBody) return;
            
            const searchTerm = searchInput.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Evento para el botón de filtro
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            const filterModal = document.getElementById('filter-modal');
            if (filterModal) {
                filterModal.style.display = 'block';
            }
        });
    }

    // Evento para cerrar el modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            const filterModal = document.getElementById('filter-modal');
            if (filterModal) {
                filterModal.style.display = 'none';
            }
        });
    }

    // Evento para aplicar filtros
    const applyFilters = document.getElementById('apply-filters');
    if (applyFilters) {
        applyFilters.addEventListener('click', () => {
            const dateFrom = document.getElementById('filter-date-from')?.value;
            const dateTo = document.getElementById('filter-date-to')?.value;
            const agency = document.getElementById('filter-agency')?.value;
            
            // Aplicar filtros a las filas de la tabla
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                let show = true;
                const cells = row.querySelectorAll('td');
                
                if (dateFrom && cells[0]) {
                    const rowDate = new Date(cells[0].textContent);
                    const fromDate = new Date(dateFrom);
                    if (rowDate < fromDate) show = false;
                }
                
                if (dateTo && cells[0] && show) {
                    const rowDate = new Date(cells[0].textContent);
                    const toDate = new Date(dateTo);
                    if (rowDate > toDate) show = false;
                }
                
                if (agency && cells[11] && show) {
                    if (!cells[11].textContent.trim().toLowerCase().includes(agency.toLowerCase())) {
                        show = false;
                    }
                }
                
                row.style.display = show ? '' : 'none';
            });
            
            // Cerrar modal
            const filterModal = document.getElementById('filter-modal');
            if (filterModal) {
                filterModal.style.display = 'none';
            }
        });
    }

    // Evento para limpiar filtros
    const clearFilters = document.getElementById('clear-filters');
    if (clearFilters) {
        clearFilters.addEventListener('click', () => {
            // Limpiar campos de filtro
            if (document.getElementById('filter-date-from')) document.getElementById('filter-date-from').value = '';
            if (document.getElementById('filter-date-to')) document.getElementById('filter-date-to').value = '';
            if (document.getElementById('filter-agency')) document.getElementById('filter-agency').value = '';
            
            // Mostrar todas las filas
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                row.style.display = '';
            });
            
            // Cerrar modal
            const filterModal = document.getElementById('filter-modal');
            if (filterModal) {
                filterModal.style.display = 'none';
            }
        });
    }

    // Evento para exportar
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            // Obtener datos visibles de la tabla
            const rows = Array.from(tableBody.querySelectorAll('tr')).filter(row => 
                row.style.display !== 'none'
            );
            
            // Crear contenido CSV
            let csvContent = "data:text/csv;charset=utf-8,";
            
            // Encabezados
            const headers = [
                "Date", "Patient's name", "PT", "PTA", "OT", "COTA", "ST", "STA", 
                "Decline", "DATE OF EVAL", "Address", "Agency"
            ];
            
            csvContent += headers.join(",") + "\r\n";
            
            // Datos de filas
            rows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                const rowData = cells.map(cell => {
                    let text = cell.textContent.trim();
                    // Escapar comillas y proteger campos con comas
                    text = text.replace(/"/g, '""');
                    if (text.includes(',')) {
                        text = `"${text}"`;
                    }
                    return text;
                });
                
                csvContent += rowData.join(",") + "\r\n";
            });
            
            // Descargar CSV
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'referrals_export.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Cargar datos iniciales
    loadAgencies();
    if (tableBody) {
        loadReferralsToTable();
    }
});