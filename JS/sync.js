class DataManager {
    // Método para guardar un paciente nuevo
    static savePatient(patientData) {
        try {
            // Obtener lista de pacientes
            let patients = JSON.parse(localStorage.getItem('patients') || '[]');
            
            // Crear objeto de paciente con datos completos
            const newPatient = {
                id: Date.now(), // Identificador único
                date: new Date().toLocaleDateString(),
                ...patientData,
                status: 'new'
            };

            // Agregar paciente a la lista
            patients.push(newPatient);
            localStorage.setItem('patients', JSON.stringify(patients));

            // Actualizar referencias de agencia
            this.updateAgencyReferences(patientData.agency);

            return true;
        } catch (error) {
            console.error('Error guardando paciente:', error);
            return false;
        }
    }

    // Método para actualizar referencias de agencia
    static updateAgencyReferences(agencyName) {
        let agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
        
        const agencyIndex = agencies.findIndex(agency => agency.nombre === agencyName);
        if (agencyIndex !== -1) {
            agencies[agencyIndex].referidos = (agencies[agencyIndex].referidos || 0) + 1;
            localStorage.setItem('agencies', JSON.stringify(agencies));
        }
    }

    // Método para obtener pacientes
    static getPatients() {
        return JSON.parse(localStorage.getItem('patients') || '[]');
    }

    // Método para obtener agencias
    static getAgencies() {
        return JSON.parse(localStorage.getItem('agencies') || '[]');
    }

    // Método para cargar agencias iniciales desde JSON
    static initializeAgencies() {
        fetch('./JSON/agencias.json')
            .then(response => response.json())
            .then(agencies => {
                if (!localStorage.getItem('agencies')) {
                    localStorage.setItem('agencies', JSON.stringify(
                        agencies.map(agency => ({
                            ...agency,
                            referidos: 0
                        }))
                    ));
                }
            })
            .catch(error => console.error('Error cargando agencias:', error));
    }
}

// Inicializar agencias al cargar
document.addEventListener('DOMContentLoaded', () => {
    DataManager.initializeAgencies();
});