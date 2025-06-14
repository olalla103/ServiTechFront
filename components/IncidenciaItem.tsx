import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Incidencia } from '../types/incidencia';

export default function IncidenciaItem({ incidencia }: { incidencia: Incidencia }) {
  const router = useRouter();

  return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push(`/incidencias/${incidencia.id}`)}
        activeOpacity={0.6}
      >
        <Text style={styles.itemTitle}>{incidencia.descripcion}</Text>
        <Text style={styles.itemDesc}>{incidencia.direccion}</Text>
        
      </TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  iconoFlecha: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    padding: 8,
  },
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
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  itemDesc: {
    color: '#555',
    fontSize: 15,
  }
});
