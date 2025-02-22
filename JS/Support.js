// Configuración y estado del sistema
const systemStatus = {
    services: [
        {
            name: 'Therapy Sync',
            status: 'operational',
            uptime: 99.9,
            responseTime: 250 // ms
        },
        {
            name: 'Base de Datos de Pacientes',
            status: 'operational',
            uptime: 99.8,
            responseTime: 180
        },
        {
            name: 'Sistema de Reportes',
            status: 'operational',
            uptime: 99.7,
            responseTime: 350
        },
        {
            name: 'Gestor de Citas',
            status: 'operational',
            uptime: 99.9,
            responseTime: 200
        }
    ],
    incidents: []
};

// Simular incidentes ocasionales
function simulateIncidents() {
    const services = systemStatus.services;
    const randomService = services[Math.floor(Math.random() * services.length)];
    const currentTime = new Date();
    
    // 10% de probabilidad de incidente
    if (Math.random() < 0.1) {
        const issues = [
            'degraded', 
            'partial_outage', 
            'maintenance'
        ];
        const randomIssue = issues[Math.floor(Math.random() * issues.length)];
        
        randomService.status = randomIssue;
        systemStatus.incidents.push({
            service: randomService.name,
            status: randomIssue,
            time: currentTime,
            message: `Se detectó ${getStatusMessage(randomIssue)} en ${randomService.name}`
        });

        // Notificar al usuario
        showNotification(`Alerta: ${getStatusMessage(randomIssue)} en ${randomService.name}`);
        
        // Auto-resolver después de un tiempo aleatorio
        setTimeout(() => {
            randomService.status = 'operational';
            updateSystemStatus();
        }, Math.random() * 20000 + 10000);
    }

    updateSystemStatus();
}

// Actualizar estado del sistema en la UI
function updateSystemStatus() {
    const statusContainer = document.getElementById('system-status');
    if (!statusContainer) return;

    statusContainer.innerHTML = systemStatus.services.map(service => `
        <div class="status-card ${service.status}">
            <div class="status-header">
                <h4>${service.name}</h4>
                <span class="status-badge ${service.status}">
                    ${getStatusMessage(service.status)}
                </span>
            </div>
            <div class="status-metrics">
                <div class="metric">
                    <span class="metric-label">Uptime</span>
                    <span class="metric-value">${service.uptime}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Respuesta</span>
                    <span class="metric-value">${service.responseTime}ms</span>
                </div>
            </div>
        </div>
    `).join('');

    // Actualizar lista de incidentes
    const incidentsList = document.getElementById('incidents-list');
    if (incidentsList && systemStatus.incidents.length > 0) {
        incidentsList.innerHTML = systemStatus.incidents
            .slice(-5) // Mostrar solo los últimos 5 incidentes
            .map(incident => `
                <div class="incident-item">
                    <span class="incident-time">
                        ${formatTime(incident.time)}
                    </span>
                    <span class="incident-message">
                        ${incident.message}
                    </span>
                </div>
            `).join('');
    }
}

// Función auxiliar para mensajes de estado
function getStatusMessage(status) {
    const messages = {
        'operational': 'Operativo',
        'degraded': 'Rendimiento Degradado',
        'partial_outage': 'Interrupción Parcial',
        'maintenance': 'En Mantenimiento'
    };
    return messages[status] || status;
}

// Formatear tiempo
function formatTime(date) {
    return new Intl.DateTimeFormat('es', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
}

// Mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'system-notification';
    notification.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);

    // Remover después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Simular carga del sistema
function simulateSystemLoad() {
    systemStatus.services.forEach(service => {
        // Simular variaciones en tiempo de respuesta
        service.responseTime += Math.random() * 20 - 10;
        service.responseTime = Math.max(100, Math.min(500, service.responseTime));

        // Ajustar uptime ligeramente
        service.uptime = Math.max(99, Math.min(100, service.uptime + (Math.random() * 0.2 - 0.1)));
    });

    updateSystemStatus();
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar búsqueda
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Inicializar tarjetas de soporte
    const supportCards = document.querySelectorAll('.support-card');
    supportCards.forEach(card => {
        card.addEventListener('click', () => handleSupportCardClick(card));
    });

    // Iniciar monitoreo del sistema
    updateSystemStatus();
    setInterval(simulateSystemLoad, 5000);
    setInterval(simulateIncidents, 30000);
});

// Manejar búsqueda
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.support-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.opacity = text.includes(searchTerm) ? '1' : '0.5';
    });
}

// Manejar clics en tarjetas de soporte
function handleSupportCardClick(card) {
    const title = card.querySelector('h3').textContent;
    
    switch(title) {
        case 'Estado del Sistema':
            showSystemStatusModal();
            break;
        case 'Soporte Técnico':
            showContactModal();
            break;
        case 'FAQ':
            showFAQModal();
            break;
        case 'Guías de Uso':
            showGuidesModal();
            break;
    }
}

// Modal de estado del sistema
function showSystemStatusModal() {
    const modal = document.createElement('div');
    modal.className = 'system-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Estado del Sistema</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div id="system-status" class="status-grid"></div>
                <div class="incidents-section">
                    <h3>Últimos Incidentes</h3>
                    <div id="incidents-list"></div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    updateSystemStatus();

    // Event listeners para el modal
    modal.querySelector('.close-btn').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}