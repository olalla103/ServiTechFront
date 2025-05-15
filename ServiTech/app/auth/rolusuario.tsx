// app/(auth)/role.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Boton from '../../components/interfazusuario/boton';

export default function RoleScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Boton
        titulo="Soy Cliente"
        onPress={() => router.push({ pathname: '/auth/login', params: { role: 'cliente' } })}
      />
      <Boton
        titulo="Soy Técnico"
        onPress={() => router.push({ pathname: '/auth/login', params: { role: 'tecnico' } })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
