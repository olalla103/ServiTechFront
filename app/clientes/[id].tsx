import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Cliente } from '../../types/cliente';
import { getClientesPorEmpresa } from '../../utils/handler_usuarios';

export default function DetalleClienteScreen() {
  const { id } = useLocalSearchParams();
  const clienteId = typeof id === "string" ? id : String(id); // Por si acaso

  const { data: cliente, isLoading, error } = useQuery<Cliente>({
    queryKey: ['cliente', clienteId],
    queryFn: () => getClientesPorEmpresa(clienteId),
    enabled: !!clienteId,
  });

  if (isLoading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2edbd1" />
      </View>
    );
  if (error || !cliente)
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#ff5252" }}>Error cargando el cliente.</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {cliente.nombre} {cliente.apellido1}{cliente.apellido2 ? ` ${cliente.apellido2}` : ''}
      </Text>
      <View style={styles.card}>
        <Text style={styles.label}>Dirección:</Text>
        <Text style={styles.value}>{cliente.direccion || "No disponible"}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{cliente.email || "No disponible"}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{cliente.telefono || "No disponible"}</Text>
      </View>
      {/* Puedes añadir más campos aquí */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f8f9fb',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fb',
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
