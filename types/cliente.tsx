// types/cliente.ts
export type Cliente = {
  id: number;
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  direccion?: string;
  email?: string;
  telefono?: string;
  empresa_id: string;
};
