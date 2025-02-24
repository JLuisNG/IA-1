// agencias.js
document.addEventListener('DOMContentLoaded', function() {
    console.log("agencias.js cargado");
    let agenciasList = []; // Inicializa como un array vacío por defecto
    let totalPatientsCounter = 6467; // Mantén este valor si es necesario para tu diseño
    let currentEditIndex = -1;
    let currentDeleteIndex = -1;
  
    function generateRandomPhone() {
      const prefix = Math.floor(Math.random() * 900) + 100;
      const line = Math.floor(Math.random() * 9000) + 1000;
      return `(213) ${prefix}-${line}`;
    }
  
    function generateEmail(name) {
      const cleanName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
      return `contact@${cleanName}.com`;
    }
  
    function previewLogo(inputId, previewId) {
      const input = document.getElementById(inputId);
      const preview = document.getElementById(previewId);
      const file = input.files[0];
      const img = preview.querySelector('img');
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  
    function validateForm(formId) {
      const form = document.getElementById(formId);
      let isValid = true;
      const inputs = form.querySelectorAll('input[required]');
      inputs.forEach(input => {
        const group = input.closest('.form__group');
        if (!input.value.trim()) {
          group.classList.add('invalid');
          isValid = false;
        } else {
          group.classList.remove('invalid');
        }
      });
      return isValid;
    }
  
    function loadagencias() {
      fetch('agencias.json') // Usa la ruta en la raíz
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error al cargar agencias.json: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          agenciasList = data.map(agency => ({
            id: agency.id,
            name: agency.nombre,
            patients: agency.pacientesActivos || 0,
            referidos: agency.referidos || 0,
            address: agency.contacto.direccion || 'Los Angeles, California',
            phone: agency.contacto.telefono || generateRandomPhone(),
            email: agency.contacto.email || generateEmail(agency.nombre),
            status: 'Activo',
            docs: 'No',
            logo: '/api/placeholder/64/64' // Asegúrate de que esta URL sea válida o usa un placeholder real
          }));
          localStorage.setItem('agencias', JSON.stringify(agenciasList));
          console.log("Agencias cargadas desde JSON:", agenciasList.length);
          renderagencias();
          updateTotalPatientsCounter();
        })
        .catch(error => {
          console.error('Error loading agencias:', error);
          // Usar datos de localStorage o un array vacío como fallback
          const savedagencias = JSON.parse(localStorage.getItem('agencias') || '[]');
          if (savedagencias.length > 0) {
            agenciasList = savedagencias;
            console.log("Agencias cargadas desde localStorage:", agenciasList.length);
          } else {
            agenciasList = []; // Fallback si no hay datos
            console.warn("No se pudieron cargar agencias, usando lista vacía como fallback");
          }
          renderagencias();
          updateTotalPatientsCounter();
        });
    }
  
    function saveagencias() {
      const simplifiedagencias = agenciasList.map(agency => ({
        id: agency.id,
        nombre: agency.name,
        referidos: agency.referidos || 0,
        pacientesActivos: agency.patients,
        contacto: {
          telefono: agency.phone,
          email: agency.email,
          direccion: agency.address
        }
      }));
      localStorage.setItem('agencias', JSON.stringify(simplifiedagencias));
      console.log("Agencias guardadas en localStorage:", simplifiedagencias.length);
      updateTotalPatientsCounter();
    }
  
    function renderagencias() {
      const agenciasGrid = document.getElementById('agenciasGrid');
      if (!agenciasGrid) {
        console.error('No se encontró #agenciasGrid');
        return;
      }
      agenciasGrid.innerHTML = '';
  
      const sortedagencias = agenciasList.sort((a, b) => a.name.localeCompare(b.name));
      sortedagencias.forEach((agency, index) => {
        const card = document.createElement('div');
        card.className = 'agency-card';
        card.innerHTML = `
          <div class="agency-card__header">
            <div class="agency-logo">
              <img src="${agency.logo}" alt="${agency.name} Logo">
            </div>
            <h3 class="agency-card__name">${agency.name}</h3>
            <div class="agency-card__actions">
              <button class="edit-btn" onclick="editAgency(${index})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-btn" onclick="prepareDeleteAgency(${index})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="agency-card__content">
            <div class="agency-contact-info">
              <p class="agency-address">
                <i class="fas fa-map-marker-alt"></i>
                <span>${agency.address}</span>
              </p>
              <p class="agency-phone">
                <i class="fas fa-phone"></i>
                <span>${agency.phone}</span>
              </p>
              <p class="agency-email">
                <i class="fas fa-envelope"></i>
                <span>${agency.email}</span>
              </p>
            </div>
            <div class="agency-patient-counter">
              <span class="counter-number">${agency.patients}</span>
              <span class="counter-label">Pacientes de esta Agencia</span>
            </div>
            <div class="agency-referrals-counter">
              <span class="counter-number">${agency.referidos}</span>
              <span class="counter-label">Referidos de esta Agencia</span>
            </div>
            <div class="agency-status-docs">
              <p><strong>Estado:</strong> ${agency.status}</p>
              <p><strong>Documentos:</strong> ${agency.docs}</p>
            </div>
          </div>
        `;
        agenciasGrid.appendChild(card);
      });
      setupSearch();
    }
  
    function setupSearch() {
      const searchInput = document.querySelector('.search-input');
      if (!searchInput) {
        console.error('No se encontró .search-input');
        return;
      }
      searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const agenciasGrid = document.getElementById('agenciasGrid');
        const cards = agenciasGrid.getElementsByClassName('agency-card');
        Array.from(cards).forEach(card => {
          const agencyName = card.querySelector('.agency-card__name').textContent.toLowerCase();
          card.style.display = agencyName.includes(searchTerm) ? '' : 'none';
        });
      });
    }
  
    function updateTotalPatientsCounter() {
      const totalPatientsCounter = document.getElementById('totalPatientsCounter');
      if (totalPatientsCounter) {
        const total = agenciasList.reduce((sum, agency) => sum + agency.patients, 0);
        totalPatientsCounter.textContent = total.toLocaleString(); // Formato con separadores de miles
      } else {
        console.error('No se encontró #totalPatientsCounter');
      }
    }
  
    function openNewAgencyModal() {
      const newName = document.getElementById('newName');
      const newEmail = document.getElementById('newEmail');
      const newAddress = document.getElementById('newAddress');
      const newPhone = document.getElementById('newPhone');
      const newStatus = document.getElementById('newStatus');
      const newDocs = document.getElementById('newDocs');
      const newLogoImg = document.getElementById('newLogoImg');
      const newAgencyModal = document.getElementById('newAgencyModal');
  
      if (!newName || !newEmail || !newAddress || !newPhone || !newStatus || !newDocs || !newLogoImg || !newAgencyModal) {
        console.error('Elementos del modal no encontrados');
        return;
      }
  
      newName.value = '';
      newEmail.value = '';
      newAddress.value = 'Los Angeles, California';
      newPhone.value = '';
      newStatus.value = 'Activo';
      newDocs.value = 'No';
      newLogoImg.src = '/api/placeholder/64/64';
      newAgencyModal.classList.add('active');
    }
  
    function createNewAgency() {
      if (!validateForm('newAgencyForm')) return;
      const name = document.getElementById('newName').value.trim();
      const email = document.getElementById('newEmail').value.trim();
      const address = document.getElementById('newAddress').value.trim() || 'Los Angeles, California';
      const phone = document.getElementById('newPhone').value.trim() || generateRandomPhone();
      const status = document.getElementById('newStatus').value.trim() || 'Activo';
      const docs = document.getElementById('newDocs').value.trim() || 'No';
      const logoInput = document.getElementById('newLogo');
      let logo = '/api/placeholder/64/64';
      if (logoInput && logoInput.files && logoInput.files[0]) {
        logo = URL.createObjectURL(logoInput.files[0]);
      }
  
      const newAgency = {
        id: `AG${String(agenciasList.length + 1).padStart(3, '0')}`,
        name,
        patients: 0,
        referidos: 0,
        address,
        phone,
        email,
        status,
        docs,
        logo
      };
      agenciasList.push(newAgency);
      saveagencias();
      renderagencias();
      closeModal('newAgencyModal');
    }
  
    function editAgency(index) {
      currentEditIndex = index;
      const agency = agenciasList[index];
      const editName = document.getElementById('editName');
      const editEmail = document.getElementById('editEmail');
      const editAddress = document.getElementById('editAddress');
      const editPhone = document.getElementById('editPhone');
      const editStatus = document.getElementById('editStatus');
      const editDocs = document.getElementById('editDocs');
      const editLogoImg = document.getElementById('editLogoImg');
      const editModal = document.getElementById('editModal');
  
      if (!editName || !editEmail || !editAddress || !editPhone || !editStatus || !editDocs || !editLogoImg || !editModal) {
        console.error('Elementos del modal de edición no encontrados');
        return;
      }
  
      editName.value = agency.name;
      editEmail.value = agency.email;
      editAddress.value = agency.address;
      editPhone.value = agency.phone;
      editStatus.value = agency.status;
      editDocs.value = agency.docs;
      editLogoImg.src = agency.logo;
      editModal.classList.add('active');
    }
  
    function saveAgencyChanges() {
      if (!validateForm('editAgencyForm')) return;
      if (currentEditIndex !== -1) {
        const name = document.getElementById('editName').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const address = document.getElementById('editAddress').value.trim() || 'Los Angeles, California';
        const phone = document.getElementById('editPhone').value.trim() || generateRandomPhone();
        const status = document.getElementById('editStatus').value.trim() || 'Activo';
        const docs = document.getElementById('editDocs').value.trim() || 'No';
        const logoInput = document.getElementById('editLogo');
        let logo = agenciasList[currentEditIndex].logo;
        if (logoInput && logoInput.files && logoInput.files[0]) {
          logo = URL.createObjectURL(logoInput.files[0]);
        }
  
        agenciasList[currentEditIndex] = {
          ...agenciasList[currentEditIndex],
          name,
          email,
          address,
          phone,
          status,
          docs,
          logo
        };
        saveagencias();
        renderagencias();
        closeModal('editModal');
        currentEditIndex = -1;
      }
    }
  
    function prepareDeleteAgency(index) {
      currentDeleteIndex = index;
      const deleteModal = document.getElementById('deleteModal');
      if (!deleteModal) {
        console.error('No se encontró #deleteModal');
        return;
      }
      deleteModal.classList.add('active');
    }
  
    function confirmDeleteAgency() {
      if (currentDeleteIndex !== -1) {
        agenciasList.splice(currentDeleteIndex, 1);
        saveagencias();
        renderagencias();
        closeModal('deleteModal');
        currentDeleteIndex = -1;
      }
    }
  
    function closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) {
        console.error(`Modal ${modalId} no encontrado`);
        return;
      }
      modal.classList.remove('active');
      const logoInput = document.getElementById(modalId === 'newAgencyModal' ? 'newLogo' : 'editLogo');
      if (logoInput) logoInput.value = '';
    }
  
    // Exponer funciones globalmente
    window.openNewAgencyModal = openNewAgencyModal;
    window.createNewAgency = createNewAgency;
    window.editAgency = editAgency;
    window.saveAgencyChanges = saveAgencyChanges;
    window.prepareDeleteAgency = prepareDeleteAgency;
    window.confirmDeleteAgency = confirmDeleteAgency;
    window.closeModal = closeModal;
    window.previewLogo = previewLogo;
  
    // Cargar agencias al iniciar
    loadagencias();
  });