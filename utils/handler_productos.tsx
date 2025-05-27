import api from '../utils/api';

export async function getProductos() {
  const res = await api.get('/productos');
  return res.data;
}

export async function getProductoPorId(id: number) {
  const res = await api.get(`/productos/${id}`);
  return res.data;
}

export async function crearProducto(producto: any) {
  const res = await api.post('/productos', producto);
  return res.data;
}

export async function actualizarProducto(id: number, datos: any) {
  const res = await api.patch(`/productos/${id}`, datos);
  return res.data;
}

export async function eliminarProducto(id: number) {
  const res = await api.delete(`/productos/${id}`);
  return res.data;
}
