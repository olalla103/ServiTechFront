import { useAuth } from '@/context/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CronometroIncidencia from '../../components/CronometroIncidencia'; // ajusta la ruta si es necesario
import { getIncidenciaPorId } from '../../utils/handler_incidencias';
import { getUsuarioPorId } from '../../utils/handler_usuarios'; // Ajusta la ruta si es necesario

export default function DetalleIncidenciaScreen() {
  const { id } = useLocalSearchParams();
  const incidenciaId = Number(id);
  const { refetch } = useQuery({
    queryKey: ['incidencia', incidenciaId],
    queryFn: () => getIncidenciaPorId(incidenciaId),
    enabled: !!id,
  });

const refetchIncidencias = () => {
  refetch();
  console.log('refrescada')
};

  useFocusEffect(
  React.useCallback(() => {
    refetchIncidencias(); // tu función para refrescar
  }, [])
);

 const { user } = useAuth();
const [mostrarFormularioFactura, setMostrarFormularioFactura] = useState(false);

 const { data: incidencia, isLoading, error } = useQuery({
  queryKey: ['incidencia', incidenciaId],
  queryFn: () => getIncidenciaPorId(incidenciaId),
  enabled: !!incidenciaId, // O quítalo si siempre está definido
});

  // 2. Obtén los datos del cliente y técnico, solo si ya tienes la incidencia
  const clienteId = incidencia?.cliente_id;
  const tecnicoId = incidencia?.tecnico_id;

  const clienteQuery = useQuery({
    queryKey: ['cliente', clienteId],
    queryFn: () => getUsuarioPorId(clienteId!),
    enabled: !!clienteId,
  });

  const tecnicoQuery = useQuery({
    queryKey: ['tecnico', tecnicoId],
    queryFn: () => getUsuarioPorId(tecnicoId!),
    enabled: !!tecnicoId,
  });

// function horasToSeconds(horas?: string | null): number {
//   if (!horas || typeof horas !== "string" || !horas.includes(":")) return 0;
//   const [h, m, s] = horas.split(':').map(Number);
//   return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
// }

function tiempoToSegundos(horasStr?: string) {
  if (!horasStr) return 0;
  const [h, m, s] = horasStr.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}


  // 3. Returns condicionales DESPUÉS de los hooks
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2edbd1" />
      </View>
    );
  }

  if (error || !incidencia) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#ff5252" }}>Error cargando la incidencia.</Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.iconoFlecha}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={28} color="#2edbd1" />
      </TouchableOpacity>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
        <Text style={styles.title}>Detalle de incidencia</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>📍 Dirección</Text>
          <Text style={styles.value}>{incidencia.direccion || "No disponible"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>📝 Descripción</Text>
          <Text style={styles.value}>{incidencia.descripcion || "No disponible"}</Text>
        </View>

        <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
            <Text style={styles.label}>⏱ Estado</Text>
            <Text style={styles.value}>
              {incidencia.estado === 'pendiente'
              ? 'Pendiente'
              : incidencia.estado === 'en_reparacion'
              ? 'En reparación'
              : incidencia.estado === 'resuelta'
              ? 'Resuelta'
              : incidencia.estado}
            </Text>
            </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>🗓️ Fecha reporte</Text>
            <Text style={styles.value}>{new Date(incidencia.fecha_reporte).toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.cardRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>👤 Cliente</Text>
            <Text style={styles.value}>
              {clienteQuery.data
                ? `${clienteQuery.data.nombre} ${clienteQuery.data.apellido1} ${clienteQuery.data.apellido2}`
                : incidencia.cliente_id}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>👨‍🔧 Técnico</Text>
            <Text style={styles.value}>
              {tecnicoQuery.data
                ? `${tecnicoQuery.data.nombre} ${tecnicoQuery.data.apellido1}${tecnicoQuery.data.apellido2}`
                : (incidencia.tecnico_id || "Sin asignar")}
            </Text>
          </View>
        </View>

        {/* CRONÓMETRO O TIEMPO FINAL */}
        {["pendiente", "en_reparacion"].includes(incidencia.estado) ? (
          <View style={styles.card}>
            <Text style={styles.label}>⏱ Tiempo de trabajo</Text>
            <CronometroIncidencia
              incidenciaId={Number(incidencia.id ?? 0)}
            />
          </View>
        ) : (
          <>
          <View style={styles.card}>
            <Text style={styles.label}>⏱ Tiempo invertido</Text>
            <Text style={styles.value}>
              {incidencia.horas ? incidencia.horas : "No registrado"}
            </Text>
          </View>
          <TouchableOpacity
  style={styles.boton}
  onPress={() => router.push({
    pathname: '/facturas/formularioFactura',
    params: {
      incidenciaId: incidencia.id,
      clienteId: clienteId,
      tecnicoId: tecnicoId,
    }
  })}
>
  <Text style={styles.botonTexto}>Crear Factura</Text>
</TouchableOpacity>

          
          
           </>
        )}

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1,
    backgroundColor: '#f0f2f4',
  },
   boton: {
    padding: 12,
    backgroundColor: '#2edbd1',
    width: '60%',
    alignSelf: 'center',
    borderRadius: 8,
    marginVertical: 16,
    justifyContent: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2edbd1',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#0002',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  iconoFlecha: {
    position: 'absolute',
    top: 50,
    left: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#f8f9fb',
    borderRadius: 20,
    elevation: 4,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  label: {
    color: '#888',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
