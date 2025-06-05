import { Direccion } from '@/types/direccion';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Usuario } from '../../types/usuario';
import { getUsuarioPorId } from '../../utils/handler_usuarios';

type DireccionConId = Direccion & { id?: number; _nueva?: boolean; _eliminar?: boolean };

export default function DetalleClienteScreen() {
  const { id } = useLocalSearchParams();
  const clienteId = typeof id === "string" ? parseInt(id, 10) : Number(id); // Convertir a int
  const [showDirecciones, setShowDirecciones] = useState(false);
  const navigation = useNavigation();


  const { data: cliente, isLoading, error } = useQuery<Usuario>({
    queryKey: ['cliente', clienteId],
    queryFn: () => getUsuarioPorId(clienteId),
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
    <>
     <TouchableOpacity
            style={styles.iconoFlecha}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={28} color="#2edbd1" />
          </TouchableOpacity>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {cliente.nombre} {cliente.apellido1}{cliente.apellido2 ? ` ${cliente.apellido2}` : ''}
      </Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nombre y apellidos:</Text>
        <Text style={styles.value}>{cliente.nombre} {cliente.apellido1}{cliente.apellido2 ? ` ${cliente.apellido2}` : ''}</Text>
      </View>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setShowDirecciones(open => !open)}>
          <Text style={styles.label}>
            Direcciones ({cliente.direcciones?.length || 0}) {showDirecciones ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>
        {showDirecciones && (
          cliente.direcciones && cliente.direcciones.length > 0
            ? cliente.direcciones.map((dir, idx) => (
                <View key={(dir as any).id ?? idx} style={styles.direccionCard}>
  <Text style={styles.value}>
    {dir.calle ?? ''} {dir.numero ?? ''}
    {dir.piso ? `, Piso ${dir.piso}` : ''}
    {dir.puerta ? `, Puerta ${dir.puerta}` : ''}{'\n'}
    {dir.cp ?? ''} {dir.ciudad ?? ''}
    {dir.provincia ? ` (${dir.provincia})` : ''}
    {dir.pais ? `, ${dir.pais}` : ''}
  </Text>
</View>
              ))
            : <Text style={styles.value}>No hay direcciones registradas</Text>
        )}
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
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f8f9fb',
    flex:1
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
    marginTop:80,
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
     iconoFlecha: {
    position: 'absolute',
    top: 50,
    left: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 4,
  },
  direccionCard: {
    backgroundColor: '#f1f3f7',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
