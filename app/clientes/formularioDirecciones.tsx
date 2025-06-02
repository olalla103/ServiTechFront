import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Direccion } from '../../types/direccion';
import { crearDireccionesMultiples } from '../../utils/handler_direcciones';

const FormularioDirecciones: React.FC<{
  onSuccess?: () => void;
  onCancel?: () => void;
}> = ({ onSuccess, onCancel }) => {
  const params = useLocalSearchParams();
  const usuarioEmail = Array.isArray(params.usuarioEmail)
    ? params.usuarioEmail[0]
    : params.usuarioEmail;

  const [direcciones, setDirecciones] = useState<Direccion[]>([
    {
      calle: '',
      numero: '',
      piso: '',
      puerta: '',
      ciudad: '',
      cp: '',
      provincia: '',
      pais: ''
    }
  ]);

  const handleDireccionChange = (
    index: number,
    campo: keyof Direccion,
    valor: string
  ) => {
    const nuevasDirecciones = [...direcciones];
    nuevasDirecciones[index][campo] = valor;
    setDirecciones(nuevasDirecciones);
  };

  const addDireccion = () => {
    setDirecciones([
      ...direcciones,
      {
        calle: '',
        numero: '',
        piso: '',
        puerta: '',
        ciudad: '',
        cp: '',
        provincia: '',
        pais: ''
      }
    ]);
  };

  const removeDireccion = (index: number) => {
    setDirecciones(direcciones =>
      direcciones.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async () => {
    if (!usuarioEmail) {
      alert('No se encuentra el usuario');
      router.replace('/clientes');
      return;
    }
    try {
      await crearDireccionesMultiples(usuarioEmail, direcciones);
      onSuccess && onSuccess();
      router.replace('/clientes');
    } catch (error) {
      alert(error);
    }
  };

  const handleCancelar = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.replace('/clientes');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Añadir direcciones</Text>
      {direcciones.map((dir, idx) => (
        <View key={idx} style={styles.dirBox}>
          <Text style={styles.dirTitle}>Dirección {idx + 1}</Text>
          <TextInput
            placeholder="Calle"
            value={dir.calle}
            onChangeText={val => handleDireccionChange(idx, 'calle', val)}
            style={styles.input}
          />
          <TextInput
            placeholder="Número"
            value={dir.numero}
            onChangeText={val => handleDireccionChange(idx, 'numero', val)}
            style={styles.input}
          />
          <TextInput
            placeholder="Piso"
            value={dir.piso}
            onChangeText={val => handleDireccionChange(idx, 'piso', val)}
            style={styles.input}
          />
          <TextInput
            placeholder="Puerta"
            value={dir.puerta}
            onChangeText={val => handleDireccionChange(idx, 'puerta', val)}
            style={styles.input}
          />
          <TextInput
            placeholder="Ciudad"
            value={dir.ciudad}
            onChangeText={val => handleDireccionChange(idx, 'ciudad', val)}
            style={styles.input}
          />
          <TextInput
            placeholder="CP"
            value={dir.cp}
            onChangeText={val => handleDireccionChange(idx, 'cp', val)}
            style={styles.input}
          />
          <TextInput
            placeholder="Provincia"
            value={dir.provincia}
            onChangeText={val => handleDireccionChange(idx, 'provincia', val)}
            style={styles.input}
          />
          <TextInput
            placeholder="País"
            value={dir.pais}
            onChangeText={val => handleDireccionChange(idx, 'pais', val)}
            style={styles.input}
          />
          {direcciones.length > 1 && (
            <TouchableOpacity
              onPress={() => removeDireccion(idx)}
              style={styles.eliminarBtn}
            >
              <Text style={styles.eliminarText}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addDireccion}>
        <Text style={styles.addButtonText}>Añadir otra dirección</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.guardarButton} onPress={handleSubmit}>
        <Text style={styles.guardarButtonText}>Guardar direcciones</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelarButton} onPress={handleCancelar}>
        <Text style={styles.cancelarButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: "#f8f9fb",
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 18,
    marginTop: 80,
    color: '#2edbd1',
    textAlign: 'center',
  },
  dirBox: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f4f8fc',
    borderRadius: 14,
    shadowColor: '#0002',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 1,
  },
  dirTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: "#199",
    fontSize: 16,
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 7,
    padding: 9,
    borderColor: '#e7ecef',
    borderWidth: 1,
    fontSize: 15,
  },
  eliminarBtn: {
    alignItems: 'flex-end',
    marginTop: 2,
  },
  eliminarText: {
    color: '#ff5252',
    fontWeight: 'bold',
    fontSize: 15,
    paddingTop: 4,
  },
  addButton: {
    backgroundColor: '#B1CFB7',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 10,
    marginTop: 4,
    alignItems: 'center',
    elevation: 1,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  guardarButton: {
    backgroundColor: '#2edbd1',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 8,
    alignItems: 'center',
    elevation: 1,
  },
  guardarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelarButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 4,
    alignItems: 'center',
  },
  cancelarButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FormularioDirecciones;
