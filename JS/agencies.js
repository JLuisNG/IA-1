// agencies.js
document.addEventListener('DOMContentLoaded', function() {
    let agenciesList = [];
    let totalPatientsCounter = 6467;
    let currentEditIndex = -1;
    let currentDeleteIndex = -1;
  
    const predefinedAgencies = [
      "24/7", "247hhs", "Able Hands", "Able Hands HH", "Access", "Access HH", "ACE HH", "Ace Home Health",
      "ADK HH", "Advent Cares", "Advent HH", "Agape HH", "Agapeheart HH", "Alaphia", "All American Choice",
      "All American Choise", "All Citizens HH", "All Linked", "All Linked HH", "Alliant HH", "Alpha HH",
      "Amax", "AMAX", "Ambient Hospice", "American Empire", "American N", "American Nursing", "Americare",
      "Americare HH", "Angelus HH", "ASOC", "Assistive Hospice", "Assistive Hospice And Palliative Care",
      "Axis", "Axis HH", "Azuria HH", "Azure", "Benevolent HH", "Benevolent HHA", "Best In Town HH",
      "Beverly Healing Home Care Inc", "Bright HH", "Bright Home Health", "Bright Horizons", "Care Sharing HH",
      "CAREPOINTE HH", "Caring Like Family HH", "Carson Healthcare", "Caritas HH", "Changing Lives", "CHCS",
      "Chelsea HH", "COHEN", "Comprehensive", "Continuity", "Core at Home", "Core PT", "Cosmopolitan",
      "curing hands HH", "Destiny", "DicniTonic HH", "DigniTonic", "Dignitonic", "Direct Care", "Direct Care HH",
      "Distinctive", "Distinctive HH", "Divine", "Divine Care HH", "Divine Pearl HH", "DSP", "DSP HH",
      "Easy Choice HH", "Ed & Ar Hospice", "Ed & Ar Hospice Care", "ELITE HEALTH CAREA", "Elite Health",
      "Elite HH", "Equanimity", "Equanimity HH", "Equan HH", "ER", "ER HH", "Excellence", "Family First Home",
      "Fast Doc HH", "Firts Choice HH", "First Choice HH", "Forever", "Forever C HH", "Forever Caring",
      "ForeverC HH", "ForeverCare", "Glendale HH", "Good Earth", "Good Remedy", "Guardian Angel HH", "H&R",
      "H & R HOME", "Hajimi HH", "Hand in Heart", "HandinHeart", "Handinhearth", "HandinHearth", "Happy HH",
      "Happy Life HH", "Hearten HH", "HH Plus", "Holy Angel", "Holy Infant", "Holy Infant HH", "Holy Infant HR",
      "Home Care Excellence", "Home Health Plus", "Home Rehabilitation", "Horizon HH", "Hygieia HH", "Impress",
      "Impress HH", "Inland", "Inland Empire", "Inland Empire HH", "Inglewood", "Inglewood HH", "Intake",
      "Integrated HH", "Intra care HH", "Ivory", "Ivory HH", "Ivory/Gifty", "Key to Health", "KeyTo HH",
      "KeyToHealth", "LA HH", "LA Home Care", "LA Home Health", "LA United home", "Legacy", "Legacy HH",
      "Level", "Level HH", "Level Home H", "Life & Hope", "Life & Hope HH", "LikeFamly HH", "Los Angeles HH",
      "Mayerling", "Mayerling HH", "Med Group", "Med Group HH", "Med Health", "MedGroup", "Medgroup",
      "Medz Hospice Care", "Merit", "Merit HH", "Milano HH", "MORNING STAR HHC", "Multiskilled", "Mulitskilled",
      "New Hope HH", "New Horizon", "New Horizon HH", "New Horizons", "Nurse's HH", "Nurses Resource", "Ogada",
      "Onoria Healthcare", "Orange Home Health", "Oremos", "Pacific", "Paramount", "Paramount HC",
      "Pegasus Home Health", "Prestigious", "Prestigious HH", "Prime Care", "Prime Care Health", "PrimeCare",
      "PrimeH", "PT/OT staffing", "Quantum HH", "Real Assurance", "Relief", "Relief Home Health", "Relyable Home",
      "Relyable Home Health", "Resolute HH", "Santa Rosa Hospice", "Sierra", "Sierra HH", "SierraHH",
      "Silver Lining HH", "Sima Corporate G.", "Skilled HH", "SNE", "SoCal Integrated", "SOCAL CARE",
      "Social Integrated", "SOCAL INTEGRATED", "SOCAL INTEGRATED CARE", "St. Lukes", "Starlight HH", "Sunnyland",
      "Sunset", "Sunset HH", "Sunshine", "Sunshine HH", "Sunshine HHS", "Supportive", "Supportive HH",
      "Supportive Hospice", "The Ambient H", "The Lakes HH", "thephcare", "THA HH", "Thrive", "Thrive HH",
      "Total Care", "Total Care HH", "Transitions HH", "United", "United HH", "United HHC", "United Home Health",
      "United Home Health Care", "Universal", "Valley United HH", "Vast", "Vast HH", "VAST HOME HEALTH",
      "Vip HealthCare", "West Coast HH", "Wilshire", "Wilshire HH"
    ];
  
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
  
    function loadAgencies() {
      fetch('../json/agencies.json')
        .then(response => response.json())
        .then(data => {
          const savedAgencies = JSON.parse(localStorage.getItem('agencies'));
          if (!savedAgencies) {
            agenciesList = data.map((agency, index) => ({
              id: agency.id,
              name: agency.nombre,
              patients: agency.pacientesActivos || 0,
              address: 'Los Angeles, California',
              phone: generateRandomPhone(),
              email: generateEmail(agency.nombre),
              status: 'Activo',
              docs: 'No',
              logo: '/api/placeholder/64/64'
            }));
            localStorage.setItem('agencies', JSON.stringify(data));
          } else {
            agenciesList = savedAgencies.map((saved, index) => {
              const jsonAgency = data.find(a => a.id === saved.id) || {};
              return {
                id: saved.id,
                name: saved.name || jsonAgency.nombre,
                patients: saved.pacientesActivos || jsonAgency.pacientesActivos || 0,
                address: saved.address || 'Los Angeles, California',
                phone: saved.phone || generateRandomPhone(),
                email: saved.email || generateEmail(saved.name || jsonAgency.nombre),
                status: saved.status || 'Activo',
                docs: saved.docs || 'No',
                logo: saved.logo || '/api/placeholder/64/64'
              };
            });
          }
          renderAgencies();
        })
        .catch(error => {
          console.error('Error loading agencies:', error);
          agenciesList = predefinedAgencies.map(name => ({
            name,
            patients: 0,
            address: 'Los Angeles, California',
            phone: generateRandomPhone(),
            email: generateEmail(name),
            status: 'Activo',
            docs: 'No',
            logo: '/api/placeholder/64/64'
          }));
          RenderAgencies();
        });
    }
  
    function saveAgencies() {
      const simplifiedAgencies = agenciesList.map(agency => ({
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
      localStorage.setItem('agencies', JSON.stringify(simplifiedAgencies));
    }
  
    function renderAgencies() {
      const agenciesGrid = document.getElementById('agenciesGrid');
      if (!agenciesGrid) return console.error('No se encontró #agenciesGrid');
      agenciesGrid.innerHTML = '';
  
      const sortedAgencies = agenciesList.sort((a, b) => a.name.localeCompare(b.name));
      sortedAgencies.forEach((agency, index) => {
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
            <div class="agency-status-docs">
              <p><strong>Estado:</strong> ${agency.status}</p>
              <p><strong>Documentos:</strong> ${agency.docs}</p>
            </div>
          </div>
        `;
        agenciesGrid.appendChild(card);
      });
      setupSearch();
    }
  
    function setupSearch() {
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.addEventListener('input', function() {
          const searchTerm = this.value.toLowerCase().trim();
          const agenciesGrid = document.getElementById('agenciesGrid');
          const cards = agenciesGrid.getElementsByClassName('agency-card');
          Array.from(cards).forEach(card => {
            const agencyName = card.querySelector('.agency-card__name').textContent.toLowerCase();
            card.style.display = agencyName.includes(searchTerm) ? '' : 'none';
          });
        });
      }
    }
  
    function openNewAgencyModal() {
      document.getElementById('newName').value = '';
      document.getElementById('newEmail').value = '';
      document.getElementById('newAddress').value = 'Los Angeles, California';
      document.getElementById('newPhone').value = '';
      document.getElementById('newStatus').value = 'Activo';
      document.getElementById('newDocs').value = 'No';
      document.getElementById('newLogoImg').src = '/api/placeholder/64/64';
      document.getElementById('newAgencyModal').classList.add('active');
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
      if (logoInput.files && logoInput.files[0]) {
        logo = URL.createObjectURL(logoInput.files[0]);
      }
  
      const newAgency = {
        id: `AG${String(agenciesList.length + 1).padStart(3, '0')}`,
        name,
        patients: 0,
        address,
        phone,
        email,
        status,
        docs,
        logo
      };
      agenciesList.push(newAgency);
      saveAgencies();
      renderAgencies();
      closeModal('newAgencyModal');
    }
  
    function editAgency(index) {
      currentEditIndex = index;
      const agency = agenciesList[index];
      document.getElementById('editName').value = agency.name;
      document.getElementById('editEmail').value = agency.email;
      document.getElementById('editAddress').value = agency.address;
      document.getElementById('editPhone').value = agency.phone;
      document.getElementById('editStatus').value = agency.status;
      document.getElementById('editDocs').value = agency.docs;
      document.getElementById('editLogoImg').src = agency.logo;
      document.getElementById('editModal').classList.add('active');
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
        let logo = agenciesList[currentEditIndex].logo;
        if (logoInput.files && logoInput.files[0]) {
          logo = URL.createObjectURL(logoInput.files[0]);
        }
  
        agenciesList[currentEditIndex] = {
          ...agenciesList[currentEditIndex],
          name,
          email,
          address,
          phone,
          status,
          docs,
          logo
        };
        saveAgencies();
        renderAgencies();
        closeModal('editModal');
        currentEditIndex = -1;
      }
    }
  
    function prepareDeleteAgency(index) {
      currentDeleteIndex = index;
      document.getElementById('deleteModal').classList.add('active');
    }
  
    function confirmDeleteAgency() {
      if (currentDeleteIndex !== -1) {
        agenciesList.splice(currentDeleteIndex, 1);
        saveAgencies();
        renderAgencies();
        closeModal('deleteModal');
        currentDeleteIndex = -1;
      }
    }
  
    function closeModal(modalId) {
      document.getElementById(modalId).classList.remove('active');
      const logoInput = document.getElementById(modalId === 'newAgencyModal' ? 'newLogo' : 'editLogo');
      if (logoInput) logoInput.value = '';
    }
  
    window.openNewAgencyModal = openNewAgencyModal;
    window.createNewAgency = createNewAgency;
    window.editAgency = editAgency;
    window.saveAgencyChanges = saveAgencyChanges;
    window.prepareDeleteAgency = prepareDeleteAgency;
    window.confirmDeleteAgency = confirmDeleteAgency;
    window.closeModal = closeModal;
    window.previewLogo = previewLogo;
  
    loadAgencies();
  });