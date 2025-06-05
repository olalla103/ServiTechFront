import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect, useNavigation } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ListaIncidencias from '../../components/ListaIncidencias';
import { useAuth } from '../../context/AuthProvider';
import {
  getIncidenciasEnReparacionPorTecnico,
  getIncidenciasPendientesPorTecnico,
  getIncidenciasResueltasPorTecnico,
} from '../../utils/handler_incidencias';

export default function PantallaIncidencias() {
  const navigation = useNavigation();

    useFocusEffect(
    React.useCallback(() => {
      enReparacionQuery.refetch();
      pendientesQuery.refetch();
      resueltasQuery.refetch();
    }, [])
  );
  
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
  onPress={() => navigation.goBack()}
  activeOpacity={0.8}
>
  <Ionicons name="arrow-back" size={28} color="#2edbd1" />
</TouchableOpacity>


  <View style={styles.fondoApp}>
    <Text style={styles.headerIncidencias}>
      Incidencias
    </Text>
    <Text style={styles.subHeader}>
      Pulsa una incidencia para ver su detalle.
    </Text>
    <View style={styles.card}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32,paddingHorizontal: 10 }}>
        <ListaIncidencias title="Pendientes de asignación" query={pendientesQuery} />
        <ListaIncidencias title="En reparación" query={enReparacionQuery} />
        <ListaIncidencias title="Últimas finalizadas" query={resueltasQuery} />
      </ScrollView>
    </View>
  </View>
</>

  );
}

const styles = StyleSheet.create({
  fondoApp: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 90,
    // alignItems: 'center', // ¡Quita esto!
    paddingHorizontal: 0,    // Mejor, padding fuera del card
  },
  headerIncidencias: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1bcfc5',
    marginBottom: 2,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 10,
  },
  subHeader: {
    fontSize: 15,
    color: '#7bd9d5',
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  card: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f8fafc', // igual que el fondo, para look plano
    borderRadius: 0,            // sin borde, para que todo sea plano
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    shadowColor: 'transparent', // sin sombra, plano
    elevation: 0,
  },
  iconoFlecha: {
    position: 'absolute',
    top: 54,
    left: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 4,
  }
});
