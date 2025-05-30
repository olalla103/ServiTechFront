import { Ionicons } from '@expo/vector-icons';
import { Text } from '@react-navigation/elements';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ListaClientes from '../../components/ListaClientes';
import { useAuth } from '../../context/AuthProvider';
import { getClientesPorEmpresa } from '../../utils/handler_usuarios';

export default function PantallaClientes() {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const clientesQuery = useQuery({
    queryKey: ['clientes-empresa', user?.empresa_id],
    queryFn: () => getClientesPorEmpresa(user.empresa_id),
    enabled: !!user?.empresa_id,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
  style={styles.gearIcon}
  onPress={() => setShowMenu(prev => !prev)}
  activeOpacity={0.8}
>
  <Ionicons name="settings-sharp" size={28} color="#2edbd1" />
</TouchableOpacity>
      <Text style={styles.headerIncidencias}>Lista de clientes, pulse en el cliente para obtener más información</Text>
       {/* Menú de botones */}
    {showMenu && (
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuButton} onPress={() => {/* lógica añadir */}}>
          <Text style={styles.menuButtonText}>Añadir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => {/* lógica editar */}}>
          <Text style={styles.menuButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => {/* lógica eliminar */}}>
          <Text style={styles.menuButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    )}
      <ListaClientes
        query={clientesQuery}
        emptyMessage="No hay clientes para esta empresa."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  headerIncidencias: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2edbd1',
    marginBottom: 35,
    marginTop: 4,
    textAlign: 'center',
  },
  gearIcon: {
    position: 'absolute',
    top: 28,
    right: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    elevation: 4,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 12,
  },
  menuButton: {
    backgroundColor: '#fff',
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
    color: '#2edbd1',
    fontWeight: '700',
    fontSize: 15,
  },
});