import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Boton from '../../components/interfazusuario/boton';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Aquí veremos el botón */}
      <Boton
        titulo="Usuarios"
        onPress={() => router.push('/explore')}
      />
      <Boton
        titulo="Clientes"
        onPress={() => router.push('/explore')}
      />
      <Boton
        titulo="Artículos"
        onPress={() => router.push('/explore')}
      />
      <Boton
        titulo="Incidencias"
        onPress={() => router.push('/incidencias')}
      />
      <Boton
        titulo="Informes"
        onPress={() => router.push('/explore')}
      />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});