// dataManager.js - Manejador central de datos

class DataManager {
    // Métodos para obtener datos
    static async getAgencias() {
        try {
            // Primero intentamos cargar desde localStorage
            const storedData = localStorage.getItem('agencias');
            if (storedData) {
                return JSON.parse(storedData);
            }
            
            // Si no hay datos, cargar del JSON
            const response = await fetch('./json/agencias.json');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            
            // Guardar en localStorage
            localStorage.setItem('agencias', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error('Error cargando agencias:', error);
            return [];
        }
    }
    
    static async getPacientes() {
        try {
            const storedData = localStorage.getItem('pacientes');
            return storedData ? JSON.parse(storedData) : [];
        } catch (error) {
            console.error('Error cargando pacientes:', error);
            return [];
        }
    }
    
    static async getReferrals() {
        try {
            const storedData = localStorage.getItem('referrals');
            return storedData ? JSON.parse(storedData) : [];
        } catch (error) {
            console.error('Error cargando referidos:', error);
            return [];
        }
    }
    
    // Método para precargar agencias
    static async preloadAgencias() {
        const agencias = await this.getAgencias();
        window.agenciasData = agencias;
        return agencias;
    }
    
    // Métodos para guardar datos
    static async saveAgencias(data) {
        localStorage.setItem('agencias', JSON.stringify(data));
    }
    
    static async savePacientes(data) {
        localStorage.setItem('pacientes', JSON.stringify(data));
    }
    
    static async saveReferrals(data) {
        localStorage.setItem('referrals', JSON.stringify(data));
    }
    
    // Métodos para generar IDs únicos
    static generatePacienteId() {
        return `PAC${Date.now()}`;
    }
    
    static generateReferralId() {
        return `REF${Date.now()}`;
    }
    
    // Métodos para actualizar contadores
    static async incrementAgencyReferrals(agencyId) {
        const agencias = await this.getAgencias();
        const agencyIndex = agencias.findIndex(a => a.id === agencyId);
        
        if (agencyIndex !== -1) {
            agencias[agencyIndex].referidos = (agencias[agencyIndex].referidos || 0) + 1;
            await this.saveAgencias(agencias);
            return true;
        }
        return false;
    }
    
    static async incrementAgencyPatients(agencyId) {
        const agencias = await this.getAgencias();
        const agencyIndex = agencias.findIndex(a => a.id === agencyId);
        
        if (agencyIndex !== -1) {
            agencias[agencyIndex].pacientesActivos = (agencias[agencyIndex].pacientesActivos || 0) + 1;
            await this.saveAgencias(agencias);
            return true;
        }
        return false;
    }
    
    // Métodos para crear nuevos elementos
    static async createReferral(data) {
        const referrals = await this.getReferrals();
        const referralId = this.generateReferralId();
        
        const newReferral = {
            id: referralId,
            fecha: new Date().toISOString().split('T')[0],
            pacienteId: "",
            agenciaId: data.agencyId,
            estado: "pendiente",
            servicios: data.services || [],
            direccion: data.address || "",
            zipCode: data.zipCode || "",
            notas: data.notes || ""
        };
        
        referrals.push(newReferral);
        await this.saveReferrals(referrals);
        
        // Actualizar contador de la agencia
        await this.incrementAgencyReferrals(data.agencyId);
        
        return newReferral;
    }
    
    static async createPatient(data) {
        const patients = await this.getPacientes();
        const patientId = this.generatePacienteId();
        
        // Asegurar que tenemos un nombre
        const patientName = data.name && data.name !== "undefined" ? 
            data.name : 
            `Paciente ${new Date().toLocaleDateString()}`;
        
        const newPatient = {
            id: patientId,
            date: new Date().toLocaleDateString(),
            name: patientName,
            status: 'new',
            agenciaId: data.agencyId,
            referralId: data.referralId || "",
            therapists: {
                PT: data.services.includes('PT') ? null : null,
                PTA: data.services.includes('PTA') ? null : null,
                OT: data.services.includes('OT') ? null : null,
                COTA: data.services.includes('COTA') ? null : null,
                ST: data.services.includes('ST') ? null : null,
                STA: null
            },
            decline: '',
            evalDate: new Date().toLocaleDateString(),
            address: data.address || "",
            zipCode: data.zipCode || "",
            notes: data.notes || "",
            agency: data.agencyName || ""
        };
        
        patients.push(newPatient);
        await this.savePacientes(patients);
        
        // Si viene de un referido, actualizar su estado
        if (data.referralId) {
            await this.updateReferralStatus(data.referralId, patientId);
        }
        
        // Actualizar contador de la agencia
        await this.incrementAgencyPatients(data.agencyId);
        
        return newPatient;
    }
    
    static async updateReferralStatus(referralId, patientId) {
        const referrals = await this.getReferrals();
        const referralIndex = referrals.findIndex(r => r.id === referralId);
        
        if (referralIndex !== -1) {
            referrals[referralIndex].pacienteId = patientId;
            referrals[referralIndex].estado = "activo";
            await this.saveReferrals(referrals);
            return true;
        }
        return false;
    }
    
    static async updateTherapist(patientId, therapistType, therapistName) {
        const patients = await this.getPacientes();
        const patientIndex = patients.findIndex(p => p.id === patientId);
        
        if (patientIndex !== -1 && patients[patientIndex].therapists) {
            patients[patientIndex].therapists[therapistType] = therapistName;
            await this.savePacientes(patients);
            return true;
        }
        return false;
    }
}

// Exportar para uso global
window.DataManager = DataManager;

// Precargar agencias al cargar la página
DataManager.preloadAgencias().then(() => {
    console.log("Agencias precargadas:", window.agenciasData);
});