export type Incidencia = {
  id: number | string;
  descripcion: string;
  fecha_reporte: Date;
  estado: 'pendiente' | 'en_reparacion' | 'resuelta';
  direccion: string;
  fecha_inicio: Date | null;
  fecha_final: Date | null;
  horas: string | null;
  cliente_id: number;
  tecnico_id: number;
  tipo: 'presencial' | 'remota';
  pausada: boolean;
  fecha_hora_pausa: Date | null;
};
