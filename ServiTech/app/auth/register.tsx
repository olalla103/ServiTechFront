// app/(auth)/register.tsx
import { useAuth } from '@/components/AuthProvider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Boton from '../../components/interfazusuario/boton';

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: 'cliente' | 'tecnico' }>();
  const { registerWithEmail, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string|null>(null);

  const handleRegister = async () => {
    try {
      setError(null);
      await registerWithEmail({ email, pass, name, role });
      router.replace('/');
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) return <Boton titulo="Cargando..." onPress={() => {}} disabled />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro como {role}</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
      />

      <Boton titulo="Crear cuenta" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding:16,
    justifyContent:'center',
  },
  title: { fontSize:20, fontWeight:'bold', marginBottom:24, textAlign:'center' },
  input: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:8,
    padding:12,
    marginBottom:12,
  },
  error: { color:'red', textAlign:'center', marginBottom:12 },
});
