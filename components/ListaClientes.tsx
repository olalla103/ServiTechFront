// components/ListaClientes.tsx
import { UseQueryResult } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Usuario } from '../types/usuario';
import ClienteItem from './ClienteItem';

type Props = {
  title?: string;
  query: UseQueryResult<Usuario[], Error>;
  emptyMessage?: string;
  eliminando?: boolean;
  editando?: boolean; 
  onSeleccionarCliente?: (cliente: Usuario) => void;
};

export default function ListaClientes({
  title,
  query,
  emptyMessage,
  eliminando = false,
  editando = false,
  onSeleccionarCliente,
}: Props) {
  const { data, isLoading, error } = query;
  const [search, setSearch] = useState('');

  // Filtrado por nombre y apellidos
  const filteredClientes = data
    ? data.filter(cliente => {
        const nombreCompleto = `${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2 ?? ''}`.toLowerCase();
        return nombreCompleto.includes(search.toLowerCase());
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
          Error cargando clientes: {error.message}
        </Text>
      </View>
    );

  return (
    <FlatList
      data={filteredClientes}
      renderItem={({ item }) => (
        <ClienteItem
          cliente={item}
          eliminando={eliminando}
          editando={editando}
          onSeleccionar={onSeleccionarCliente ? () => onSeleccionarCliente(item) : undefined}
        />
      )}
      keyExtractor={item => String(item.id)}
      ListHeaderComponent={
        <View>
          {title && <Text style={styles.sectionTitle}>{title}</Text>}
          <TextInput
            placeholder="Buscar por nombre o apellidos"
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
          {emptyMessage || "No hay clientes."}
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
