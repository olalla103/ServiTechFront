import { Usuario } from '@/types/usuario';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@react-navigation/elements';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useFocusEffect } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import ListaClientes from '../../components/ListaClientes';
import { useAuth } from '../../context/AuthProvider';
import { eliminarUsuario, getClientesPorEmpresa } from '../../utils/handler_usuarios';

export default function PantallaClientes() {
  const { user } = useAuth();
  console.log("👤 Técnico en pantalla clientes:", user);
  const [showMenu, setShowMenu] = useState(false);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const [eliminando, setEliminando] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState<Usuario | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(false);

  const queryClient = useQueryClient();

  const handleEliminarUsuario = async () => {
    if (clienteAEliminar) {
      try {
        await eliminarUsuario(clienteAEliminar.id);
        setModalVisible(false);
        setEliminando(false);
        setClienteAEliminar(null);
        queryClient.invalidateQueries({ queryKey: ['clientes-empresa'] });
      } catch (error) {
        alert("Error eliminando el usuario");
        alert(error);
      }
    }
  };

  // Control de animación del menú
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

  const clientesQuery = useQuery({
    queryKey: ['clientes-empresa', user?.empresa_id],
    queryFn: () => getClientesPorEmpresa(user.empresa_id),
    enabled: !!user?.empresa_id,
  });

  useFocusEffect(
    React.useCallback(() => {
      clientesQuery.refetch();
    }, [clientesQuery])
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
       style={styles.iconoFlecha}
       onPress={() => router.push('/autonomo')}
       activeOpacity={0.8}
     >
       <Ionicons name="arrow-back" size={28} color="#2edbd1" />
     </TouchableOpacity>
      <Text style={styles.headerIncidencias}>Clientes</Text>
    <Text style={styles.subHeader}>Pulsa en un cliente para ver más opciones</Text>
      <TouchableOpacity
        style={styles.gearIcon}
        onPress={() => setShowMenu(prev => !prev)}
        activeOpacity={0.8}
      >
        <Ionicons name="settings-sharp" size={28} color="#2edbd1" />
      </TouchableOpacity>
      <View style={styles.card}>
    

      {/* Menú animado de botones */}
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
            onPress={() => { router.push('/clientes/formularioCliente'); }}
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
        <ListaClientes
          query={clientesQuery}
          emptyMessage="No hay clientes para esta empresa."
          eliminando={eliminando}
          editando={editando}
          onSeleccionarCliente={cliente => {
            if (eliminando) {
              setClienteAEliminar(cliente);
              setModalVisible(true);
            } else if (editando) {
              router.push({
                pathname: '/clientes/pantallaClienteEditar',
                params: { clienteEmail: cliente.email }
              });
              setEditando(false);
            } else {
              // Solo mostrar detalle
              router.push({ pathname: '/clientes/[id]', params: { id: cliente.id } });
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
          setClienteAEliminar(null);
        }}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>
              ¿Estás seguro de que quieres eliminar a {clienteAEliminar?.nombre} {clienteAEliminar?.apellido1}?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 180 }}>
              <TouchableOpacity
                style={modalStyles.buttonCancelar}
                onPress={() => {
                  setModalVisible(false);
                  setEliminando(false);
                  setClienteAEliminar(null);
                }}
              >
                <Text style={modalStyles.textStyle}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.buttonEliminar}
                onPress={handleEliminarUsuario}
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
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // gris suave uniforme
    paddingTop: 90,
    alignItems: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#f8fafc', // ¡el mismo gris!
    borderRadius: 0,             // sin bordes redondeados
    marginTop: 0,
    paddingTop: 18,
    paddingBottom: 4,
    paddingHorizontal: 16,
    shadowColor: 'transparent',  // sin sombra
    elevation: 0,
    alignItems: 'center',
  },
  headerIncidencias: {
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
    backgroundColor: '#f8fafc', // igual al fondo
    borderRadius: 20,
    elevation: 4,
  },
  iconoFlecha: {
    position: 'absolute',
    top: 50,
    left: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#fff', // si prefieres, ponle gris también
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