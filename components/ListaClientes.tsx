// components/ListaClientes.tsx
import { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Cliente } from '../types/cliente';
import ClienteItem from './ClienteItem';

export default function ListaClientes({
  query,
  emptyMessage,
}: {
  query: UseQueryResult<Cliente[], Error>;
  emptyMessage?: string;
}) {
  const { data, isLoading, error } = query;

  if (isLoading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color="#2edbd1" />
      </View>
    );
  if (error)
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#ff5252' }}>Error cargando clientes: {error.message}</Text>
      </View>
    );

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ClienteItem cliente={item} />}
      keyExtractor={item => String(item.id)}
      ListEmptyComponent={
        <Text style={styles.empty}>{emptyMessage || "No hay clientes."}</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 16 },
});
