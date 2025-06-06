// types/factura.ts
export type Factura = {
  numero_factura: number;
  fecha_emision: string; // o Date si lo parseas
  tiempo_total: number;
  cantidad_total: number;
  cantidad_adicional: number;
  IVA: number;
  observaciones?: string | null;
  tecnico_id: number;
  cliente_id: number;
  incidencia_id: number;
  incidencia_nombre: string; // <-- este campo debe estar
};
