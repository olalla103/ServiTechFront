import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Fondo from '../../components/fondo';
import { crearEmpresa } from '../../utils/handler_empresas'; // ¡IMPORTANTE!
import { crearUsuario } from '../../utils/handler_usuarios';

export default function RegisterScreen() {
  const router = useRouter();

  // Estados campos usuario
  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [numeroSS, setNumeroSS] = useState('');
  const [adminEmpresa, setAdminEmpresa] = useState(false);
  const [empresaId, setEmpresaId] = useState('');

  // Estado para datos de empresa y visibilidad
  const [empresa, setEmpresa] = useState({
    cif: '',
    nombre_fiscal: '',
    calle_y_numero: '',
    codigo_postal: '',
    ciudad: '',
    provincia: '',
    correo_electronico: '',
  });
  const [empresaFieldsVisible, setEmpresaFieldsVisible] = useState(false);

  // Otros estados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  // Handlers para empresa
  const handleAdminEmpresaChange = (val: boolean) => {
    setAdminEmpresa(val);
    setEmpresaFieldsVisible(val);
  };

  const handleEmpresaField = (field: string, value: string) => {
    setEmpresa(prev => ({ ...prev, [field]: value }));
  };

  // Handler de registro
  const handleRegister = async () => {
    setError(null);
    setExito(null);
    setLoading(true);

    if (!nombre || !apellido1 || !apellido2 || !email || !contraseña || !telefono || !fechaNacimiento) {
      setError('Por favor, rellena todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    let cifEmpresa = empresaId;

    try {
      // Si es admin empresa, crea primero la empresa
      if (adminEmpresa) {
        // Valida campos de empresa mínimamente
        if (
          !empresa.cif ||
          !empresa.nombre_fiscal ||
          !empresa.calle_y_numero ||
          !empresa.codigo_postal ||
          !empresa.ciudad ||
          !empresa.provincia ||
          !empresa.correo_electronico
        ) {
          setError('Por favor, rellena todos los campos de empresa.');
          setLoading(false);
          return;
        }

        // Crea empresa y recoge el CIF
        const nuevaEmpresa = await crearEmpresa(empresa);
        cifEmpresa = nuevaEmpresa.cif;
      }

      // Ahora crea el usuario asociado a la empresa
      await crearUsuario({
        nombre,
        apellido1,
        apellido2,
        email,
        contraseña,
        telefono,
        fecha_nacimiento: fechaNacimiento,
        especialidad: especialidad || null,
        numero_seguridad_social: numeroSS || null,
        admin_empresa: adminEmpresa,
        empresa_id: cifEmpresa || null,
      });

      setExito('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setTimeout(() => router.replace('/auth/login'), 1400);
    } catch (e: any) {
      setError(e.message || 'Error desconocido al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fondo>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.centered} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>📝</Text>
          <Text style={styles.title}>Registro</Text>
          <Text style={styles.subtitle}>Crea tu cuenta para acceder</Text>

          {/* Campos de registro usuario */}
          <View style={styles.inputContainer}>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre"
              placeholderTextColor="#fff"
              style={styles.input}
            />
            <TextInput
              value={apellido1}
              onChangeText={setApellido1}
              placeholder="Primer apellido"
              placeholderTextColor="#fff"
              style={styles.input}
            />
            <TextInput
              value={apellido2}
              onChangeText={setApellido2}
              placeholder="Segundo apellido"
              placeholderTextColor="#fff"
              style={styles.input}
            />
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
              value={contraseña}
              onChangeText={setContraseña}
              placeholder="Contraseña"
              placeholderTextColor="#fff"
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Teléfono"
              placeholderTextColor="#fff"
              keyboardType="phone-pad"
              style={styles.input}
            />
            <TextInput
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
              placeholder="Fecha de nacimiento (YYYY-MM-DD)"
              placeholderTextColor="#fff"
              style={styles.input}
            />
            <TextInput
              value={especialidad}
              onChangeText={setEspecialidad}
              placeholder="Especialidad (técnic@s)"
              placeholderTextColor="#fff"
              style={styles.input}
            />
            <TextInput
              value={numeroSS}
              onChangeText={setNumeroSS}
              placeholder="Nº Seguridad Social (técnic@s)"
              placeholderTextColor="#fff"
              keyboardType="number-pad"
              style={styles.input}
            />

            {/* Switch para admin_empresa */}
           <View style={styles.switchContainer}>
  <Text style={styles.switchLabel}>¿Administrador/ra de una {'\n'}empresa o autónomo/a?</Text>
  <Switch
    value={adminEmpresa}
    onValueChange={handleAdminEmpresaChange}
    trackColor={{ false: '#aaa', true: '#2edbd1' }}
    thumbColor={adminEmpresa ? '#fff' : '#fff'}
  />
</View>

{empresaFieldsVisible && (
  <View style={styles.empresaContainer}>
    <TextInput
      value={empresa.cif}
      onChangeText={text => handleEmpresaField('cif', text)}
      placeholder="CIF de empresa"
      placeholderTextColor="#fff"
      style={styles.input}
    />
    <TextInput
      value={empresa.nombre_fiscal}
      onChangeText={text => handleEmpresaField('nombre_fiscal', text)}
      placeholder="Nombre fiscal"
      placeholderTextColor="#fff"
      style={styles.input}
    />
    <TextInput
      value={empresa.calle_y_numero}
      onChangeText={text => handleEmpresaField('calle_y_numero', text)}
      placeholder="Calle y número"
      placeholderTextColor="#fff"
      style={styles.input}
    />
    <TextInput
      value={empresa.codigo_postal}
      onChangeText={text => handleEmpresaField('codigo_postal', text)}
      placeholder="Código postal"
      placeholderTextColor="#fff"
      keyboardType="number-pad"
      style={styles.input}
    />
    <TextInput
      value={empresa.ciudad}
      onChangeText={text => handleEmpresaField('ciudad', text)}
      placeholder="Ciudad"
      placeholderTextColor="#fff"
      style={styles.input}
    />
    <TextInput
      value={empresa.provincia}
      onChangeText={text => handleEmpresaField('provincia', text)}
      placeholder="Provincia"
      placeholderTextColor="#fff"
      style={styles.input}
    />
    <TextInput
      value={empresa.correo_electronico}
      onChangeText={text => handleEmpresaField('correo_electronico', text)}
      placeholder="Email empresa"
      placeholderTextColor="#fff"
      autoCapitalize="none"
      keyboardType="email-address"
      style={styles.input}
    />
  </View>
)}


            {/* Si NO es admin, puedes mostrar el campo empresaId (opcional) */}
            {!adminEmpresa && (
              <TextInput
                value={empresaId}
                onChangeText={setEmpresaId}
                placeholder="ID/CIF de empresa (si lo sabes)"
                placeholderTextColor="#fff"
                style={styles.input}
              />
            )}
          </View>

          {/* Error o éxito */}
          {error && <Text style={styles.error}>{error}</Text>}
          {exito && <Text style={styles.exito}>{exito}</Text>}

          {/* Botón registrar */}
          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>

          {/* Espaciado visual */}
          <View style={{ height: 22 }} />
          <TouchableOpacity style={styles.registerButton} onPress={() => router.replace('/auth/login')}>
            <Text style={styles.registerButtonText}>¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Fondo>
  );
}

const styles = StyleSheet.create({
  centered: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  logo: {
    fontSize: 60,
    marginTop:80,
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
    marginBottom: 14,
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 2,
  },
  switchLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    marginRight: 12,
  },
  empresaContainer: {
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    paddingBottom: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(46,219,209,0.09)',
  },
  button: {
    backgroundColor: '#2edbd1',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 80,
    alignItems: 'center',
    marginTop: 18,
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
    marginBottom: 14,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 6,
    paddingHorizontal: 10,
  },
  exito: {
    color: '#43df7c',
    marginBottom: 14,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
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
