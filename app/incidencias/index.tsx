import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
    <>
    <TouchableOpacity
       style={styles.iconoFlecha}
       onPress={() => router.push('/autonomo')}
       activeOpacity={0.8}
     >
       <Ionicons name="arrow-back" size={28} color="#2edbd1" />
     </TouchableOpacity>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.headerIncidencias}>
        Lista de incidencias, pulse en una para obtener más información sobre ella.
      </Text>
      <ListaIncidencias title="Pendientes de asignación" query={pendientesQuery} />
      <ListaIncidencias title="En reparación" query={enReparacionQuery} />
      <ListaIncidencias title="Últimas finalizadas" query={resueltasQuery} />
    </ScrollView>
    </>
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
   iconoFlecha: {
    position: 'absolute',
    top: 50,
    left: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 4,
  }
});
