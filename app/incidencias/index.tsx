import { getUsuarioIdByEmail } from '@/utils/handler_usuarios';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  const [userId, setUserId] = useState<number | null>(null);
  const { user } = useAuth();
  console.log("👤 Técnico en pantalla incidencias:", user);

  // Obtener id por email solo una vez que tengamos usuario y email
  useEffect(() => {
    if (user?.email) {
      getUsuarioIdByEmail(user.email).then(id => {
        setUserId(id);
        console.log("ID obtenido por email:", id);
      });
    }
  }, [user]);

  // Espera a tener el id antes de hacer las queries
  const enReparacionQuery = useQuery({
    queryKey: ['incidencias-en-reparacion', userId],
    queryFn: () => {
      if (userId === null) throw new Error("No hay userId disponible");
      return getIncidenciasEnReparacionPorTecnico(userId);
    },
    enabled: !!userId,
  });

  const pendientesQuery = useQuery({
    queryKey: ['incidencias-pendientes', userId],
    queryFn: () => {
      if (userId === null) throw new Error("No hay userId disponible");
      return getIncidenciasPendientesPorTecnico(userId); // <--- CORRECTO
    },
    enabled: !!userId,
  });

  const resueltasQuery = useQuery({
    queryKey: ['incidencias-resueltas', userId],
    queryFn: () => {
      if (userId === null) throw new Error("No hay userId disponible");
      return getIncidenciasResueltasPorTecnico(userId); // <--- CORRECTO
    },
    enabled: !!userId,
  });

  // Actualiza las queries cuando cambias de pantalla
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        enReparacionQuery.refetch();
        pendientesQuery.refetch();
        resueltasQuery.refetch();
      }
    }, [userId])
  );

  // Muestra loader mientras no tienes el userId
  if (!userId) return <Text>Cargando técnico...</Text>;

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
          <ScrollView contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 10 }}>
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
    paddingHorizontal: 0,
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
    backgroundColor: '#f8fafc',
    borderRadius: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    shadowColor: 'transparent',
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
