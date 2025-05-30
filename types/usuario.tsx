import { Direccion } from "./direccion";

// types/cliente.ts
export type Usuario = {
  id: number;
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  direccion?: string;
  email?: string;
  telefono?: string;
  empresa_id: string;
  direcciones?: Direccion[]; // <-- ¡este es el campo importante!
};
