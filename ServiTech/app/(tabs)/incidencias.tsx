// app/(tabs)/Incidencias.tsx
import React from 'react';
import {
    ActivityIndicator,
    SectionList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Incidencia, useIncidencias } from '../../hooks/useIncidencidas';

type Seccion = {
  title: string;
  data: Incidencia[];
};

export default function IncidenciasScreen() {
  const { data, isLoading, error } = useIncidencias();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text>Error al cargar las incidencias.</Text>
      </View>
    );
  }

  // Filtramos en tres arrays según el estado
  const secciones: Seccion[] = [
    {
      title: 'Pendientes de asignación',
      data: data.filter(i => i.estado === 'pendiente'),
    },
    {
      title: 'En curso',
      data: data.filter(i => i.estado === 'en_curso'),
    },
    {
      title: 'Finalizadas',
      data: data.filter(i => i.estado === 'finalizada'),
    },
  ];

  return (
    <SectionList
      sections={secciones}
      keyExtractor={item => item.id.toString()}
      renderSectionHeader={({ section }) => (
        <Text style={styles.header}>{section.title}</Text>
      )}
      renderItem={({ item }) => <IncidenciaRow incidencia={item} />}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <Text style={styles.empty}>No hay incidencias en esta sección.</Text>
      }
    />
  );
}

function IncidenciaRow({ incidencia }: { incidencia: Incidencia }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{incidencia.titulo}</Text>
      <Text style={styles.rowDesc}>{incidencia.descripcion}</Text>
      <Text style={styles.rowDate}>
        {new Date(incidencia.fecha).toLocaleDateString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  row: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    // sombra ligera
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  rowDesc: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  rowDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
    textAlign: 'right',
  },
  empty: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
