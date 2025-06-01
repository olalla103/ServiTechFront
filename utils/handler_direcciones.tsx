import { Direccion } from '@/types/direccion';
import api from '../utils/api';

export async function getDireccionesUsuario(usuario_id: number) {
  const res = await api.get(`/direcciones/usuarios/${usuario_id}/direcciones`);
  return res.data;
}

export async function crearDireccionUsuario(usuario_id: number, direccion: any) {
  const res = await api.post(`/direcciones/usuarios/${usuario_id}/direcciones`, direccion);
  return res.data;
}

export async function crearDireccionesMultiples(usuarioEmail: string, direcciones: Direccion[]) {
  try {
  
    const res = await api.post(
      `/direcciones/usuarios/${usuarioEmail}/direccionesmultiples`,
      direcciones
    );
    return res.data; // Esto será un array de direcciones con sus IDs, etc.
  } catch (error: any) {
    // Puedes mejorar el manejo del error según tu necesidad
    throw error.res?.data?.detail || "Error al añadir direcciones";
  }
}

export async function getDireccionPorId(direccion_id: number) {
  const res = await api.get(`/direcciones/direcciones/${direccion_id}`);
  return res.data;
}

export async function actualizarDireccion(direccion_id: number, datos: any) {
  console.log("Llamando a actualizarDireccion:", direccion_id, datos);
  const res = await api.patch(`/direcciones/direcciones/${direccion_id}`, datos);
  return res.data;
}

export async function eliminarDireccion(direccion_id: number) {
  const res = await api.delete(`/direcciones/direcciones/${direccion_id}`);
  return res.data;
}
