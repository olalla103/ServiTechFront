import { Factura } from '@/types/factura';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@react-navigation/elements';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useNavigation } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import ListaFacturas from '../../components/ListaFacturas';
import { useAuth } from '../../context/AuthProvider';
import { eliminarFactura, getFacturasResueltasPorTecnico } from '../../utils/handler_facturas';

export default function PantallaFacturas() {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const [eliminando, setEliminando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(false);
  const navigation = useNavigation();

  const [facturaAEliminar, setFacturaAEliminar] = useState<Factura | null>(null);
  const queryClient = useQueryClient();

  // Consulta de facturas resueltas para el técnico
  const facturasQuery = useQuery<Factura[], Error>({
    queryKey: ['facturas-tecnico', user?.id],
    queryFn: () => getFacturasResueltasPorTecnico(user.id),
    enabled: !!user?.id,
  });

  

  const handleEliminarFactura = async () => {
    if (facturaAEliminar) {
      try {
        await eliminarFactura(facturaAEliminar.numero_factura);
        setModalVisible(false);
        setEliminando(false);
        setFacturaAEliminar(null);
        queryClient.invalidateQueries({ queryKey: ['facturas-tecnico'] });
      } catch (error) {
        alert("Error eliminando la factura");
      }
    }
  };

  useEffect(() => {
    if (showMenu) setShouldRenderMenu(true);
    if (!showMenu && shouldRenderMenu) {
      const timeout = setTimeout(() => {
        setShouldRenderMenu(false);
        setMenuHeight(0);
      }, 450);
      return () => clearTimeout(timeout);
    }
  }, [showMenu, shouldRenderMenu]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconoFlecha}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={28} color="#2edbd1" />
      </TouchableOpacity>
      <Text style={styles.headerFacturas}>Facturas</Text>
      <Text style={styles.subHeader}>Pulsa en una factura para ver el detalle</Text>
      <TouchableOpacity
        style={styles.gearIcon}
        onPress={() => setShowMenu(prev => !prev)}
        activeOpacity={0.8}
      >
        <Ionicons name="settings-sharp" size={28} color="#2edbd1" />
      </TouchableOpacity>
      <View style={styles.card}>
        {/* Menú animado */}
        
        {shouldRenderMenu && (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: showMenu ? 1 : 0,
              scale: showMenu ? 1 : 0.95,
            }}
            transition={{
              type: 'timing',
              duration: 450,
              delay: showMenu ? 0 : 100,
            }}
            style={[
              styles.menu,
              { height: showMenu ? undefined : 0, overflow: 'hidden' }
            ]}
            pointerEvents={showMenu ? 'auto' : 'none'}
            onLayout={event => setMenuHeight(event.nativeEvent.layout.height)}
          >
            <TouchableOpacity
              style={styles.menuButtonAniadir}
              // onPress={() => { router.push('/facturas/formularioFactura'); }}
            >
              <Text style={styles.menuButtonText}>Añadir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButtonEditar}
              onPress={() => setEditando(prev => !prev)}
            >
              <Text style={styles.menuButtonText}>
                {editando ? 'SALIR' : 'Editar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButtonEliminar}
              onPress={() => setEliminando(prev => !prev)}
            >
              <Text style={styles.menuButtonText}>
                {eliminando ? 'SALIR' : 'Eliminar'}
              </Text>
            </TouchableOpacity>
          </MotiView>
        )}
     
        {/* Lista animada */}
        <MotiView
          animate={{ marginTop: showMenu ? menuHeight : 25 }}
          transition={{
            type: 'timing',
            duration: 400,
          }}
          style={{ flex: 1 }}
        >
          <ListaFacturas
            query={facturasQuery}
            emptyMessage="No hay facturas para este técnico."
            eliminando={eliminando}
            editando={editando}
            onSeleccionarFactura={(factura: Factura) => {
              if (eliminando) {
                setFacturaAEliminar(factura);
                setModalVisible(true);
              } else if (editando) {
                router.push({
                  pathname: '/facturas/editarFactura',
                  params: { numero_factura: factura.numero_factura.toString() }
                });
                setEditando(false);
              } else {
                // Aquí aseguramos la navegación correcta al detalle
                router.push(`/facturas/${factura.numero_factura}`);
              }
            }}
          />
        </MotiView>
        

        {/* Modal de confirmación */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setEliminando(false);
            setFacturaAEliminar(null);
          }}
        >
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <Text style={modalStyles.modalText}>
                ¿Estás seguro de que quieres eliminar la factura #{facturaAEliminar?.numero_factura}?
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 180 }}>
                <TouchableOpacity
                  style={modalStyles.buttonCancelar}
                  onPress={() => {
                    setModalVisible(false);
                    setEliminando(false);
                    setFacturaAEliminar(null);
                  }}
                >
                  <Text style={modalStyles.textStyle}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={modalStyles.buttonEliminar}
                  onPress={handleEliminarFactura}
                >
                  <Text style={modalStyles.textStyle}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... igual que los estilos que pasaste, pero cambia nombres a headerFacturas y demás si quieres
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 90,
    alignItems: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 0,
    marginTop: 0,
    paddingTop: 18,
    paddingBottom: 4,
    paddingHorizontal: 16,
    shadowColor: 'transparent',
    elevation: 0,
    alignItems: 'center',
  },
  headerFacturas: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1bcfc5',
    marginBottom: 2,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 10,
  },
  subHeader: {
    fontSize: 15,
    color: '#7bd9d5',
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  gearIcon: {
    position: 'absolute',
    top: 50,
    right: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    elevation: 4,
  },
  iconoFlecha: {
    position: 'absolute',
    top: 50,
    left: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 4,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
    marginTop: 10,
  },
  menuButtonAniadir: {
    backgroundColor: '#B1CFB7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 14,
    marginHorizontal: 4,
    shadowColor: '#0001',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 1,
  },
  menuButtonEditar: {
    backgroundColor: '#EFD9AA',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 14,
    marginHorizontal: 4,
    shadowColor: '#0001',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 1,
  },
  menuButtonEliminar: {
    backgroundColor: '#EFBA93',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 14,
    marginHorizontal: 4,
    shadowColor: '#0001',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 1,
  },
  menuButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)'
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  modalText: {
    marginBottom: 22,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  buttonCancelar: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginRight: 10
  },
  buttonEliminar: {
    backgroundColor: '#e9445a',
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    fontWeight: 'bold',
    color: '#fff'
  },
});

