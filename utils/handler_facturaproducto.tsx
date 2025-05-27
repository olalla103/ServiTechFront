import api from './api';

// 1. Listar todos los productos de una factura
export async function getProductosDeFactura(factura_id: number) {
  const res = await api.get(`/factura_producto/factura/${factura_id}`);
  return res.data;
}

// 2. Obtener una relación factura-producto por su id único
export async function getFacturaProductoById(id: number) {
  const res = await api.get(`/factura_producto/${id}`);
  return res.data;
}

// 3. Crear una nueva relación factura-producto
export async function crearFacturaProducto(data: any) {
  const res = await api.post('/factura_producto', data);
  return res.data;
}

// 4. Editar la cantidad de productos usados en la factura
export async function actualizarCantidadFacturaProducto(id: number, cantidad: number) {
  const res = await api.patch(`/factura_producto/${id}`, { cantidad });
  return res.data;
}

// 5. Eliminar una relación factura-producto
export async function eliminarFacturaProducto(id: number) {
  const res = await api.delete(`/factura_producto/${id}`);
  return res.data;
}
