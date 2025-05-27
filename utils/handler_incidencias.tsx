import api from './api';

// 1. Listar todas las incidencias
export async function getIncidencias() {
  const res = await api.get('/incidencias');
  return res.data;
}

// 2. Crear una nueva incidencia
export async function crearIncidencia(incidencia: any) {
  const res = await api.post('/incidencias', incidencia);
  return res.data;
}

// 3. Obtener incidencia por ID
export async function getIncidenciaPorId(id: number) {
  const res = await api.get(`/incidencias/${id}`);
  return res.data;
}

// 4. Actualizar una incidencia
export async function actualizarIncidencia(id: number, datos: any) {
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
export async function pausarIncidencia(incidencia_id: number, fecha_hora_pausa: string) {
  const res = await api.patch(`/incidencias/pausar/${incidencia_id}`, { fecha_hora_pausa });
  return res.data;
}

// 13. Reanudar una incidencia
export async function reanudarIncidencia(incidencia_id: number) {
  const res = await api.patch(`/incidencias/reanudar/${incidencia_id}`);
  return res.data;
}
