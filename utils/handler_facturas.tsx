import api from './api';

// Listar todas las facturas
export async function getFacturas() {
  const res = await api.get('/facturas');
  return res.data;
}

// Obtener una factura concreta por su número
export async function getFacturaPorId(numero_factura: number) {
  const res = await api.get(`/facturas/${numero_factura}`);
  return res.data;
}

// Crear una nueva factura
export async function crearFactura(factura: any) {
  const res = await api.post('/facturas', factura);
  return res.data;
}

// Editar una factura existente
export async function actualizarFactura(numero_factura: number, datos: any) {
  const res = await api.patch(`/facturas/${numero_factura}`, datos);
  return res.data;
}

// Eliminar una factura por su número
export async function eliminarFactura(numero_factura: number) {
  const res = await api.delete(`/facturas/${numero_factura}`);
  return res.data;
}
