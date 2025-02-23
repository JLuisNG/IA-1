// maintenance.js
document.addEventListener('DOMContentLoaded', function() {
    console.log(`Página en mantenimiento el ${new Date().toLocaleDateString()}`);

    // Función para redirigir al inicio
    function redirectToWelcome() {
        window.location.href = './Welcome.html';
    }

    // Ejemplo de animación simple (puedes eliminarlo si no es necesario)
    const maintenanceContent = document.querySelector('.maintenance-content');
    maintenanceContent.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.02)';
    });
    maintenanceContent.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });

    // Exponer la función globalmente para el botón
    window.redirectToWelcome = redirectToWelcome;
});