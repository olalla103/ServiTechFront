import api from './api';

// 1. Listar todas las empresas
export async function getEmpresas() {
  const res = await api.get('/empresas');
  return res.data;
}

// 2. Obtener una empresa por CIF
export async function getEmpresaPorCif(cif: string) {
  const res = await api.get(`/empresas/${cif}`);
  return res.data;
}

// 3. Buscar empresa por nombre fiscal
export async function getEmpresaPorNombre(nombre_fiscal: string) {
  const res = await api.get(`/empresas/nombre/${nombre_fiscal}`);
  return res.data;
}

// 4. Crear una nueva empresa
export async function crearEmpresa(empresa: any) {
  const res = await api.post('/empresas', empresa);
  return res.data;
}

// 5. Editar una empresa existente
export async function actualizarEmpresa(cif: string, datos: any) {
  const res = await api.patch(`/empresas/${cif}`, datos);
  return res.data;
}

// 6. Eliminar una empresa por CIF
export async function eliminarEmpresa(cif: string) {
  const res = await api.delete(`/empresas/${cif}`);
  return res.data;
}

// 7. Empresas por ciudad
export async function getEmpresasPorCiudad(ciudad: string) {
  const res = await api.get(`/empresas/ciudad/${ciudad}`);
  return res.data;
}

// 8. Empresas por provincia
export async function getEmpresasPorProvincia(provincia: string) {
  const res = await api.get(`/empresas/provincia/${provincia}`);
  return res.data;
}
