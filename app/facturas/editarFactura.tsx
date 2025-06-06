// app/facturas/editarFactura.tsx

import { getProductosDeFactura } from '@/utils/handler_facturaproducto';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { getFacturaPorId } from '../../utils/handler_facturas';
import FormularioFacturaEdicion from './formularioFacturaEdit';

export default function PantallaFacturaEditar() {
  const { numero_factura } = useLocalSearchParams();
  const router = useRouter();
  const facturaNum = Number(numero_factura);

  const { data: factura, isLoading, error } = useQuery({
    queryKey: ['factura', facturaNum],
    queryFn: () => getFacturaPorId(facturaNum),
    enabled: !!facturaNum,
  });

  const { data: productos, isLoading: loadingProd } = useQuery({
    queryKey: ['productos-factura', facturaNum],
    queryFn: () => getProductosDeFactura(facturaNum),
    enabled: !!facturaNum,
  });

  if (isLoading || loadingProd) return <ActivityIndicator size="large" color="#2edbd1" style={{ marginTop: 60 }} />;
  if (error) return <Text style={{ margin: 30, color: 'red' }}>Error al cargar la factura</Text>;
  if (!factura) return <Text style={{ margin: 30 }}>No se encontró la factura</Text>;

  return (
    <FormularioFacturaEdicion
      onClose={() => router.back()}
      facturaEditar={factura}
      productosUsados={productos || []}
    />
  );
}
