// components/ProductoItem.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Producto } from '../types/producto';

type Props = {
  producto: Producto;
  eliminando?: boolean;
  editando?: boolean;
  onSeleccionar?: () => void;
};

export default function ProductoItem({ producto, eliminando = false, editando = false, onSeleccionar }: Props) {
  const extraStyle = eliminando
    ? { backgroundColor: '#ffe4e1', borderWidth: 2, borderColor: '#EFBA93' }
    : editando
      ? { backgroundColor: '#ffeec7', borderWidth: 2, borderColor: '#EFD9AA' }
      : {};

  return (
    <TouchableOpacity
      style={[styles.item, extraStyle]}
      onPress={onSeleccionar}
      activeOpacity={eliminando || editando ? 0.6 : 0.8}
    >
      <Text style={styles.nombre}>{producto.nombre}</Text>
      <Text style={styles.descripcion}>{producto.descripcion_tecnica}</Text>
      <Text style={styles.precio}>€ {producto.precio.toFixed(2)}</Text>
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
    width: '100%',
    paddingHorizontal: 40,
    alignSelf: 'stretch',
    shadowRadius: 4,
    elevation: 2,
  },
  nombre: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  descripcion: {
    color: '#555',
    fontSize: 15,
    marginBottom: 2,
  },
  precio: {
    color: '#2edbd1',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
