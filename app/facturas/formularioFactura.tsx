import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { crearFactura } from '../../utils/handler_facturas';
import { getProductos } from '../../utils/handler_productos';

type Producto = { id: number; nombre: string; precio: number };
type ProductoSeleccionado = { producto_id: number; cantidad: number };

export default function FormularioFactura() {
  const { incidenciaId, clienteId, tecnicoId } = useLocalSearchParams();
  const incidencia_id = Number(incidenciaId);
  const cliente_id = Number(clienteId);
  const tecnico_id = Number(tecnicoId);


  const { data: productosLista, isLoading, error } = useQuery({
    queryKey: ['productos'],
    queryFn: getProductos,
  });

  const [productos, setProductos] = useState<ProductoSeleccionado[]>([]);
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [open,setOpen]=useState(false);

  // Inicializar con un producto
  useEffect(() => {
    if (productosLista && productos.length === 0 && productosLista.length > 0) {
      setProductos([{ producto_id: productosLista[0].id, cantidad: 1 }]);
    }
  }, [productosLista]);

  const handleChangeProducto = (idx: number, producto_id: number | null) => {
    if (producto_id === null) return;
    setProductos(prev =>
      prev.map((p, i) => (i === idx ? { ...p, producto_id } : p))
    );
  };

  const handleChangeCantidad = (idx: number, cantidad: number) => {
    setProductos(prev =>
      prev.map((p, i) => (i === idx ? { ...p, cantidad: Math.max(1, cantidad) } : p))
    );
  };

  const handleAddProducto = () => {
    if (!productosLista || productosLista.length === 0) return;
    // Por defecto, pon el primer producto NO seleccionado
    const usados = productos.map(p => p.producto_id);
    const libres = productosLista.filter((p:Producto) => !usados.includes(p.id));
    if (libres.length === 0) return;
    setProductos([...productos, { producto_id: libres[0].id, cantidad: 1 }]);
  };

  const handleRemoveProducto = (idx: number) => {
    setProductos(productos.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const datos = {
  incidencia_id,
  cliente_id,
  tecnico_id,
  productos: productos.filter(p => p.cantidad > 0),
  observaciones: observaciones.trim(),
};
      await crearFactura(datos);
      Alert.alert("Factura creada", "La factura se ha generado correctamente.");
      router.back();
    } catch (err) {
      Alert.alert("Error", "No se pudo crear la factura.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color="#2edbd1" />
      </View>
    );
  }
  if (error || !productosLista) {
    return (
      <View style={styles.screen}>
        <Text style={{ color: '#ff5252', textAlign: 'center', marginTop: 40 }}>Error cargando la lista de productos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.titulo}>Crear factura</Text>
      <Text style={styles.label}>Productos utilizados</Text>
      {productos.map((prod, idx) => {
        // Para el dropdown: Solo productos no usados por otro campo, excepto el actual
        const usados = productos.map((p, i) => i !== idx && p.producto_id).filter(Boolean);
        const items = productosLista
          .filter((p: Producto) => p.id === prod.producto_id || !usados.includes(p.id))
          .map((p: Producto) => ({
            label: p.nombre,
            value: p.id,
          }));

        return (
          <View key={idx} style={styles.productoRow}>
            <View style={{ flex: 1, zIndex: 999 - idx }}>
       
<DropDownPicker
  open={open}
  setOpen={setOpen}
  value={prod.producto_id}
  setValue={(callback: (curr: number | null) => number | null) => {
    const newValue = callback(prod.producto_id);
    handleChangeProducto(idx, newValue);
  }}
  items={productosLista
    .filter(
      (p: Producto) =>
        p.id === prod.producto_id ||
        !productos.some((seleccionado, i2) => i2 !== idx && seleccionado.producto_id === p.id)
    )
    .map((p: Producto) => ({
      label: p.nombre,
      value: p.id,
    }))}
  containerStyle={{ minHeight: 40, zIndex: 999 - idx }}
  style={{ backgroundColor: '#fff', borderRadius: 8 }}
  dropDownContainerStyle={{ borderRadius: 8, zIndex: 999 - idx }}
/>

            </View>
            <View style={styles.cantidadBox}>
              <Text>Cant:</Text>
              <TextInput
                keyboardType="number-pad"
                style={styles.inputCantidad}
                value={String(prod.cantidad)}
                onChangeText={txt => handleChangeCantidad(idx, Number(txt))}
              />
            </View>
            {productos.length > 1 && (
              <TouchableOpacity onPress={() => handleRemoveProducto(idx)} style={{ marginLeft: 4 }}>
                <Ionicons name="close" size={22} color="#e9445a" />
              </TouchableOpacity>
            )}
          </View>
        );
      })}
      <TouchableOpacity style={styles.addProductoBtn} onPress={handleAddProducto}>
        <Ionicons name="add-circle-outline" size={20} color="#2edbd1" />
        <Text style={{ color: '#2edbd1', fontWeight: '600', marginLeft: 2 }}>Añadir producto</Text>
      </TouchableOpacity>

      <Text style={[styles.label, { marginTop: 10 }]}>Observaciones</Text>
      <TextInput
        style={styles.textarea}
        value={observaciones}
        onChangeText={setObservaciones}
        placeholder="Observaciones adicionales..."
        multiline
      />

      <View style={styles.rowBtn}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#eee' }]} onPress={() => router.back()} disabled={loading}>
          <Text style={{ color: '#888', fontWeight: '700' }}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#2edbd1' }]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>Guardar factura</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f7f9fb',
    paddingHorizontal: 14,
    paddingTop: 55,
  },
  titulo: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#189',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 10,
  },
  label: {
    color: '#444',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 7,
    marginTop: 7,
  },
  productoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 4,
    zIndex: 999, // importante para DropDownPicker
  },
  cantidadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 2,
    gap: 3,
  },
  inputCantidad: {
    width: 36,
    backgroundColor: '#f4f4f4',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginLeft: 4,
    textAlign: 'center',
    fontWeight: '700',
  },
  addProductoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 4,
    marginLeft: 2,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 7,
    backgroundColor: '#e6f8f7',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 7,
    minHeight: 46,
    paddingHorizontal: 8,
    paddingVertical: 7,
    marginBottom: 10,
    fontSize: 14,
    color: '#222',
    backgroundColor: '#f9f9f9',
  },
  rowBtn: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 2,
  },
  btn: {
    paddingVertical: 11,
    paddingHorizontal: 26,
    borderRadius: 9,
    elevation: 2,
  },
});
