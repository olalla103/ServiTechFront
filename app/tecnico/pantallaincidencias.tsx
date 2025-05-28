import { useQuery, UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
    getIncidenciasEnCurso,
    getIncidenciasPendientes,
    getIncidenciasResueltas
} from '../../utils/handler_incidencias';

// Tipo completo, añade "id" y "titulo" si tus endpoints los mandan
type Incidencia = {
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

// Item de incidencia, usando título si existe, si no, mostramos dirección
function IncidenciaItem({ incidencia }: { incidencia: Incidencia }) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemDesc}>{incidencia.descripcion}</Text>
    </View>
  );
}

// Tipa bien ListaIncidencias usando UseQueryResult
function ListaIncidencias({
  title,
  query,
}: {
  title: string;
  query: UseQueryResult<Incidencia[], Error>;
}) {
  const { data, isLoading, error } = query;

  if (isLoading)
    return (
      <View style={{ marginVertical: 12 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ActivityIndicator size="small" color="#2edbd1" />
      </View>
    );
  if (error)
    return (
      <View style={{ marginVertical: 12 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={{ color: '#ff5252' }}>Error cargando incidencias.</Text>
      </View>
    );

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <IncidenciaItem incidencia={item} />}
        keyExtractor={item => String(item.id)}
        scrollEnabled={false}
        ListEmptyComponent={<Text style={{ color: '#aaa' }}>No hay incidencias</Text>}
      />
    </View>
  );
}

export default function PantallaIncidencias() {
  // Usa tus handlers de axios, tipando correctamente
  const pendientesQuery = useQuery<Incidencia[], Error>({
    queryKey: ['pendientes'],
    queryFn: getIncidenciasPendientes,
  });
  const enCursoQuery = useQuery<Incidencia[], Error>({
    queryKey: ['enCurso'],
    queryFn: getIncidenciasEnCurso,
  });
  const finalizadasQuery = useQuery<Incidencia[], Error>({
    queryKey: ['finalizadas'],
    queryFn: getIncidenciasResueltas,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <ListaIncidencias title="Pendientes de asignación" query={pendientesQuery} />
      <ListaIncidencias title="En curso" query={enCursoQuery} />
      <ListaIncidencias title="Últimas finalizadas" query={finalizadasQuery} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
    paddingTop: 34,
    paddingHorizontal: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4bc1be',
    marginTop: 24,
    marginBottom: 8,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#0002',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  itemDesc: {
    color: '#555',
    fontSize: 15,
  },
});
