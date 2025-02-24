// dataManager.js

// Función para actualizar contadores de agencia
async function actualizarContadoresAgencia(agenciaId, tipo) {
    try {
        // Leer el archivo de agencias
        const respuestaAgencias = await fetch('../json/agencias.json');
        const agencias = await respuestaAgencias.json();

        // Encontrar la agencia correcta
        const agencia = agencias.find(ag => ag.id === agenciaId);
        if (!agencia) {
            console.error('Agencia no encontrada');
            return;
        }

        // Actualizar el contador correspondiente
        if (tipo === 'referido') {
            agencia.referidos++;
        } else if (tipo === 'paciente') {
            agencia.pacientesActivos++;
        }

        // Aquí normalmente guardarías los cambios en el archivo
        console.log('Contadores actualizados:', agencia);
        return agencia;
    } catch (error) {
        console.error('Error al actualizar contadores:', error);
        throw error;
    }
}

// Función para crear nuevo referido
async function crearReferido(datosReferido) {
    try {
        // Leer archivos actuales
        const respuestaReferidos = await fetch('../json/referrals.json');
        const referidos = await respuestaReferidos.json();

        // Crear nuevo ID para el referido
        const nuevoId = `REF${String(referidos.length + 1).padStart(3, '0')}`;

        // Crear el nuevo referido
        const nuevoReferido = {
            id: nuevoId,
            pacienteId: "",  // Se llenará cuando se cree el paciente
            agenciaId: datosReferido.agenciaId,
            fecha: new Date().toISOString().split('T')[0],
            estado: "pendiente",
            trabajadorSocial: datosReferido.trabajadorSocial,
            diagnostico: datosReferido.diagnostico,
            seguro: datosReferido.seguro,
            servicio: datosReferido.servicio,
            frecuencia: datosReferido.frecuencia,
            notas: datosReferido.notas
        };

        // Actualizar contadores de la agencia
        await actualizarContadoresAgencia(datosReferido.agenciaId, 'referido');

        // Aquí normalmente guardarías los cambios en el archivo
        console.log('Nuevo referido creado:', nuevoReferido);
        return nuevoReferido;
    } catch (error) {
        console.error('Error al crear referido:', error);
        throw error;
    }
}

// Función para crear nuevo paciente
async function crearPaciente(datosPaciente, referidoId) {
    try {
        // Leer archivos actuales
        const respuestaPacientes = await fetch('../json/pacientes.json');
        const pacientes = await respuestaPacientes.json();

        // Crear nuevo ID para el paciente
        const nuevoId = `PAC${String(pacientes.length + 1).padStart(3, '0')}`;

        // Crear el nuevo paciente
        const nuevoPaciente = {
            id: nuevoId,
            nombre: datosPaciente.nombre,
            agenciaId: datosPaciente.agenciaId,
            referralId: referidoId,
            fechaIngreso: new Date().toISOString().split('T')[0],
            estado: "activo",
            informacionMedica: {
                diagnostico: datosPaciente.diagnostico,
                tratamiento: datosPaciente.tratamiento,
                personalAsignado: datosPaciente.personalAsignado
            },
            contacto: {
                telefono: datosPaciente.telefono,
                direccion: datosPaciente.direccion,
                emergencia: datosPaciente.emergencia
            }
        };

        // Actualizar contadores de la agencia
        await actualizarContadoresAgencia(datosPaciente.agenciaId, 'paciente');

        // Actualizar el referido con el ID del paciente
        await actualizarReferido(referidoId, nuevoId);

        // Aquí normalmente guardarías los cambios en el archivo
        console.log('Nuevo paciente creado:', nuevoPaciente);
        return nuevoPaciente;
    } catch (error) {
        console.error('Error al crear paciente:', error);
        throw error;
    }
}

// Función para actualizar referido con ID de paciente
async function actualizarReferido(referidoId, pacienteId) {
    try {
        // Leer el archivo de referidos
        const respuestaReferidos = await fetch('../json/referrals.json');
        const referidos = await respuestaReferidos.json();

        // Encontrar y actualizar el referido
        const referido = referidos.find(ref => ref.id === referidoId);
        if (referido) {
            referido.pacienteId = pacienteId;
            referido.estado = "activo";
            
            // Aquí normalmente guardarías los cambios en el archivo
            console.log('Referido actualizado:', referido);
        }
    } catch (error) {
        console.error('Error al actualizar referido:', error);
        throw error;
    }
}

// Exportar las funciones
export {
    crearReferido,
    crearPaciente,
    actualizarContadoresAgencia,
    actualizarReferido
};