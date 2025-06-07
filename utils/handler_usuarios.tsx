import api from './api';

// --- 1. Consultas básicas ---

// Listar todos los usuarios
export async function getUsuarios() {
  const res = await api.get('/usuarios');
  return res.data;
}

// Obtener usuario por ID
export async function getUsuarioPorId(usuario_id: number) {
  const res = await api.get(`/usuarios/${usuario_id}`);
  return res.data;
}

export async function getUsuarioIdByEmail(email: string) {
  try {
    const res = await api.get(`/usuarios/usuarios/id_por_email`, {
      params: {email}
    });
    return res.data.id;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

// Buscar usuario por nombre y apellidos
export async function buscarUsuario(nombre: string, apellido1: string, apellido2: string) {
  const res = await api.get('/usuarios/buscar', {
    params: { nombre, apellido1, apellido2 },
  });
  return res.data;
}

// Obtener usuarios ordenados por columna
export async function getUsuariosOrdenados(
  columna: string = 'nombre',
  ascendente: boolean = true,
  skip: number = 0,
  limit: number = 100
) {
  const res = await api.get('/usuarios/ordenados', {
    params: { columna, ascendente, skip, limit },
  });
  return res.data;
}

// Recuperar emails de todos los usuarios
export async function getUsuariosEmails() {
  const res = await api.get('/usuarios/emails');
  return res.data;
}

// Recuperar teléfonos de todos los usuarios
export async function getUsuariosTelefonos() {
  const res = await api.get('/usuarios/telefonos');
  return res.data;
}

// Recuperar especialidad de un usuario
export async function getUsuarioEspecialidad(usuario_id: number) {
  const res = await api.get(`/usuarios/${usuario_id}/especialidad`);
  return res.data;
}

// --- 2. Creación, edición y verificación ---

// Crear usuario
export async function crearUsuario(usuario: any) {
  const res = await api.post('/usuarios/', usuario);
  return res.data;
}

export async function debugUsuario(usuario:any) {
  // Cambia '/usuarios/debug' por la ruta de tu endpoint de FastAPI
  console.log("DEBUG JSON que se enviará:", usuario);
  const res = await api.post('/usuarios/debug', usuario);
  return res.data;
}

// Actualizar usuario (incluye cambiar teléfono)
export async function actualizarUsuario(usuario_id: number, datos: any) {
  const res = await api.patch(`/usuarios/${usuario_id}`, datos);
  return res.data;
}

// Verificar credenciales (id y número de seguridad social)
export async function verificarCredenciales(email: string, contraseña: string) {
  const res = await api.post('/usuarios/verificar', { email, contraseña });
  return res.data;
}

export async function getClientesPorEmpresa(empresaId: string) {
  const res = await api.get(`/usuarios/clientes/empresa/${empresaId}`);
  return res.data;
}

export async function getClienteById(clienteId: string | number) {
  const res = await api.get(`/usuarios/${clienteId}`);
  return res.data;
}


// --- 3. Eliminación ---

// Eliminar usuario
export async function eliminarUsuario(usuario_id: number) {
  const res = await api.delete(`/usuarios/${usuario_id}`);
  return res.data;
}

// Obtener el primer técnico disponible de una empresa
export async function getTecnicoIdByEmpresa(empresaId: number): Promise<number | null> {
  try {
    const res = await api.get(`/usuarios/tecnico/empresa/${empresaId}`);
    return res.data.length > 0 ? res.data[0].id : null;
  } catch (err) {
    console.error("Error buscando técnico:", err);
    return null;
  }
}

export async function cambiarPassword(email: string, contraseña: string) {
  try {
    const res = await api.post('/usuarios/cambiar_password', {
      email,
      contraseña,
    });
    return res.data;
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    throw error;
  }
}