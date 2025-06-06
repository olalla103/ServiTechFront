import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Factura } from '../types/factura';

export default function FacturaItem({ factura }: { factura: Factura }) {
  // Cálculo del precio total de la factura
  const precio = (factura.cantidad_total ?? 0) + (factura.cantidad_adicional ?? 0) + (factura.IVA ?? 0);

  return (
    <View style={styles.item}>
      {/* Cabecera con icono */}
      <View style={styles.headerRow}>
        <Ionicons name="document-text-outline" size={24} color="#11aab0" style={{ marginRight: 8 }} />
        <Text style={styles.itemTitle}>
          {factura.incidencia_nombre || `Factura #${factura.numero_factura}`}
        </Text>
      </View>

      {/* Fila con fecha y (opcional) cliente */}
      <View style={styles.subRow}>
        <Text style={styles.fecha}>
          {factura.fecha_emision ? new Date(factura.fecha_emision).toLocaleDateString() : ''}
        </Text>
        {/* Si quieres cliente aquí, descomenta: */}
        {/* <Text style={styles.cliente}>{factura.cliente_nombre}</Text> */}
      </View>

      {/* Precio destacado */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalPrecio}>{precio.toFixed(2)} €</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 13,
    shadowColor: '#00b2b7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    borderLeftWidth: 6,
    borderLeftColor: '#11aab0',
    marginHorizontal: 7,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    gap: 4,
  },
  itemTitle: {
    fontWeight: '700',
    fontSize: 17,
    color: '#222',
    flexShrink: 1,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  fecha: {
    fontSize: 13,
    color: '#8fb3b6',
    fontWeight: '600',
    marginRight: 8,
  },
  cliente: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 14,
    color: '#86a8ad',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  totalPrecio: {
    fontSize: 19,
    color: '#11aab0',
    fontWeight: '900',
    letterSpacing: 1,
  },
});