import { ProductoFactura } from '@/types/productofactura';
import { descargarYCompartirFactura, getFacturaPorId } from '@/utils/handler_facturas';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUsuarioPorId } from '../../utils/handler_usuarios';

export default function DetalleFacturaScreen() {
  const { id } = useLocalSearchParams();
  const facturaId = Number(id);

  // Cargamos la factura (incluye productos)
  const { data: factura, isLoading, error } = useQuery({
    queryKey: ['factura', facturaId],
    queryFn: () => getFacturaPorId(facturaId),
    enabled: !!facturaId,
  });

  // Opcional: cargar cliente/tecnico (solo para mostrar nombres)
  const clienteQuery = useQuery({
    queryKey: ['cliente', factura?.cliente_id],
    queryFn: () => getUsuarioPorId(factura?.cliente_id!),
    enabled: !!factura?.cliente_id,
  });

  const tecnicoQuery = useQuery({
    queryKey: ['tecnico', factura?.tecnico_id],
    queryFn: () => getUsuarioPorId(factura?.tecnico_id!),
    enabled: !!factura?.tecnico_id,
  });

  const [descargando, setDescargando] = useState(false);

async function handleDescarga() {
  setDescargando(true);
  await descargarYCompartirFactura(factura.numero_factura);
  setDescargando(false);
}
 

  if (isLoading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#47b6a3" />
      </View>
    );
  if (error || !factura)
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#ff5252" }}>Error cargando la factura.</Text>
      </View>
    );

  // Totales
  const base = factura.cantidad_total ?? 0;
  const adicional = factura.cantidad_adicional ?? 0;
  const iva = factura.IVA ?? 0;
  const total = base + adicional + iva;

  return (
    <View style={styles.background}>
      {/* Barra superior con flecha e icono de descarga */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.iconoFlecha}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={28} color="#2edbd1" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
  style={styles.iconoDescarga}
  onPress={handleDescarga}
  activeOpacity={0.1}
  disabled={descargando}
>
  {descargando ? (
    <ActivityIndicator size={21} color="#2edbd1" />
  ) : (
    <Ionicons name="download-outline" size={29} color="#2edbd1" />
  )}
</TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          {/* Cabecera */}
          <View style={styles.headerRow}>
            <Text style={styles.facturaNumber}>Factura #{factura.numero_factura}</Text>
            <Text style={styles.fecha}>{new Date(factura.fecha_emision).toLocaleDateString()}</Text>
          </View>
          {/* Cliente y técnico */}
          <View style={styles.clienteTecRow}>
            <View>
              <Text style={styles.labelSmall}>Cliente:</Text>
              <Text style={styles.valueBig}>
                {clienteQuery.data
                  ? `${clienteQuery.data.nombre} ${clienteQuery.data.apellido1}`
                  : `ID: ${factura.cliente_id}`}
              </Text>
            </View>
            <View>
              <Text style={styles.labelSmall}>Técnico:</Text>
              <Text style={styles.valueBig}>
                {tecnicoQuery.data
                  ? `${tecnicoQuery.data.nombre} ${tecnicoQuery.data.apellido1}`
                  : `ID: ${factura.tecnico_id}`}
              </Text>
            </View>
          </View>
          {/* Productos */}
          <View style={styles.tablaHeader}>
            <Text style={[styles.tablaCell, { flex: 2 }]}>Producto</Text>
            <Text style={[styles.tablaCell, { flex: 1, textAlign: 'center' }]}>Cantidad</Text>
            <Text style={[styles.tablaCell, { flex: 1, textAlign: 'right' }]}>Precio</Text>
          </View>
          {factura.productos?.length ? (
            factura.productos.map((prod: ProductoFactura, idx: number) => (
              <View key={prod.id ?? idx} style={styles.tablaRow}>
                <Text style={[styles.tablaCell, { flex: 2 }]}>{prod.nombre}</Text>
                <Text style={[styles.tablaCell, { flex: 1, textAlign: 'center' }]}>{prod.cantidad}</Text>
                <Text style={[styles.tablaCell, { flex: 1, textAlign: 'right' }]}>{prod.precio_unitario.toFixed(2)} €</Text>
              </View>
            ))
          ) : (
            <Text>No hay productos en esta factura.</Text>
          )}
          <View style={styles.divider} />
          {/* Desglose de totales */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Base</Text>
            <Text style={styles.totalValue}>{base.toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Productos</Text>
            <Text style={styles.totalValue}>{adicional.toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IVA</Text>
            <Text style={styles.totalValue}>{iva.toFixed(2)} €</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL</Text>
            <Text style={styles.grandTotalValue}>{total.toFixed(2)} €</Text>
          </View>
          {/* Observaciones */}
          {factura.observaciones ? (
            <Text style={styles.observaciones}>Observaciones: {factura.observaciones}</Text>
          ) : null}
          {/* Footer/Marca */}
          <Text style={styles.footer}>ServiTech · Factura generada automáticamente</Text>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 0,
  },
  scrollContainer: {
    paddingTop: 100,
    paddingBottom: 55,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 28,
    marginTop: 18,
    marginBottom: 18,
    width: '96%',
    maxWidth: 420,
    elevation: 4,
    shadowColor: '#0002',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 10,
    backgroundColor: '#f7fafc',
    padding: 8,
    borderRadius: 18,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  facturaNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2b9e8c',
    letterSpacing: 0.7,
  },
  fecha: {
    fontSize: 14,
    color: '#6e6e6e',
    fontWeight: '500',
  },
  clienteTecRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 3,
    gap: 10,
  },
   iconoFlecha: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 4,
  },
  iconoDescarga: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 4,
  },
  labelSmall: {
    fontSize: 12,
    color: '#989898',
    fontWeight: '700',
    marginBottom: 2,
  },
   headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 54,
    marginBottom: 4,
  },
  valueBig: {
    fontSize: 15,
    color: '#2a2a2a',
    fontWeight: '700',
    marginBottom: 2,
  },
  tablaHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 7,
    backgroundColor: '#f7f8fa',
  },
  tablaRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    paddingVertical: 7,
  },
  tablaCell: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    paddingHorizontal: 2,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 14,
    color: '#323232',
    fontWeight: '600',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  grandTotalLabel: {
    fontSize: 16,
    color: '#2b9e8c',
    fontWeight: '900',
    letterSpacing: 1,
  },
  grandTotalValue: {
    fontSize: 16,
    color: '#2b9e8c',
    fontWeight: '900',
  },
  observaciones: {
    marginTop: 14,
    fontSize: 13,
    color: '#7a7a7a',
    fontStyle: 'italic',
    textAlign: 'left',
  },
  footer: {
    marginTop: 22,
    fontSize: 11,
    textAlign: 'center',
    color: '#bcbcbc',
    letterSpacing: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
});

