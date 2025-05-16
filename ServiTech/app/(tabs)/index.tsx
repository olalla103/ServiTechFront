import Boton from '@/components/interfazusuario/boton';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/*Pantalla de inicio de la aplicación */}
      <Boton titulo='Login' onPress={()=>router.push('/auth/login')}/>
      {/*Condicional para usar los botones o el login dependiendo
      de si el usuario está registrado*/}
      <Boton titulo='Menú botones' onPress={()=>router.push('/(tabs)/menu')}/>

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