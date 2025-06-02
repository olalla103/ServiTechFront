import { useAuth } from '@/context/AuthProvider';
import { actualizarIncidencia, pausarIncidencia, reanudarIncidencia } from '@/utils/handler_incidencias';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  incidenciaId: number;
  pausadaInicial?: boolean;
  segundosIniciales?: number;
  onChangeEstado?: (pausada: boolean) => void;
};


const CronometroIncidencia: React.FC<Props> = ({
  incidenciaId,
  pausadaInicial = false,
  segundosIniciales = 0,
  onChangeEstado
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(segundosIniciales);
  const [loading, setLoading] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();

const refreshIncidencia = () => {
  queryClient.invalidateQueries({ queryKey: ['incidencia', incidenciaId] });

};

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Control del cronómetro
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // INICIAR: actualiza el estado y fecha_inicio en backend
  const handleIniciar = async () => {
    setLoading(true);
    try {
      await actualizarIncidencia(incidenciaId, {
        estado: "en_reparacion",
        fecha_inicio: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
      setHasStarted(true);
      setIsRunning(true);
      refreshIncidencia();
    } catch (e) {
      // Aquí puedes mostrar un Toast o alerta si quieres
    }
    setLoading(false);
  };

  const { user } = useAuth();

  // PAUSAR: pone en pausa la incidencia (backend y frontend)
  const handlePausar = async () => {
    setLoading(true);
    try {
      await pausarIncidencia(incidenciaId, new Date().toISOString());
      setIsRunning(false);
      onChangeEstado?.(true);
      refreshIncidencia();
    } catch (e) {}
    setLoading(false);
  };

  // REANUDAR: reanuda la incidencia (backend y frontend)
  const handleReanudar = async () => {
    setLoading(true);
    try {
      await reanudarIncidencia(incidenciaId);
      setIsRunning(true);
      onChangeEstado?.(false);
      refreshIncidencia();
    } catch (e) {}
    setLoading(false);
  };

  function formatHoraMySQL(s: number) {
  // Devuelve HH:MM:SS para guardar en la BD
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const ss = (s % 60).toString().padStart(2, '0');
  return `${h}:${m}:${ss}`;
}

  // PARAR: finaliza y muestra el modal
const handleParar = async () => {
  setIsRunning(false);
  setFinalizado(true);
  setModalVisible(true);

  // Marca la incidencia como resuelta en la BD
  await actualizarIncidencia(incidenciaId, {
    estado: "resuelta",
    fecha_final: new Date().toISOString().slice(0, 19).replace('T', ' '),
    horas: formatHoraMySQL(seconds) // si tienes que guardar el tiempo
  });

  // Refresca tanto el detalle de la incidencia como la lista de resueltas
  queryClient.invalidateQueries({ queryKey: ['incidencia', incidenciaId] });
  queryClient.invalidateQueries({ queryKey: ['incidencias-resueltas', user.id] }); // técnico actual
};


  // Cerrar modal
  const handleCerrarModal = () => {
    setModalVisible(false);
    // Aquí podrías refrescar la pantalla o llamar a un callback
  };

  // Formato HH:MM:SS
  const format = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${ss}`;
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.timer}>{format(seconds)}</Text>
      {/* BOTONES */}
      {!finalizado && (
        <View style={styles.row}>
  {loading && <ActivityIndicator color="#2edbd1" style={{ marginRight: 8 }} />}
  {!hasStarted && !loading && (
    <TouchableOpacity style={styles.btn} onPress={handleIniciar}>
      <Text style={styles.btnText}>Iniciar</Text>
    </TouchableOpacity>
  )}
  {hasStarted && !loading && (
    <TouchableOpacity
      style={[styles.btn, { opacity: finalizado ? 0.5 : 1 }]}
      onPress={isRunning ? handlePausar : handleReanudar}
      disabled={finalizado}
    >
      <Text style={styles.btnText}>{isRunning ? 'Pausar' : 'Reanudar'}</Text>
    </TouchableOpacity>
  )}
  <TouchableOpacity
    style={styles.btn}
    onPress={handleParar}
    disabled={loading || !hasStarted || finalizado}
  >
    <Text style={styles.btnText}>Parar</Text>
  </TouchableOpacity>
</View>

      )}
      {/* ESTADO */}
      <Text style={{ marginTop: 6, color: finalizado ? "#27ae60" : isRunning ? "#27ae60" : "#888" }}>
        {finalizado
          ? 'Incidencia finalizada'
          : isRunning
          ? 'En curso'
          : hasStarted
          ? 'Pausado'
          : ''}
      </Text>
      {/* MODAL FINALIZACIÓN */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={handleCerrarModal}
      >
        <View style={styles.modalBG}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>¡Incidencia finalizada!</Text>
            <Text style={styles.modalText}>
              Tiempo total: <Text style={{ fontWeight: 'bold', color: '#2edbd1' }}>{format(seconds)}</Text>
            </Text>
            <TouchableOpacity style={styles.btnMini} onPress={handleCerrarModal}>
              <Text style={styles.btnMiniText}>Hecho</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginTop: 8, alignItems: 'center' },
  timer: { fontSize: 20, fontWeight: 'bold', color: '#2edbd1', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 10 },
  btn: {
    backgroundColor: '#2edbd1',
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    marginBottom: 2,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modalBG: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)'
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 22,
    minWidth: 250,
    maxWidth: 340,
    elevation: 8,
    alignItems: 'center'
  },
  modalTitle: { fontWeight: 'bold', fontSize: 20, color: '#199', marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 18, color: '#444' },
  btnMini: {
    backgroundColor: '#2edbd1',
    borderRadius: 7,
    paddingVertical: 9,
    paddingHorizontal: 32,
    marginHorizontal: 5
  },
  btnMiniText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CronometroIncidencia;
