import { cambiarPassword } from "@/utils/handler_usuarios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Fondo from "../../components/fondo";

export default function CambiarPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirmPass, setMostrarConfirmPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setError(null);
    setSuccess(null);

    if (!email || !newPass || !confirmPass) {
      setError("Rellena todos los campos.");
      return;
    }
    if (newPass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
    await cambiarPassword(email, newPass); // <-- LLAMA AL BACKEND
    setSuccess("Contraseña cambiada correctamente.");
    setEmail("");
    setNewPass("");
    setConfirmPass("");
    setTimeout(() => router.replace('/'), 1500); // Vuelve al login tras 1,5s
    } catch (e: any) {
      setError(e?.message || "Hubo un error al cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fondo>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.centered}>
          <Text style={styles.logo}>🔑</Text>
          <Text style={styles.title}>Cambiar contraseña</Text>
          <Text style={styles.subtitle}>Introduce tu email y tu nueva contraseña.</Text>
          
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
            {/* Input nueva contraseña con ojo */}
            <View style={styles.inputPasswordContainer}>
              <TextInput
                value={newPass}
                onChangeText={setNewPass}
                placeholder="Nueva contraseña"
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
            {/* Input confirmar contraseña con ojo */}
            <View style={styles.inputPasswordContainer}>
              <TextInput
                value={confirmPass}
                onChangeText={setConfirmPass}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#fff"
                secureTextEntry={!mostrarConfirmPass}
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
              />
              <TouchableOpacity onPress={() => setMostrarConfirmPass(!mostrarConfirmPass)}>
                <Ionicons
                  name={mostrarConfirmPass ? "eye-off" : "eye"}
                  size={22}
                  color="#fff"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
          {success && <Text style={styles.success}>{success}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cambiar contraseña</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
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
    fontSize: 54,
    marginBottom: 8,
    textShadowColor: '#0006',
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 10,
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#e3e3e3',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.20)',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 10,
    fontSize: 15,
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
    borderRadius: 20,
    paddingRight: 8,
    // la sombra del input para que quede igual
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
    paddingHorizontal: 56,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
    shadowColor: '#0006',
    shadowOffset: { width: 2, height: 6 },
    shadowRadius: 12,
    shadowOpacity: 0.25,
    transform: [{ scale: 1 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  error: {
    color: '#ff5454',
    marginBottom: 11,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12,
    padding: 6,
    paddingHorizontal: 10,
  },
  success: {
    color: '#0fa77b',
    marginBottom: 12,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: 'rgba(46,219,209,0.09)',
    borderRadius: 12,
    padding: 6,
    paddingHorizontal: 10,
  },
  backButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 22,
    shadowColor: '#0004',
    shadowOffset: { width: 1, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 0.14,
    elevation: 4,
    marginTop: 20,
  },
  backButtonText: {
    color: '#2edbd1',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
