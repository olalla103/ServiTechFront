import { Usuario } from '@/types/usuario';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Direccion } from '../../types/direccion';
import { actualizarDireccion, crearDireccionUsuario, eliminarDireccion } from '../../utils/handler_direcciones';
import { actualizarUsuario, getUsuarioIdByEmail } from '../../utils/handler_usuarios';

type DireccionConId = Direccion & { id?: number; _nueva?: boolean; _eliminar?: boolean };

type Props = {
  onClose: () => void;
  clienteEditar?: Usuario & { direcciones?: Direccion[] };
};

export default function FormularioClienteEdicion({ onClose, clienteEditar }: Props) {
  // Estados del cliente
  const [nombre, setNombre] = useState(clienteEditar?.nombre || '');
  const [apellido1, setApellido1] = useState(clienteEditar?.apellido1 || '');
  const [apellido2, setApellido2] = useState(clienteEditar?.apellido2 || '');
  const [email, setEmail] = useState(clienteEditar?.email || '');
  const [telefono, setTelefono] = useState(clienteEditar?.telefono || '');
  const camposDireccion: (keyof Direccion)[] = [
  'calle', 'numero', 'piso', 'puerta', 'ciudad', 'cp', 'provincia', 'pais'
];

  // Direcciones originales (para comparar)
  const direccionesOriginales = clienteEditar?.direcciones?.map(d => ({ ...d })) || [];

  // Estado de direcciones (para editar)
  const [direcciones, setDirecciones] = useState<DireccionConId[]>(
    clienteEditar?.direcciones?.map(d => ({ ...d })) || [
      { calle: '', numero: '', piso: '', puerta: '', ciudad: '', cp: '', provincia: '', pais: '', _nueva: true }
    ]
  );

  // Editar campo de dirección
  const handleDireccionChange = (index: number, campo: keyof Direccion, valor: string) => {
    setDirecciones(prev =>
      prev.map((dir, i) => (i === index ? { ...dir, [campo]: valor } : dir))
    );
  };

  // Añadir dirección vacía
  const addDireccion = () => {
    setDirecciones([
      ...direcciones,
      { calle: '', numero: '', piso: '', puerta: '', ciudad: '', cp: '', provincia: '', pais: '', _nueva: true }
    ]);
  };

  // Eliminar dirección (si tiene id, marcar como _eliminar; si no, quitar del array)
  const removeDireccion = (index: number) => {
    setDirecciones(prev => {
      const dir = prev[index];
      if (dir.id) {
        return prev.map((d, i) => (i === index ? { ...d, _eliminar: true } : d));
      } else {
        return prev.filter((_, i) => i !== index);
      }
    });
  };

  // ------------ EL NUEVO handleSubmit ULTRA SIMPLE -----------------
  const handleSubmit = async () => {
    try {
      let clienteId: number | undefined = clienteEditar?.id;

      // Si no hay id, busca el id por el email
      if (!clienteId && email) {
        clienteId = await getUsuarioIdByEmail(email);
      }
      if (!clienteId) throw new Error("No se encontró el ID del cliente para actualizar");

      // 1. PATCH usuario solo si ha cambiado
      const usuarioModificado =
        nombre !== clienteEditar?.nombre ||
        apellido1 !== clienteEditar?.apellido1 ||
        apellido2 !== clienteEditar?.apellido2 ||
        email !== clienteEditar?.email ||
        telefono !== clienteEditar?.telefono;

      if (usuarioModificado) {
        await actualizarUsuario(clienteId, { nombre, apellido1, apellido2, email, telefono });
      }

      // 2. PATCH/POST/DELETE direcciones de forma inteligente
      for (const dir of direcciones) {
        // (A) Nueva dirección
        if (dir._nueva && !dir._eliminar) {
          await crearDireccionUsuario(clienteId, dir);
        }
        // (B) Dirección eliminada
        else if (dir._eliminar && dir.id) {
          await eliminarDireccion(dir.id);
        }
        // (C) Dirección existente: PATCH solo si ha cambiado
        else if (dir.id && !dir._eliminar) {
          const direccionesOriginales: DireccionConId[] = clienteEditar?.direcciones?.map(d => d as DireccionConId) || [];
          const original = direccionesOriginales.find(d => d.id === dir.id);
          if (original) {
  let hayCambios = false;
  const campos: any = {};

  camposDireccion.forEach((campo) => {
    // usamos "as any" para evitar el error de TS (solo aquí)
    if ((dir as any)[campo] !== (original as any)[campo]) {
      campos[campo] = (dir as any)[campo];
      hayCambios = true;
    }
  });

  if (hayCambios) {
    await actualizarDireccion(dir.id, campos);
  }
}
        }
      }

      Toast.show({
        type: 'success',
        text1: '¡Éxito!',
        text2: clienteEditar ? 'Cliente actualizado' : 'Cliente creado',
        position: 'bottom',
      });
      onClose();

    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Error al guardar');
    }
  };

  // ----------------- UI --------------------
  return (
    <>
      <TouchableOpacity
        style={styles.iconoFlecha}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={28} color="#2edbd1" />
      </TouchableOpacity>
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{clienteEditar ? 'Editar Cliente' : 'Nuevo Cliente'}</Text>
      <TextInput
        placeholder="Nombre"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        placeholder="Primer apellido"
        style={styles.input}
        value={apellido1}
        onChangeText={setApellido1}
      />
      <TextInput
        placeholder="Segundo apellido"
        style={styles.input}
        value={apellido2}
        onChangeText={setApellido2}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Teléfono"
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <Text style={{ fontWeight: 'bold', fontSize: 16, marginVertical: 8 }}>Direcciones</Text>
      {direcciones.map((dir, idx) => !dir._eliminar && (
        <View key={dir.id || idx} style={styles.dirBox}>
          <Text style={{ fontWeight: 'bold' }}>Dirección {idx + 1}</Text>
          <TextInput placeholder="Calle" value={dir.calle} onChangeText={v => handleDireccionChange(idx, 'calle', v)} style={styles.inputDir} />
          <TextInput placeholder="Número" value={dir.numero} onChangeText={v => handleDireccionChange(idx, 'numero', v)} style={styles.inputDir} />
          <TextInput placeholder="Piso" value={dir.piso || ''} onChangeText={v => handleDireccionChange(idx, 'piso', v)} style={styles.inputDir} />
          <TextInput placeholder="Puerta" value={dir.puerta || ''} onChangeText={v => handleDireccionChange(idx, 'puerta', v)} style={styles.inputDir} />
          <TextInput placeholder="Ciudad" value={dir.ciudad} onChangeText={v => handleDireccionChange(idx, 'ciudad', v)} style={styles.inputDir} />
          <TextInput placeholder="CP" value={dir.cp} onChangeText={v => handleDireccionChange(idx, 'cp', v)} style={styles.inputDir} />
          <TextInput placeholder="Provincia" value={dir.provincia} onChangeText={v => handleDireccionChange(idx, 'provincia', v)} style={styles.inputDir} />
          <TextInput placeholder="País" value={dir.pais} onChangeText={v => handleDireccionChange(idx, 'pais', v)} style={styles.inputDir} />
          <TouchableOpacity onPress={() => removeDireccion(idx)} style={{ alignSelf: 'flex-end' }}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Añadir dirección" onPress={addDireccion} />
      <Button
        title={clienteEditar ? 'Guardar cambios' : 'Crear cliente'}
        onPress={handleSubmit}
        color="#2edbd1"
      />
      <Button title="Cancelar" onPress={onClose} color="#888" />
    </ScrollView>
 </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 70,
    color: '#00b2b7',
    letterSpacing: 1.1,
  },
  input: {
    backgroundColor: '#f6f8fb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e6f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
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
  dirBox: {
    backgroundColor: '#e8f7fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
    shadowColor: '#1fc7b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    borderWidth: 1,
    borderColor: '#d2e6ed',
  },
  inputDir: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  eliminarBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff5964',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  eliminarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
