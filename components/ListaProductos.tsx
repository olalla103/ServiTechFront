// components/ListaProductos.tsx
import { UseQueryResult } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Producto } from '../types/producto';
import ProductoItem from './ProductoItem';

type Props = {
  title?: string;
  query: UseQueryResult<Producto[], Error>;
  emptyMessage?: string;
  eliminando?: boolean;
  editando?: boolean;
  onSeleccionarProducto?: (producto: Producto) => void;
};

export default function ListaProductos({
  title,
  query,
  emptyMessage,
  eliminando = false,
  editando = false,
  onSeleccionarProducto,
}: Props) {
  const { data, isLoading, error } = query;
  const [search, setSearch] = useState('');

  // Filtrado por nombre o descripción técnica
  const filteredProductos = data
    ? data.filter(producto => {
        const texto = `${producto.nombre} ${producto.descripcion_tecnica}`.toLowerCase();
        return texto.includes(search.toLowerCase());
      })
    : [];

  if (isLoading)
    return (
      <View style={{ marginVertical: 12 }}>
        <ActivityIndicator size="small" color="#2edbd1" />
      </View>
    );
  if (error)
    return (
      <View style={{ marginVertical: 12 }}>
        <Text style={{ color: '#ff5252' }}>
          Error cargando productos: {error.message}
        </Text>
      </View>
    );

  return (
    <FlatList
      data={filteredProductos}
      renderItem={({ item }) => (
        <ProductoItem
          producto={item}
          eliminando={eliminando}
          editando={editando}
          onSeleccionar={onSeleccionarProducto ? () => onSeleccionarProducto(item) : undefined}
        />
      )}
      keyExtractor={item => String(item.id)}
      ListHeaderComponent={
        <View>
          {title && <Text style={styles.sectionTitle}>{title}</Text>}
          <TextInput
            placeholder="Buscar por nombre o descripción"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
      }
      ListEmptyComponent={
        <Text style={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center', marginTop: 30 }}>
          {emptyMessage || "No hay productos."}
        </Text>
      }
      contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 10 }}
    />
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2edbd1',
    marginBottom: 12,
    marginTop: 24,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    marginBottom: 14,
    marginTop: 2,
  },
});
