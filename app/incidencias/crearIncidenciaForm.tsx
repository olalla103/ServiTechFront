import { useAuth } from "@/context/AuthProvider";
import { getClienteById, getTecnicoIdByEmpresa, getUsuarioIdByEmail } from "@/utils/handler_usuarios";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { crearIncidencia } from "../../utils/handler_incidencias";

export default function CrearIncidenciaForm() {
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const feedbackRef = useRef<any>(null);

  // Para IDs y técnicos
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [cargandoId, setCargandoId] = useState(true);
  const [tecnicoId, setTecnicoId] = useState<number | null>(null);

  // DIRECCIONES: será un array de objetos
  const [direcciones, setDirecciones] = useState<any[]>([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<string | null>(null);

  // Dropdown states individuales
  const [openTipo, setOpenTipo] = useState(false);
  const [openDireccion, setOpenDireccion] = useState(false);

  // Auth
  const { user } = useAuth();
  const userEmail = user?.email;
  const empresaId = user?.empresa_id;

  // Dropdown tipo
  const [value, setValue] = useState("presencial");
  const [items, setItems] = useState([
    { label: "Presencial", value: "presencial" },
    { label: "Remota", value: "remota" },
  ]);

  const MIN_DESCRIPCION = 10;

  // Formateador bonito de dirección
  function formatearDireccion(dir: any) {
    return `${dir.calle} ${dir.numero}${dir.piso ? ', Piso ' + dir.piso : ''}${dir.puerta ? ', Puerta ' + dir.puerta : ''}, ${dir.ciudad}, ${dir.provincia}, ${dir.cp}, ${dir.pais}`;
  }

  // Memoiza los items de direcciones
  const itemsDireccion = useMemo(() =>
    direcciones.map(dir => ({
      label: formatearDireccion(dir),
      value: formatearDireccion(dir)
    })), [direcciones]);

  useEffect(() => {
    async function fetchData() {
      if (!userEmail) return;
      setCargandoId(true);
      const id = await getUsuarioIdByEmail(userEmail);
      setClienteId(id);

      // Obtenemos técnico de la empresa
      let tecnico = null;
      if (empresaId) {
        tecnico = await getTecnicoIdByEmpresa(empresaId);
      }
      setTecnicoId(tecnico);

      // Obtenemos las direcciones del cliente
      if (id) {
        const cliente = await getClienteById(id);
        setDirecciones(cliente.direcciones || []);
      }

      setCargandoId(false);
    }
    fetchData();
  }, [userEmail, empresaId]);

  // Resetea dirección seleccionada cuando cambian las direcciones
  useEffect(() => {
    setDireccionSeleccionada(null);
  }, [direcciones]);

  // Logs para depurar
  useEffect(() => {
    console.log("Direcciones:", direcciones);
    console.log("Items del dropdown:", itemsDireccion);
    console.log("Dirección seleccionada:", direccionSeleccionada);
  }, [direcciones, itemsDireccion, direccionSeleccionada]);

  const handleSubmit = async () => {
    setSuccess(null);
    setError(null);
    Keyboard.dismiss();

    if (descripcion.trim().length < MIN_DESCRIPCION) {
      setError(`La descripción debe tener al menos ${MIN_DESCRIPCION} caracteres.`);
      setTimeout(() => setError(null), 4000);
      return;
    }

    if (!clienteId || !direccionSeleccionada || !tecnicoId) {
      setError("Faltan campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      await crearIncidencia({
        descripcion,
        tipo: value,
        cliente_id: clienteId,
        fecha_reporte: new Date().toISOString(),
        estado: "pendiente",
        direccion: direccionSeleccionada,
        fecha_inicio: null,
        fecha_final: null,
        horas: "00:00:00",
        tecnico_id: tecnicoId,
        pausada: false,
        fecha_hora_pausa: null,
        fecha_ultimo_reinicio: null
      });
      setSuccess("Incidencia registrada correctamente.");
      setDescripcion("");
      setValue("presencial");
      setDireccionSeleccionada(null);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError("Hubo un error al registrar la incidencia.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  if (cargandoId) return <Text>Cargando datos de usuario...</Text>;
  if (clienteId === null) return <Text style={{ color: "red" }}>No se encontró el usuario.</Text>;
  if (tecnicoId === null) return <Text style={{ color: "red" }}>No se encontró ningún técnico asignable.</Text>;

  return (
    <>
      <TouchableOpacity
        style={styles.iconoFlecha}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={28} color="#2edbd1" />
      </TouchableOpacity>

      <View ref={feedbackRef} style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.header}>Reportar nueva incidencia</Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>
              Descripción de la incidencia <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Describe el problema de forma clara y concisa..."
              multiline
              maxLength={400}
              placeholderTextColor="#b6c3cb"
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <TouchableOpacity
              style={styles.hideKeyboardBtn}
              onPress={() => Keyboard.dismiss()}
            >
              <Text style={styles.hideKeyboardText}>Ocultar teclado</Text>
            </TouchableOpacity>
            <Text style={styles.minimo}>
              Mínimo {MIN_DESCRIPCION} caracteres ({descripcion.trim().length}/{MIN_DESCRIPCION})
            </Text>
          </View>

          {/* --- DropDown tipo --- */}
          <View style={{ zIndex: 2000, marginBottom: openTipo ? 85 : 18 }}>
            <Text style={styles.label}>
              Tipo de incidencia <Text style={styles.required}>*</Text>
            </Text>
            <DropDownPicker
              open={openTipo}
              value={value}
              items={items}
              setOpen={setOpenTipo}
              setValue={setValue}
              setItems={setItems}
              containerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownBox}
              textStyle={styles.dropdownText}
              placeholder="Selecciona un tipo"
              disabled={loading}
              zIndex={2000}
            />
          </View>

          {/* --- DropDown dirección --- */}
          <View style={{ zIndex: 1500, marginBottom: openDireccion ? 50 : 18 }}>
            <Text style={styles.label}>
              Dirección <Text style={styles.required}>*</Text>
            </Text>
            <DropDownPicker
              key={itemsDireccion.length}
              open={openDireccion}
              value={direccionSeleccionada}
              items={itemsDireccion}
              setOpen={setOpenDireccion}
              setValue={setDireccionSeleccionada}
              setItems={() => { }}
              containerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownBox}
              textStyle={styles.dropdownText}
              placeholder="Selecciona una dirección"
              disabled={loading || itemsDireccion.length === 0}
              zIndex={1500}
            />
            {itemsDireccion.length === 0 && (
              <Text style={{ color: "orange", marginTop: 6 }}>No tienes direcciones asociadas.</Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (loading || descripcion.trim().length < MIN_DESCRIPCION) && styles.buttonDisabled,
            ]}
            disabled={loading || descripcion.trim().length < MIN_DESCRIPCION}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              {loading ? "Enviando..." : "Registrar incidencia"}
            </Text>
          </TouchableOpacity>

          {(success || error) && (
            <View
              style={[
                styles.feedback,
                success ? styles.feedbackSuccess : styles.feedbackError,
              ]}
            >
              <Text style={success ? styles.feedbackTextSuccess : styles.feedbackTextError}>
                {success ? "✅ " + success : "❌ " + error}
              </Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    minHeight: "100%",
  },
  formContainer: {
    width: "92%",
    maxWidth: 420,
    backgroundColor: "#fff",
    padding: 26,
    borderRadius: 22,
    shadowColor: "#2edbd1",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#2edbd1",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2edbd1",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 1,
  },
  fieldBlock: {
    marginBottom: 18,
  },
  fieldBlockDropdown: {
    marginBottom: 18, // El margin ahora se maneja dinámico en cada View inline
    zIndex: 1000,
  },
  label: {
    fontSize: 16,
    color: "#222",
    marginBottom: 5,
  },
  iconoFlecha: {
    position: "absolute",
    top: 50,
    left: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
  },
  required: {
    color: "#dc2626",
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: "#2edbd1",
    borderRadius: 14,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    fontSize: 15,
    marginBottom: 2,
    backgroundColor: "#f8fafc",
  },
  minimo: {
    fontSize: 12,
    color: "#2edbd1",
    marginTop: 2,
  },
  dropdownContainer: {
    height: 48,
  },
  dropdown: {
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    borderColor: "#2edbd1",
    borderWidth: 1.5,
  },
  dropdownBox: {
    borderRadius: 14,
    borderColor: "#2edbd1",
    backgroundColor: "#f8fafc",
  },
  dropdownText: {
    color: "#2edbd1",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#2edbd1",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#2edbd1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 1,
  },
  hideKeyboardBtn: {
    alignSelf: "flex-end",
    marginTop: 6,
    backgroundColor: "#2edbd1",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  hideKeyboardText: {
    color: "#fff",
    fontWeight: "bold",
  },
  feedback: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  feedbackSuccess: {
    backgroundColor: "#2edbd122",
  },
  feedbackError: {
    backgroundColor: "#fecaca",
  },
  feedbackTextSuccess: {
    color: "#2edbd1",
    fontSize: 16,
    fontWeight: "600",
  },
  feedbackTextError: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "600",
  },
});
