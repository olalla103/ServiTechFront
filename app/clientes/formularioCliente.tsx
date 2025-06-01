import { crearUsuario } from '@/utils/handler_usuarios';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  InputAccessoryView,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../context/AuthProvider';

export default function FormularioCliente({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | undefined>();
  const [showDate, setShowDate] = useState(false);
  const inputAccessoryViewID = 'uniqueID';

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: crearUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes-empresa'] });
      onClose();
    },
    onError: () => Alert.alert("Error", "No se pudo crear el cliente"),
  });

//   const mutation = useMutation({
//   mutationFn: debugUsuario,   // usa debugUsuario aquí
//   onSuccess: () => {
//     queryClient.invalidateQueries({ queryKey: ['clientes-empresa'] });
//     onClose();
//   },
//   onError: (error) => {
//     Alert.alert("Error", "No se pudo crear el cliente");
//     // Agrega esto para ver el error completo:
//     console.log("Error completo:", error);
//   },
// });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDate(false);
      if (event.type === 'set' && selectedDate) {
        setFechaNacimiento(selectedDate);
      }
      return;
    }
    // En iOS, actualiza la fecha en tiempo real, el modal se cierra con el botón "Hecho"
    if (selectedDate) setFechaNacimiento(selectedDate);
  };

  const handleOpenDate = () => {
    Keyboard.dismiss();
    setShowDate(true);
  };

  const handleSubmit = () => {
    if (!nombre || !apellido1 || !email || !telefono || !contraseña) {
      Alert.alert('Completa todos los campos obligatorios');
      return;
    }
    console.log(fechaNacimiento)
    mutation.mutate({
      nombre,
      apellido1,
      apellido2,
      email,
      contraseña: contraseña,
      telefono,
      fecha_nacimiento: fechaNacimiento
  ? fechaNacimiento.toISOString().split('T')[0]
  : undefined,
      especialidad: null,
      numero_seguridad_social: null,
      admin_empresa: false,
      empresa_id: user.empresa_id,
    });
  };
  
  return (
    <View style={{ flex: 1 }}>
      {/* Flecha de volver */}
      <TouchableOpacity
        style={styles.iconoFlecha}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={28} color="#2edbd1" />
      </TouchableOpacity>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Añadir Cliente</Text>
        <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} />
        <TextInput placeholder="Primer apellido" style={styles.input} value={apellido1} onChangeText={setApellido1} />
        <TextInput placeholder="Segundo apellido" style={styles.input} value={apellido2} onChangeText={setApellido2} />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          value={contraseña}
          onChangeText={setContraseña}
          secureTextEntry={true}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Teléfono"
          style={styles.input}
          value={telefono}
          inputAccessoryViewID={Platform.OS === 'ios' ? inputAccessoryViewID : undefined}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
        {/* InputAccessoryView solo se muestra en iOS */}
        {Platform.OS === 'ios' && (
          <InputAccessoryView nativeID={inputAccessoryViewID}>
            <Button onPress={Keyboard.dismiss} title="Hecho" color="#2edbd1" />
          </InputAccessoryView>
        )}

        {/* Selector de fecha (abre modal) */}
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={handleOpenDate}
          activeOpacity={0.8}
        >
          <Text style={{ color: fechaNacimiento ? '#222' : '#999' }}>
            {fechaNacimiento ? fechaNacimiento.toISOString().slice(0, 10) : 'Fecha de nacimiento'}
          </Text>
        </TouchableOpacity>
        {/* Modal para el DatePicker */}
        <Modal
          visible={showDate}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDate(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={fechaNacimiento || new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                style={{ backgroundColor: '#fff' }}
              />
              <TouchableOpacity
                onPress={() => setShowDate(false)}
                style={styles.hechoBtn}
              >
                <Text style={styles.hechoText}>Hecho</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={mutation.isPending}>
          <Text style={styles.buttonText}>Añadir Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={{ color: '#888', fontWeight: 'bold' }}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginTop: 150,
    margin: 16,
    elevation: 4,
    shadowColor: '#0002',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
    color: '#2edbd1',
  },
  input: {
    backgroundColor: '#f6f8fb',
    borderRadius: 8,
    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 14,
  },
  iconoFlecha: {
    position: 'absolute',
    top: 50,
    left: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#f8f9fb',
    borderRadius: 20,
    elevation: 4,
  },
  button: {
    backgroundColor: '#2edbd1',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  // Modal para fecha
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  hechoBtn: {
    marginTop: 10,
    backgroundColor: '#2edbd1',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  hechoText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
