// referrals.js
document.addEventListener('DOMContentLoaded', function() {
  console.log("referrals.js cargado");

  // Referencias al DOM
  const searchField = document.querySelector('input[placeholder*="agencia"]') || document.getElementById('agency-search');
  const form = document.getElementById('addReferralForm');
  const tbody = document.querySelector('#referralsTable tbody');
  let referrals = JSON.parse(localStorage.getItem('referrals') || '[]');

  // Verificar elementos
  if (!tbody) console.error('No se encontró #referralsTable tbody');
  if (!form) console.error('No se encontró #addReferralForm');
  if (!searchField) console.warn('No se encontró el campo de búsqueda de agencias');

  // Configurar buscador de agencias
  if (searchField) {
    console.log("Campo de búsqueda encontrado:", searchField);
    if (!searchField.id) searchField.id = 'agency-search';

    let agenciesList = document.getElementById('agencies-list');
    if (!agenciesList) {
      agenciesList = document.createElement('div');
      agenciesList.id = 'agencies-list';
      agenciesList.className = 'agencies-list';
      searchField.parentNode.insertBefore(agenciesList, searchField.nextSibling);
      console.log("Lista de agencias creada");
    }

    let hiddenField = document.getElementById('selected-agency');
    if (!hiddenField) {
      hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.id = 'selected-agency';
      hiddenField.name = 'selected-agency';
      searchField.parentNode.appendChild(hiddenField);
      console.log("Campo oculto creado");
    }

    // Cargar agencias desde localStorage o JSON
    let agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
    if (agencies.length === 0) {
      fetch('agencies.json') // Usa la ruta en la raíz
        .then(response => {
          if (!response.ok) throw new Error(`Error al cargar agencies.json: ${response.status} ${response.statusText}`);
          return response.json();
        })
        .then(data => {
          agencies = data;
          localStorage.setItem('agencies', JSON.stringify(agencies));
          console.log("Agencias cargadas desde JSON:", agencies.length);
          showAgenciesList(agencies, '');
        })
        .catch(error => {
          console.error('Error al cargar agencies.json:', error);
          // Usar datos de localStorage o array vacío como fallback
          agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
          console.log("Agencias cargadas desde localStorage o fallback:", agencies.length);
          showAgenciesList(agencies, '');
        });
    } else {
      console.log("Agencias cargadas desde localStorage:", agencies.length);
      showAgenciesList(agencies, '');
    }

    searchField.addEventListener('focus', () => showAgenciesList(agencies, searchField.value));
    searchField.addEventListener('input', () => showAgenciesList(agencies, searchField.value));
    document.addEventListener('click', (event) => {
      if (!searchField.contains(event.target) && !agenciesList.contains(event.target)) {
        agenciesList.style.display = 'none';
      }
    });
  }

  function showAgenciesList(agencias, searchTerm) {
    if (!agenciesList) return;
    agenciesList.innerHTML = '';
    agenciesList.style.display = 'block';

    const filtered = searchTerm.trim() ?
      agencias.filter(a => a.nombre.toLowerCase().includes(searchTerm.toLowerCase())) :
      agencias.slice(0, 10);

    if (filtered.length === 0) {
      agenciesList.innerHTML = '<div class="agency-item">No se encontraron agencias</div>';
      return;
    }

    filtered.forEach(agency => {
      const item = document.createElement('div');
      item.className = 'agency-item';
      item.textContent = agency.nombre;
      item.addEventListener('click', () => {
        searchField.value = agency.nombre;
        hiddenField.value = agency.id;
        agenciesList.style.display = 'none';
        console.log("Agencia seleccionada:", { nombre: agency.nombre, id: agency.id });
      });
      agenciesList.appendChild(item);
    });
  }

  function loadReferrals() {
    if (!tbody) return;
    tbody.innerHTML = '';
    const agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
    referrals.forEach(ref => {
      const agency = agencies.find(a => a.id === ref.agencyId);
      tbody.innerHTML += `
        <tr>
          <td>${ref.name}</td>
          <td>${agency ? agency.nombre : ref.agencyId}</td>
          <td><button class="btn btn-sm btn-primary">View</button></td>
        </tr>`;
    });
    console.log("Referidos cargados:", referrals.length);
  }

  function addReferral(event) {
    event.preventDefault();
    console.log("Evento submit disparado");

    const referralName = document.getElementById('referralName');
    const referralAgencyId = document.getElementById('selected-agency');
    const modal = document.getElementById('addReferralModal');

    if (!referralName || !referralAgencyId) {
      console.error("Elementos no encontrados:", { referralName: !!referralName, referralAgencyId: !!referralAgencyId });
      alert('Error: No se encontraron los campos necesarios');
      return;
    }

    const nameValue = referralName.value.trim();
    const agencyIdValue = referralAgencyId.value.trim();

    if (!nameValue || !agencyIdValue) {
      console.warn("Campos incompletos:", { name: nameValue, agencyId: agencyIdValue });
      alert('Por favor, completa todos los campos');
      return;
    }

    console.log("Datos capturados:", { name: nameValue, agencyId: agencyIdValue });

    // Agregar referido
    const newReferral = {
      id: `REF${Date.now()}`,
      name: nameValue,
      agencyId: agencyIdValue
    };
    referrals.push(newReferral);
    localStorage.setItem('referrals', JSON.stringify(referrals));
    console.log("Referido guardado en localStorage:", newReferral);

    // Agregar paciente
    let patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const [nombre, apellido] = nameValue.split(' ');
    const newPatient = {
      id: `PAT${Date.now()}`,
      name: nameValue,
      nombre,
      apellido: apellido || '',
      edad: null,
      agencyId: agencyIdValue,
      date: new Date().toLocaleDateString(),
      status: 'new',
      agency: (JSON.parse(localStorage.getItem('agencies')) || []).find(a => a.id === agencyIdValue)?.nombre || ''
    };
    patients.push(newPatient);
    localStorage.setItem('patients', JSON.stringify(patients));
    console.log("Paciente guardado en localStorage:", newPatient);

    // Actualizar agencia
    let storedAgencies = JSON.parse(localStorage.getItem('agencies') || '[]');
    const agency = storedAgencies.find(a => a.id === agencyIdValue);
    if (agency) {
      agency.pacientesActivos = (agency.pacientesActivos || 0) + 1;
      agency.referidos = (agency.referidos || 0) + 1;
      localStorage.setItem('agencies', JSON.stringify(storedAgencies));
      console.log("Agencia actualizada:", agency);
    } else {
      console.error("Agencia no encontrada:", agencyIdValue);
    }

    // Cerrar modal y limpiar formulario
    if (modal) {
      const bootstrapModal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      bootstrapModal.hide();
      console.log("Modal cerrado");
    } else {
      console.error("No se encontró #addReferralModal");
    }

    if (form) {
      form.reset();
      referralName.value = '';
      referralAgencyId.value = '';
      if (searchField) searchField.value = '';
      console.log("Formulario limpiado");
    } else {
      console.error("Formulario no encontrado para limpiar");
    }

    loadReferrals();
  }

  if (form) form.addEventListener('submit', addReferral);
  loadReferrals();
});