import { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Incidencia } from '../types/incidencia';
import IncidenciaItem from './IncidenciaItem';

export default function ListaIncidencias({
  title,
  query,
  emptyMessage,
}: {
  title: string;
  query: UseQueryResult<Incidencia[], Error>;
  emptyMessage?: string;
}) {
  const { data, isLoading, error } = query;

  if (isLoading)
    return (
      <View style={{ marginVertical: 12 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ActivityIndicator size="small" color="#2edbd1" />
      </View>
    );
  if (error)
    return (
      <View style={{ marginVertical: 12 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={{ color: '#ff5252' }}>
          Error cargando incidencias: {error.message}
        </Text>
      </View>
    );

   return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <IncidenciaItem incidencia={item} />}
        keyExtractor={item => String(item.id)}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center' }}>
            {emptyMessage || 'No hay incidencias'}
          </Text>
        }
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
