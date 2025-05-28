import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Fondo from '../../components/fondo'; // Ajusta la ruta si es necesario
import { useAuth } from '../../context/AuthProvider';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();



  const handleEmailLogin = async () => {
    setError(null);
    try {
      await login(email, pass); // <-- ¡Debe llamar a login del contexto!
      router.replace('/autonomo');
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
    }
  };

  return (
    <Fondo>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.centered}>
          {/* Logo o ilustración */}
          <Text style={styles.logo}>🛠️</Text>

          {/* Título */}
          <Text style={styles.title}>¡Bienvenido a ServiTech!</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          {/* Inputs */}
          <View style={styles.inputContainer}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Correo electrónico"
              placeholderTextColor="#fff"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              value={pass}
              onChangeText={setPass}
              placeholder="Contraseña"
              placeholderTextColor="#fff"
              secureTextEntry
              style={styles.input}
            />
          </View>

          {/* Error */}
          {error && (
            <Text style={styles.error}>
              {error.toLowerCase().includes('credenciales')
                ? '¡Oops! Email o contraseña incorrectos.'
                : error}
            </Text>
          )}

          {/* Botón login */}
          <TouchableOpacity style={styles.button} onPress={handleEmailLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Espaciado visual (como dos <br />) */}
          <View style={{ height: 22 }} />
          <View style={{ height: 22 }} />

          {/* Botón de registro */}
          <TouchableOpacity style={styles.registerButton} onPress={() => router.push('/auth/register')}>
            <Text style={styles.registerButtonText}>¿No tienes cuenta? ¡Regístrate!</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Fondo>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
    textShadowColor: '#0006',
    textShadowOffset: { width: 2, height: 4 },
    textShadowRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
    textAlign: 'center',
    textShadowColor: '#0003',
    textShadowOffset: { width: 2, height: 4 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#e3e3e3',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 18,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.20)',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 10,
    fontSize: 16,
    shadowColor: '#0006',
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.25,
  },
  button: {
    backgroundColor: '#2edbd1',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 80,
    alignItems: 'center',
    marginTop: 16,
    elevation: 2,
    shadowColor: '#0006',
    shadowOffset: { width: 2, height: 6 },
    shadowRadius: 12,
    shadowOpacity: 0.25,
    transform: [{ scale: 1 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  error: {
    color: '#ff5454',
    marginBottom: 12,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 6,
    paddingHorizontal: 10,
  },
  registerButton: {
    backgroundColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 44,
    borderRadius: 22,
    shadowColor: '#0004',
    shadowOffset: { width: 1, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 0.14,
    elevation: 4,
  },
  registerButtonText: {
    color: '#2edbd1',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
