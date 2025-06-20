import api from './api';

// 1. Listar todas las incidencias
export async function getIncidencias() {
  const res = await api.get('/incidencias');
  return res.data;
}

// 2. Crear una nueva incidencia
export async function crearIncidencia(incidencia: any) {
  console.log("Incidencia que se va a enviar:", incidencia);

  try {
    const res = await api.post('/incidencias/', incidencia);
    console.log("Respuesta del backend:", res.status, res.data);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      // El backend devolvió un error, logueamos todo:
      console.log("Error del backend:", error.response.status, error.response.data);
    } else {
      // Error de red u otro
      console.log("Error sin respuesta del backend:", error.message);
    }
    throw error;
  }
}


export async function finalizarIncidencia(
  incidencia_id: number,
  fecha_final: string,
  horas: string
): Promise<any> {
  const res = await api.patch(`/incidencias/finalizar/${incidencia_id}`, {
    fecha_final,
    horas,
  });
  return res.data;
}


// 3. Obtener incidencia por ID
export async function getIncidenciaPorId(id: number) {
  const res = await api.get(`/incidencias/${id}`);
  return res.data;
}

export async function getIncidenciasEnReparacionPorTecnico(tecnicoId: number) {
  const res = await api.get(`/incidencias/tecnico/${tecnicoId}/en-reparacion`);
  return res.data;
}

export async function getIncidenciasPendientesPorTecnico(tecnicoId: number) {
  const res = await api.get(`/incidencias/tecnico/${tecnicoId}/pendientes`);
  return res.data;
}

export async function getIncidenciasResueltasPorTecnico(tecnicoId: number) {
  const res = await api.get(`/incidencias/tecnico/${tecnicoId}/resueltas`);
  return res.data;
}


export async function getIncidenciasAutonomo(userId: number) {
  const res = await api.get(`/incidencias?autonomo_id=${userId}`);
  return res.data;
}

// 4. Actualizar una incidencia
export async function actualizarIncidencia(id: number, datos: any) {
  console.log('PUT a:', `/incidencias/${id}`);
console.log('Datos enviados para update:', datos);
  const res = await api.put(`/incidencias/${id}`, datos);
  return res.data;
}

// 6. Listar incidencias pendientes
export async function getIncidenciasPendientes() {
  const res = await api.get('/incidencias/pendientes');
  return res.data;
}

// 7. Listar incidencias resueltas
export async function getIncidenciasResueltas() {
  const res = await api.get('/incidencias/resueltas');
  return res.data;
}

// 8. Listar incidencias de un técnico por su ID
export async function getIncidenciasPorTecnico(tecnico_id: number) {
  const res = await api.get(`/incidencias/tecnico/${tecnico_id}`);
  return res.data;
}

// 9. Listar incidencias de un cliente por su ID
export async function getIncidenciasPorCliente(cliente_id: number) {
  const res = await api.get(`/incidencias/cliente/${cliente_id}`);
  return res.data;
}

// 10. Listar incidencias en curso (en reparación)
export async function getIncidenciasEnCurso() {
  const res = await api.get('/incidencias/en-reparacion');
  return res.data;
}

// 11. Filtrar incidencias (puedes pasar los filtros que quieras, si alguno no lo usas pon undefined)
export async function filtrarIncidencias({
  estado,
  tipo,
  tecnico_id,
  cliente_id,
}: {
  estado?: string;
  tipo?: string;
  tecnico_id?: number;
  cliente_id?: number;
}) {
  const res = await api.get('/incidencias/filtro', {
    params: {
      estado,
      tipo,
      tecnico_id,
      cliente_id,
    },
  });
  return res.data;
}

// 12. Pausar una incidencia (pasa el id y el datetime de la pausa)
export async function pausarIncidencia(
  incidencia_id: number,
  fecha_hora_pausa: string
): Promise<any> {
  const res = await api.patch(`/incidencias/pausar/${incidencia_id}`, {
    fecha_hora_pausa,
  });
  return res.data;
}

// 13. Reanudar una incidencia
export async function reanudarIncidencia(incidencia_id: number) {
  const res = await api.patch(`/incidencias/reanudar/${incidencia_id}`);
  return res.data;
}
