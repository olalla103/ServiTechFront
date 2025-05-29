// components/ClienteItem.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Cliente } from '../types/cliente';

export default function ClienteItem({ cliente }: { cliente: Cliente }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push({ pathname: '/clientes/[id]', params: { id: cliente.id } })}
      activeOpacity={0.7}
    >
      <Text style={styles.nombre}>{cliente.nombre} {cliente.apellido1} {cliente.apellido2}</Text>
      <Text style={styles.direccion}>{cliente.email}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  direccion: {
    color: '#555',
    fontSize: 15,
  },
});
