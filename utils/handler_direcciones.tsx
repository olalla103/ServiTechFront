import api from '../utils/api';

export async function getDireccionesUsuario(usuario_id: number) {
  const res = await api.get(`/direcciones/usuarios/${usuario_id}/direcciones`);
  return res.data;
}

export async function crearDireccionUsuario(usuario_id: number, direccion: any) {
  const res = await api.post(`/direcciones/usuarios/${usuario_id}/direcciones`, direccion);
  return res.data;
}

export async function getDireccionPorId(direccion_id: number) {
  const res = await api.get(`/direcciones/direcciones/${direccion_id}`);
  return res.data;
}

export async function actualizarDireccion(direccion_id: number, datos: any) {
  const res = await api.patch(`/direcciones/direcciones/${direccion_id}`, datos);
  return res.data;
}

export async function eliminarDireccion(direccion_id: number) {
  const res = await api.delete(`/direcciones/direcciones/${direccion_id}`);
  return res.data;
}
