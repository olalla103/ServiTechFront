import AlertModal from '@/components/AlertModal';
import { Usuario } from '@/types/usuario';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Direccion } from '../../types/direccion';
import {
  actualizarDireccion,
  crearDireccionUsuario,
  eliminarDireccion
} from '../../utils/handler_direcciones';
import {
  actualizarUsuario,
  getUsuarioIdByEmail
} from '../../utils/handler_usuarios';

// Extiende el tipo para direcciones en el formulario
type DireccionConId = Direccion & {
  id?: number;
  _nueva?: boolean;
  _eliminar?: boolean;
  _tempKey?: string;
};

type Props = {
  onClose: () => void;
  clienteEditar?: Usuario & { direcciones?: Direccion[] };
};

export default function FormularioClienteEdicion({
  onClose,
  clienteEditar
}: Props) {
  // Estados del cliente
  const [nombre, setNombre] = useState(clienteEditar?.nombre || '');
  const [apellido1, setApellido1] = useState(clienteEditar?.apellido1 || '');
  const [apellido2, setApellido2] = useState(clienteEditar?.apellido2 || '');
  const [email, setEmail] = useState(clienteEditar?.email || '');
  const [telefono, setTelefono] = useState(clienteEditar?.telefono || '');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const camposDireccion: (keyof Direccion)[] = [
    'calle',
    'numero',
    'piso',
    'puerta',
    'ciudad',
    'cp',
    'provincia',
    'pais'
  ];

  const queryClient = useQueryClient();

  // Estado de direcciones (para editar)
  const [direcciones, setDirecciones] = useState<DireccionConId[]>(
    clienteEditar?.direcciones?.map(d => ({ ...d })) || [
      {
        calle: '',
        numero: '',
        piso: '',
        puerta: '',
        ciudad: '',
        cp: '',
        provincia: '',
        pais: '',
        _nueva: true,
        _tempKey: Date.now().toString() + Math.random().toString()
      }
    ]
  );

  // Editar campo de dirección
  const handleDireccionChange = (
    index: number,
    campo: keyof Direccion,
    valor: string
  ) => {
    setDirecciones(prev =>
      prev.map((dir, i) => (i === index ? { ...dir, [campo]: valor } : dir))
    );
  };

  // Añadir dirección vacía con _tempKey único
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
        pais: '',
        _nueva: true,
        _tempKey: Date.now().toString() + Math.random().toString()
      }
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

  const handleSubmit = async () => {
    try {
      let clienteId: number | undefined = clienteEditar?.id;

      if (!clienteId && email) {
        clienteId = await getUsuarioIdByEmail(email);
      }
      if (!clienteId)
        throw new Error('No se encontró el ID del cliente para actualizar');

      const usuarioModificado =
        nombre !== clienteEditar?.nombre ||
        apellido1 !== clienteEditar?.apellido1 ||
        apellido2 !== clienteEditar?.apellido2 ||
        email !== clienteEditar?.email ||
        telefono !== clienteEditar?.telefono;

      if (usuarioModificado) {
        await actualizarUsuario(clienteId, {
          nombre,
          apellido1,
          apellido2,
          email,
          telefono
        });
      }

      for (const dir of direcciones) {
        if (dir._nueva && !dir._eliminar) {
          await crearDireccionUsuario(clienteId, {
            calle: dir.calle,
            numero: dir.numero,
            piso: dir.piso,
            puerta: dir.puerta,
            ciudad: dir.ciudad,
            cp: dir.cp,
            provincia: dir.provincia,
            pais: dir.pais
          });
        } else if (dir._eliminar && dir.id) {
          await eliminarDireccion(dir.id);
        } else if (dir.id && !dir._eliminar) {
          const direccionesOriginales: DireccionConId[] =
            clienteEditar?.direcciones?.map(d => d as DireccionConId) || [];
          const original = direccionesOriginales.find(d => d.id === dir.id);
          if (original) {
            let hayCambios = false;
            const campos: any = {};
            camposDireccion.forEach(campo => {
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

      if (clienteId) {
        queryClient.invalidateQueries({ queryKey: ['clientes-empresa'] });
        queryClient.invalidateQueries({ queryKey: ['cliente', clienteId] });
        queryClient.invalidateQueries({ queryKey: ['direcciones', clienteId] });
      }
      Toast.show({
        type: 'success',
        text1: '¡Éxito!',
        text2: clienteEditar ? 'Cliente actualizado' : 'Cliente creado',
        position: 'bottom'
      });
      onClose();
    } catch (error: any) {
      setErrorMessage(error?.message || 'Error al guardar');
      setErrorVisible(true);
    }
  };

  return (
    <>
      {/* Botón de volver */}
      <View style={styles.fondo}>
      <TouchableOpacity
        style={styles.iconoFlecha}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={28} color="#2edbd1" />
      </TouchableOpacity>
       <Text style={styles.title}>
          {clienteEditar ? 'Editar Cliente' : 'Nuevo Cliente'}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
         <Text style={styles.seccionDirecciones}>
           Datos del cliente
        </Text>
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
          placeholder="Teléfono"
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <Text style={styles.seccionDirecciones}>
          <Ionicons name="location" size={18} color="#1fc7b6" /> Direcciones
        </Text>
        {direcciones.map(
          (dir, idx) =>
            !dir._eliminar && (
              <View
                key={dir.id ? `id-${dir.id}` : `tmp-${dir._tempKey}`}
                style={styles.dirBox}
              >
                <View style={styles.dirHeader}>
                  <Text style={styles.dirTitle}>
                    Dirección {idx + 1}
                  </Text>
                  {direcciones.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeDireccion(idx)}
                      style={styles.dirDeleteBtn}
                    >
                      <Ionicons name="trash" size={20} color="#ff5964" />
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  placeholder="Calle"
                  value={dir.calle}
                  onChangeText={v => handleDireccionChange(idx, 'calle', v)}
                  style={styles.inputDir}
                />
                <TextInput
                  placeholder="Número"
                  value={dir.numero}
                  onChangeText={v => handleDireccionChange(idx, 'numero', v)}
                  style={styles.inputDir}
                />
                <TextInput
                  placeholder="Piso"
                  value={dir.piso || ''}
                  onChangeText={v => handleDireccionChange(idx, 'piso', v)}
                  style={styles.inputDir}
                />
                <TextInput
                  placeholder="Puerta"
                  value={dir.puerta || ''}
                  onChangeText={v => handleDireccionChange(idx, 'puerta', v)}
                  style={styles.inputDir}
                />
                <TextInput
                  placeholder="Ciudad"
                  value={dir.ciudad}
                  onChangeText={v => handleDireccionChange(idx, 'ciudad', v)}
                  style={styles.inputDir}
                />
                <TextInput
                  placeholder="CP"
                  value={dir.cp}
                  onChangeText={v => handleDireccionChange(idx, 'cp', v)}
                  style={styles.inputDir}
                />
                <TextInput
                  placeholder="Provincia"
                  value={dir.provincia}
                  onChangeText={v => handleDireccionChange(idx, 'provincia', v)}
                  style={styles.inputDir}
                />
                <TextInput
                  placeholder="País"
                  value={dir.pais}
                  onChangeText={v => handleDireccionChange(idx, 'pais', v)}
                  style={styles.inputDir}
                />
              </View>
            )
        )}
        <TouchableOpacity style={styles.btnAgregar} onPress={addDireccion}>
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={styles.btnAgregarTxt}>Añadir dirección</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Botones abajo siempre visibles */}
      <View style={styles.botonera}>
        <TouchableOpacity
          style={styles.btnGuardar}
          onPress={handleSubmit}
        >
          <Ionicons name="save" size={22} color="#fff" />
          <Text style={styles.btnGuardarTxt}>
            {clienteEditar ? 'Guardar' : 'Crear cliente'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnCancelar}
          onPress={onClose}
        >
          <Ionicons name="close-circle" size={22} color="#888" />
          <Text style={styles.btnCancelarTxt}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <AlertModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 140,
    backgroundColor: "#f8fafc",
  },
  fondo:{
    backgroundColor:'#f8fafc'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 70,
    paddingTop:10,
    color: '#1fc7b6',
    letterSpacing: 1.1
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
    shadowRadius: 2
  },
  seccionDirecciones: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 12,
    color: '#1fc7b6',
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: '#d2e6ed'
  },
  dirHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dirTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: "#00b2b7",
  },
  dirDeleteBtn: {
    padding: 4,
    marginLeft: 8,
  },
  inputDir: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e6e6e6'
  },
  btnAgregar: {
    flexDirection: 'row',
    backgroundColor: '#00b2b7',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 1,
    shadowColor: '#0002',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
  },
  btnAgregarTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  botonera: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f8f9fb",
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: '#d2e6ed',
    borderTopWidth: 1,
    zIndex: 5,
  },
  btnGuardar: {
    backgroundColor: '#2edbd1',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  btnGuardarTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginLeft: 8,
  },
  btnCancelar: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  btnCancelarTxt: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 17,
    marginLeft: 8,
  },
  iconoFlecha: {
    position: 'absolute',
    top: 50,
    left: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#f8f9fb',
    borderRadius: 20,
    elevation: 4
  },
});
