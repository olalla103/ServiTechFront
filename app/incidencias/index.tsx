import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import ListaIncidencias from '../../components/ListaIncidencias';
import { useAuth } from '../../context/AuthProvider';
import {
  getIncidenciasEnReparacionPorTecnico,
  getIncidenciasPendientesPorTecnico,
  getIncidenciasResueltasPorTecnico,
} from '../../utils/handler_incidencias';

export default function PantallaIncidencias() {
  const { user } = useAuth();
  console.log("CARGANDO /incidencias/index.tsx");
  
  const enReparacionQuery = useQuery({
    queryKey: ['incidencias-en-reparacion', user?.id],
    queryFn: () => getIncidenciasEnReparacionPorTecnico(user.id),
    enabled: !!user?.id,
  });

  const pendientesQuery = useQuery({
    queryKey: ['incidencias-pendientes', user?.id],
    queryFn: () => getIncidenciasPendientesPorTecnico(user.id),
    enabled: !!user?.id,
  });

  const resueltasQuery = useQuery({
    queryKey: ['incidencias-resueltas', user?.id],
    queryFn: () => getIncidenciasResueltasPorTecnico(user.id),
    enabled: !!user?.id,
  });


  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.headerIncidencias}>
        Lista de incidencias, pulse en una para obtener más información sobre ella.
      </Text>
      <ListaIncidencias title="Pendientes de asignación" query={pendientesQuery} />
      <ListaIncidencias title="En curso" query={enReparacionQuery} />
      <ListaIncidencias title="Últimas finalizadas" query={resueltasQuery} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
    paddingTop: 100,
    paddingHorizontal: 18,
  },
  headerIncidencias: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2edbd1',
    marginBottom: 18,
    marginTop: 4,
    textAlign: 'center',
  },
});
