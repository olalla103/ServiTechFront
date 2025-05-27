// hooks/useIncidencias.ts
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api'; // tu instancia de axios

export type Incidencia = {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en_curso' | 'finalizada';
  fecha: string;
};

async function fetchIncidencias(): Promise<Incidencia[]> {
  const res = await api.get<Incidencia[]>('/incidencias');
  return res.data;
}

export function useIncidencias() {
  return useQuery({
    queryKey: ['incidencias'],
    queryFn: fetchIncidencias,
    staleTime: 1000 * 60, // 1 minuto
  });
}
