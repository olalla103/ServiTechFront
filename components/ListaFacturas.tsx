import { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Factura } from '../types/factura';
import FacturaItem from './FacturaItem';

type ListaFacturasProps = {
  title?: string;
  query: UseQueryResult<Factura[], Error>;
  emptyMessage?: string;
  eliminando?: boolean;
  editando?: boolean;
  onSeleccionarFactura?: (factura: Factura) => void;
};

export default function ListaFacturas({
  title = 'Facturas',
  query,
  emptyMessage,
  eliminando = false,
  editando = false,
  onSeleccionarFactura,
}: ListaFacturasProps) {
  const { data, isLoading, error } = query;

  if (isLoading)
    return (
      <View style={{ marginVertical: 12, alignSelf: 'stretch' }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ActivityIndicator size="small" color="#2edbd1" />
      </View>
    );
  if (error)
    return (
      <View style={{ marginVertical: 12, alignSelf: 'stretch' }}>
        <Text style={{ color: '#ff5252' }}>
          Error cargando facturas: {error.message}
        </Text>
      </View>
    );

  return (
    <View style={{ marginBottom: 10, alignSelf: 'stretch', width: '100%' }}>
      <FlatList
        data={data}
        renderItem={({ item }) =>
          onSeleccionarFactura ? (
            <TouchableOpacity onPress={() => onSeleccionarFactura(item)} activeOpacity={0.7}>
              <FacturaItem factura={item} />
            </TouchableOpacity>
          ) : (
            <FacturaItem factura={item} />
          )
        }
        keyExtractor={item => String(item.numero_factura)}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center' }}>
            {emptyMessage || 'No hay facturas'}
          </Text>
        }
        contentContainerStyle={{ flexGrow: 1, width: '100%' }}
        style={{ width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4bc1be',
    marginTop: 24,
    marginBottom: 8,
  },
});
