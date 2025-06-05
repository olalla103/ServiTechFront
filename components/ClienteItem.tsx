// components/ClienteItem.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Usuario } from '../types/usuario';

type Props = {
  cliente: Usuario;
  eliminando?: boolean;
   editando?: boolean; // <-- Nuevo
  onSeleccionar?: () => void;
};

export default function ClienteItem({ cliente, eliminando = false, editando=false, onSeleccionar }: Props) {
  const router = useRouter();

    const extraStyle = eliminando
    ? { backgroundColor: '#ffe4e1', borderWidth: 2, borderColor: '#EFBA93' }
    : editando
      ? { backgroundColor: '#ffeec7', borderWidth: 2, borderColor: '#EFD9AA' }
      : {};


  return (
    <TouchableOpacity
      style={[styles.item, extraStyle]}
      onPress={onSeleccionar ? onSeleccionar : () => { router.push({ pathname: '/clientes/[id]', params: { id: cliente.id } }) }}
      activeOpacity={eliminando || editando ? 0.6 : 0.8}
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
    width:'100%',
    paddingHorizontal:40,
    alignSelf:'stretch',
    shadowRadius: 4,
    elevation: 2,
  },
nombre: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  direccion: {
    color: '#555',
    fontSize: 15,
  },
});
