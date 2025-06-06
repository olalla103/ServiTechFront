import { Factura } from '@/types/factura';
import { ProductoFactura } from '@/types/productofactura';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { actualizarFactura } from '../../utils/handler_facturas';

type Props = {
  onClose: () => void;
  facturaEditar: Factura;
  productosUsados: ProductoFactura[];
};

export default function FormularioFacturaEdicion({ onClose, facturaEditar, productosUsados }: Props) {
  const [cantidadTotal, setCantidadTotal] = useState(String(facturaEditar.cantidad_total || ''));
  const [cantidadAdicional, setCantidadAdicional] = useState(String(facturaEditar.cantidad_adicional || ''));
  const [IVA, setIVA] = useState(String(facturaEditar.IVA || ''));
  const [observaciones, setObservaciones] = useState(facturaEditar.observaciones || '');
  // Si tus productos son un array, puedes editar así:
  const [productos, setProductos] = useState<ProductoFactura[]>(productosUsados);

  // Puedes crear funciones para añadir/eliminar productos aquí

  const handleGuardar = async () => {
    try {
      await actualizarFactura(facturaEditar.numero_factura, {
        cantidad_total: parseFloat(cantidadTotal),
        cantidad_adicional: parseFloat(cantidadAdicional),
        IVA: parseFloat(IVA),
        observaciones,
        productos: productos.map(p => ({
          id: p.id,
          cantidad: p.cantidad, // y otros campos que edites
        })),
      });
      Toast.show({
        type: 'success',
        text1: 'Factura actualizada',
        position: 'bottom'
      });
      onClose();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar factura',
        text2: err instanceof Error ? err.message : '',
        position: 'bottom'
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Factura #{facturaEditar.numero_factura}</Text>
      <TextInput
        placeholder="Cantidad Total"
        value={cantidadTotal}
        onChangeText={setCantidadTotal}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Cantidad Adicional"
        value={cantidadAdicional}
        onChangeText={setCantidadAdicional}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="IVA"
        value={IVA}
        onChangeText={setIVA}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Observaciones"
        value={observaciones}
        onChangeText={setObservaciones}
        style={styles.input}
      />

      {/* Lista desplegable de productos aquí */}

      <View style={styles.botonera}>
        <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar}>
          <Ionicons name="save" size={22} color="#fff" />
          <Text style={styles.btnGuardarTxt}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnCancelar} onPress={onClose}>
          <Ionicons name="close-circle" size={22} color="#888" />
          <Text style={styles.btnCancelarTxt}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 140,
    backgroundColor: "#f8f9fb",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 70,
    color: '#00b2b7',
    letterSpacing: 1.1
  },
  input: {
    backgroundColor: '#f6f8fb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e6f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2
  },
  seccionDirecciones: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 12,
    color: '#1fc7b6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dirBox: {
    backgroundColor: '#e8f7fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
    shadowColor: '#1fc7b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    borderWidth: 1,
    borderColor: '#d2e6ed'
  },
  dirHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dirTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: "#00b2b7",
  },
  dirDeleteBtn: {
    padding: 4,
    marginLeft: 8,
  },
  inputDir: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e6e6e6'
  },
  btnAgregar: {
    flexDirection: 'row',
    backgroundColor: '#00b2b7',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 1,
    shadowColor: '#0002',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
  },
  btnAgregarTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  botonera: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f8f9fb",
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: '#d2e6ed',
    borderTopWidth: 1,
    zIndex: 5,
  },
  btnGuardar: {
    backgroundColor: '#2edbd1',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  btnGuardarTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginLeft: 8,
  },
  btnCancelar: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  btnCancelarTxt: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 17,
    marginLeft: 8,
  },
  iconoFlecha: {
    position: 'absolute',
    top: 50,
    left: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#f8f9fb',
    borderRadius: 20,
    elevation: 4
  },
});

