import { useAuth } from '@/components/AuthProvider';
import * as Google from 'expo-auth-session/providers/google';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import Boton from '../../components/interfazusuario/boton';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { login, loginWithEmail, loading: authLoading } = useAuth();
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: 'cliente' | 'tecnico' }>();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Configura Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '<TU_EXPO_CLIENT_ID>',
    iosClientId: '<TU_IOS_CLIENT_ID>',
    androidClientId: '<TU_ANDROID_CLIENT_ID>',
    webClientId: '<TU_WEB_CLIENT_ID>',
  });

  // Maneja respuesta Google
  const loginWithFirebaseToken = React.useCallback(
  async (idToken: string, selectedRole: 'cliente' | 'tecnico') => {
    try {
      await login(idToken, selectedRole);
      router.replace('/');
    } catch (e: any) {
      setError(e.message);
    }
  },
  [login, router]  // aquí solo pones lo que usa internamente
);

useEffect(() => {
  if (response?.type === 'success' && role) {
    const { authentication } = response;
    if (authentication?.idToken) {
      loginWithFirebaseToken(authentication.idToken, role);
    }
  }
}, [response, role, loginWithFirebaseToken]);
  

  const handleEmailLogin = async () => {
    if (!role) return;
    try {
      setError(null);
      await loginWithEmail(email, pass, role);
      router.replace('/');
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (authLoading) return <ActivityIndicator style={styles.center} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión como {role}</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Botón Google */}
      <Boton
        titulo="Continuar con Google"
        onPress={() => promptAsync({ showInRecents: true })}
        disabled={!request || !role}
      />

      <Text style={styles.or}>— o con email —</Text>

      {/* Formulario email/password */}
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
      <Boton titulo="Entrar" onPress={handleEmailLogin} disabled={!role} />

      <Boton
  titulo="Registrarme"
  onPress={() =>
    router.push({
      pathname: '/auth/register',
      params: { role },
    })
  }
/>

    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  or: { textAlign: 'center', marginVertical: 12, color: '#666' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  error: { color: 'red', textAlign: 'center', marginBottom: 12 },
});
