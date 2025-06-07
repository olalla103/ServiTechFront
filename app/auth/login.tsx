import { Ionicons } from "@expo/vector-icons";
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

type TipoUsuario = "autonomo" | "admin_empresa" | "tecnico" | "cliente";
function getTipoUsuario(user: any): TipoUsuario {
  if (user?.admin_empresa && !!user.especialidad) return "autonomo";
  if (user?.admin_empresa && !user.especialidad) return "admin_empresa";
  if (!user?.admin_empresa && !!user.especialidad) return "tecnico";
  return "cliente";
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();

  const handleEmailLogin = async () => {
  setError(null);

  // VALIDACIONES: campos obligatorios
  if (!email.trim() || !pass.trim()) {
    setError('Por favor, rellena todos los campos.');
    return;
  }

  // Si quieres también una validación de email básico:
  if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    setError('Introduce un email válido.');
    return;
  }

  try {
    // Aquí, login debe devolver el usuario o guardarlo en contexto
    const user = await login(email, pass);
    const tipo = getTipoUsuario(user);

    if (tipo === "autonomo") {
      router.replace('/autonomo');
    } else if (tipo === "admin_empresa") {
      router.replace('/autonomo');
    } else if (tipo === "tecnico") {
      router.replace('/autonomo');
    } else if (tipo === "cliente") {
      router.replace('/usuarioCliente');
    } else {
      console.log("No ha iniciado sesión con ningún usuario.");
    }
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
            {/* Campo contraseña con icono de ojo */}
            <View style={styles.inputPasswordContainer}>
              <TextInput
                value={pass}
                onChangeText={setPass}
                placeholder="Contraseña"
                placeholderTextColor="#fff"
                secureTextEntry={!mostrarPass}
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
              />
              <TouchableOpacity onPress={() => setMostrarPass(!mostrarPass)}>
                <Ionicons
                  name={mostrarPass ? "eye-off" : "eye"}
                  size={22}
                  color="#fff"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Botón de "Olvidé mi contraseña" */}
            <TouchableOpacity onPress={() => router.push('/auth/cambiarPassword')}>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
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
    paddingBottom: 50,
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
  forgotPasswordText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 0,
    textAlign: 'center',
    textDecorationLine: 'underline',
    letterSpacing: 0.3,
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
  inputPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderRadius: 24,
    paddingRight: 8,
    shadowColor: '#0006',
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.25,
  },
  eyeIcon: {
    paddingHorizontal: 6,
    paddingVertical: 8,
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
