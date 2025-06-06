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
  console.log(factura)
  const res = await api.post('/facturas/', factura);
  try{
  console.log(res.data)
  } catch (e){
    console.log("Error al llamar al backend: ",e)
  }
  return res.data;
}

// Listar facturas por técnico
export async function getFacturasPorTecnico(tecnicoId: number) {
  const res = await api.get(`/facturas/tecnico/${tecnicoId}`);
  return res.data;
}

// Listar facturas asociadas a una incidencia específica
export async function getFacturasPorIncidencia(incidenciaId: number) {
  const res = await api.get(`/facturas/incidencia/${incidenciaId}`);
  return res.data;
}

// Listar facturas RESUELTAS asociadas a un técnico
export async function getFacturasResueltasPorTecnico(tecnicoId: number) {
  const res = await api.get(`/facturas/resueltas/tecnico/${tecnicoId}`);
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

export async function getFacturaPorTecnicoYIncidencia(tecnicoId: number, incidenciaId: number) {
  const res = await api.get(`/facturas/tecnico/${tecnicoId}/incidencia/${incidenciaId}`);
  return res.data;
}
