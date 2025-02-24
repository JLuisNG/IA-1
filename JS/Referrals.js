// referrals.js
document.addEventListener('DOMContentLoaded', function() {
    console.log("referrals.js cargado");
  
    // Buscar el campo de búsqueda y la lista
    const searchField = document.querySelector('input[placeholder*="agencia"], input[placeholder*="Agencia"]') || document.getElementById('agency-search');
    const form = document.getElementById('addReferralForm');
    let referrals = JSON.parse(localStorage.getItem('referrals')) || [];
  
    if (searchField) {
      console.log("Campo de búsqueda encontrado:", searchField);
      if (!searchField.id) searchField.id = 'agency-search';
  
      // Crear o encontrar la lista desplegable
      let agenciesList = document.getElementById('agencies-list');
      if (!agenciesList) {
        agenciesList = document.createElement('div');
        agenciesList.id = 'agencies-list';
        agenciesList.className = 'agencies-list';
        searchField.parentNode.insertBefore(agenciesList, searchField.nextSibling);
        console.log("Lista de agencias creada");
      }
  
      // Crear o encontrar el campo oculto
      let hiddenField = document.getElementById('selected-agency');
      if (!hiddenField) {
        hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.id = 'selected-agency';
        hiddenField.name = 'selected-agency';
        searchField.parentNode.appendChild(hiddenField);
        console.log("Campo oculto creado");
      }
  
      // Cargar agencias desde localStorage
      const agencies = JSON.parse(localStorage.getItem('agencies')) || [];
      console.log("Agencias cargadas:", agencies.length);
  
      // Evento para mostrar lista al enfocar
      searchField.addEventListener('focus', function() {
        showAgenciesList(agencies, searchField.value);
      });
  
      // Evento para filtrar mientras escribe
      searchField.addEventListener('input', function() {
        showAgenciesList(agencies, searchField.value);
      });
  
      // Función para mostrar la lista de agencias
      function showAgenciesList(agencias, searchTerm) {
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
  
          item.addEventListener('click', function() {
            searchField.value = agency.nombre;
            hiddenField.value = agency.id;
            agenciesList.style.display = 'none';
            console.log("Agencia seleccionada:", { nombre: agency.nombre, id: agency.id });
          });
  
          agenciesList.appendChild(item);
        });
      }
  
      // Ocultar la lista cuando se hace clic fuera
      document.addEventListener('click', function(event) {
        if (!searchField.contains(event.target) && !agenciesList.contains(event.target)) {
          agenciesList.style.display = 'none';
        }
      });
    } else {
      console.warn("No se encontró el campo de búsqueda de agencias");
    }
  
    // Cargar referidos
    loadReferrals();
  
    // Manejar el envío del formulario
    if (form) {
      console.log("Formulario encontrado:", form);
      form.addEventListener('submit', addReferral);
    } else {
      console.error("No se encontró el formulario #addReferralForm");
    }
  
    function loadReferrals() {
      const tbody = document.querySelector('#referralsTable tbody');
      if (!tbody) {
        console.error('No se encontró #referralsTable tbody');
        return;
      }
      tbody.innerHTML = '';
      const agencies = JSON.parse(localStorage.getItem('agencies')) || [];
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
      event.preventDefault(); // Evitar recarga de la página
      console.log("Evento submit disparado");
  
      const referralName = document.getElementById('referralName');
      const referralAgencyId = document.getElementById('selected-agency');
  
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
      let patients = JSON.parse(localStorage.getItem('patients')) || [];
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
        agency: agencies.find(a => a.id === agencyIdValue)?.nombre || ''
      };
      patients.push(newPatient);
      localStorage.setItem('patients', JSON.stringify(patients));
      console.log("Paciente guardado en localStorage:", newPatient);
  
      // Actualizar agencia
      let storedAgencies = JSON.parse(localStorage.getItem('agencies')) || [];
      const agency = storedAgencies.find(a => a.id === agencyIdValue);
      if (agency) {
        agency.pacientesActivos = (agency.pacientesActivos || 0) + 1;
        localStorage.setItem('agencies', JSON.stringify(storedAgencies));
        console.log("Agencia actualizada:", agency);
      } else {
        console.error("Agencia no encontrada:", agencyIdValue);
      }
  
      // Cerrar modal y limpiar formulario
      const modalElement = document.getElementById('addReferralModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
          console.log("Modal cerrado");
        } else {
          console.error("No se pudo instanciar el modal Bootstrap");
        }
      } else {
        console.error("No se encontró #addReferralModal");
      }
  
      form.reset();
      referralName.value = '';
      referralAgencyId.value = '';
      if (searchField) searchField.value = '';
      console.log("Formulario limpiado");
  
      loadReferrals();
    }
  });