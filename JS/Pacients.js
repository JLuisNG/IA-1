// patients.js
document.addEventListener('DOMContentLoaded', function() {
  const patientForm = document.getElementById('patient-form');
  const patientName = document.getElementById('patient-name');
  const agencySearch = document.getElementById('agency-search');
  const agenciesList = document.getElementById('agencies-list');
  const selectedAgencyInput = document.getElementById('selected-agency');
  const tableBody = document.querySelector('.patients-table tbody');
  let patients = JSON.parse(localStorage.getItem('patients') || '[]');

  console.log("Elementos disponibles en patients.js:", {
    patientForm: !!patientForm,
    patientName: !!patientName,
    agencySearch: !!agencySearch,
    agenciesList: !!agenciesList,
    selectedAgencyInput: !!selectedAgencyInput,
    tableBody: !!tableBody
  });

  const params = new URLSearchParams(window.location.search);
  const referralId = params.get('referralId');
  console.log("Referido ID recibido:", referralId);

  if (referralId) {
    loadReferralData(referralId);
  }

  loadAgencies();
  if (tableBody) loadPatientsData();
  if (agenciesList) agenciesList.style.display = 'none';

  function loadReferralData(refId) {
    try {
      const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
      const referral = referrals.find(r => r.id === refId);
      if (!referral) {
        console.error('Referido no encontrado:', refId);
        return;
      }
      console.log("Referido encontrado:", referral);

      const agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
      const agency = agencies.find(a => a.id === referral.agencyId);
      if (!agency) {
        console.error('Agencia no encontrada:', referral.agencyId);
        return;
      }
      console.log("Agencia encontrada:", agency);

      if (selectedAgencyInput) selectedAgencyInput.value = referral.agencyId;
      if (agencySearch) agencySearch.value = agency.nombre;
      if (patientName) patientName.value = referral.name || `Paciente - ${agency.nombre} - ${new Date().toLocaleDateString()}`;
      showReferralNotification(referral, agency);
    } catch (error) {
      console.error('Error al cargar datos del referido:', error);
    }
  }

  function showReferralNotification(referral, agency) {
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
    if (patientForm) {
      const formContainer = patientForm.closest('.container') || patientForm.parentElement;
      formContainer.insertBefore(notification, formContainer.firstChild);
      notification.querySelector('.close-notification').addEventListener('click', () => notification.remove());
    }
  }

  function loadAgencies() {
    fetch('agencies.json') // Usa la ruta en la raíz
      .then(response => {
        if (!response.ok) throw new Error(`Error al cargar agencies.json: ${response.status} ${response.statusText}`);
        return response.json();
      })
      .then(data => {
        let storedAgencies = JSON.parse(localStorage.getItem('agencies') || '[]');
        if (storedAgencies.length === 0) {
          localStorage.setItem('agencies', JSON.stringify(data));
        } else {
          data.forEach(agency => {
            const stored = storedAgencies.find(a => a.id === agency.id);
            if (stored) {
              agency.referidos = stored.referidos || 0;
              agency.pacientesActivos = stored.pacientesActivos || 0;
            }
          });
          localStorage.setItem('agencies', JSON.stringify(data));
        }
        console.log("Agencias cargadas en patients.js:", data);
      })
      .catch(error => {
        console.error('Error cargando agencias:', error);
        // Usar datos de localStorage o array vacío como fallback
        const savedAgencies = JSON.parse(localStorage.getItem('agencies') || '[]');
        if (savedAgencies.length > 0) {
          console.log("Agencias cargadas desde localStorage:", savedAgencies.length);
        } else {
          console.warn("No se pudieron cargar agencias, usando lista vacía como fallback");
        }
      });
  }

  function displayAgencies(searchTerm = '') {
    if (!agenciesList) return;
    agenciesList.innerHTML = '';
    agenciesList.style.display = 'block';

    if (!searchTerm.trim()) {
      agenciesList.innerHTML = '<p class="no-results">Escribe para buscar agencias...</p>';
      return;
    }

    const agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
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

  function savePatient(patientData) {
    try {
      let patients = JSON.parse(localStorage.getItem('patients') || '[]');
      const patientId = `PAT${Date.now()}`;
      const newPatient = {
        id: patientId,
        date: new Date().toLocaleDateString(),
        name: patientData.name || `Paciente ${new Date().toLocaleDateString()}`,
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
        address: patientData.address || "",
        zipCode: patientData.zipCode || "",
        notes: patientData.notes || "",
        agency: patientData.agencyName || ""
      };
      patients.push(newPatient);
      localStorage.setItem('patients', JSON.stringify(patients));
      console.log("Paciente guardado:", newPatient);

      if (patientData.referralId) {
        updateReferralStatus(patientData.referralId, patientId);
      }
      updateAgencyPatientCount(patientData.agencyId);
      return true;
    } catch (error) {
      console.error('Error al guardar paciente:', error);
      return false;
    }
  }

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

  function updateAgencyPatientCount(agencyId) {
    try {
      const agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
      const agencyIndex = agencies.findIndex(a => a.id === agencyId);
      if (agencyIndex !== -1) {
        agencies[agencyIndex].pacientesActivos = (agencies[agencyIndex].pacientesActivos || 0) + 1;
        localStorage.setItem('agencies', JSON.stringify(agencies));
        console.log("Contador de agencia actualizado:", agencies[agencyIndex]);
      }
    } catch (error) {
      console.error('Error al actualizar contador de agencia:', error);
    }
  }

  if (patientForm) {
    patientForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log("Formulario enviado");

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

      const agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
      const selectedAgency = agencies.find(a => a.id === selectedAgencyInput.value);
      if (!selectedAgency) {
        alert('Agencia no encontrada');
        return;
      }

      const patientData = {
        name: patientName && patientName.value ? patientName.value : `Paciente ${new Date().toLocaleDateString()}`,
        agencyId: selectedAgencyInput.value,
        agencyName: selectedAgency.nombre,
        referralId: referralId,
        services: selectedServices,
        address: document.getElementById('patient-address')?.value || "",
        zipCode: document.getElementById('patient-zip')?.value || "",
        notes: document.getElementById('notes')?.value || ""
      };
      console.log("Datos del paciente a guardar:", patientData);

      if (savePatient(patientData)) {
        alert('Paciente registrado exitosamente');
        patientForm.reset();
        if (selectedAgencyInput) selectedAgencyInput.value = '';
        if (agencySearch) agencySearch.value = '';
        if (agenciesList) agenciesList.style.display = 'none';
        if (tableBody) {
          loadPatientsData();
        } else {
          window.location.href = 'patients.html';
        }
      } else {
        alert('Error al registrar el paciente');
      }
    });
  }

  if (agencySearch) {
    agencySearch.addEventListener('focus', () => displayAgencies(agencySearch.value));
    agencySearch.addEventListener('input', (e) => displayAgencies(e.target.value));
    agencySearch.addEventListener('blur', () => {
      setTimeout(() => {
        if (agenciesList && !agenciesList.contains(document.activeElement)) {
          agenciesList.style.display = 'none';
        }
      }, 200);
    });
  }

  function loadPatientsData() {
    if (!tableBody) return console.error('No se encontró .patients-table tbody');
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    console.log("Cargando pacientes en tabla:", patients.length);
    tableBody.innerHTML = '';
    patients.forEach(patient => addPatientToTable(patient));
  }

  function addPatientToTable(patient) {
    if (!tableBody) return;
    const row = document.createElement('tr');
    row.classList.add(`row-${patient.status || 'new'}`);
    const cells = [
      createCell(patient.date, 'date-cell'),
      createCell(patient.name || `${patient.nombre} ${patient.apellido}`),
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
    cells.forEach(cell => row.appendChild(cell));
    tableBody.appendChild(row);
  }

  function createCell(text, className) {
    const cell = document.createElement('td');
    cell.textContent = text;
    if (className) cell.classList.add(className);
    return cell;
  }

  function createTherapistCell(type, currentTherapist) {
    const cell = document.createElement('td');
    cell.classList.add('therapist-cell');
    if (currentTherapist) {
      cell.textContent = currentTherapist;
      cell.classList.add('state-accepted');
    } else {
      cell.classList.add('state-unassigned');
    }
    cell.addEventListener('dblclick', function() {
      const select = createTherapistSelect(type);
      this.textContent = '';
      this.appendChild(select);
      select.focus();
    });
    return cell;
  }

  function createTherapistSelect(type) {
    const select = document.createElement('select');
    select.classList.add('therapist-state-select');
    const therapists = {
      PT: ['Alex', 'Peggy', 'James'],
      PTA: ['Tanya', 'Oswaldo'],
      OT: ['Betty', 'Rosalind', 'Gordon'],
      COTA: ['Shari', 'April Kim', 'Ed'],
      ST: ['Arya', 'James Steven'],
      STA: ['Vincent', 'Wilma']
    };
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Seleccionar';
    select.appendChild(defaultOption);
    if (therapists[type]) {
      therapists[type].forEach(therapist => {
        const option = document.createElement('option');
        option.value = therapist;
        option.textContent = therapist;
        select.appendChild(option);
      });
    }
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
});