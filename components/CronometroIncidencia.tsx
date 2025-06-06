import { useAuth } from '@/context/AuthProvider';
import {
  actualizarIncidencia,
  getIncidenciaPorId,
  pausarIncidencia,
  reanudarIncidencia,
} from '@/utils/handler_incidencias';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  incidenciaId: number;
  onChangeEstado?: (pausada: boolean) => void;
  setCronometroIniciado?: (v:boolean) => void;

};

const CronometroIncidencia: React.FC<Props> = ({
  incidenciaId,
  onChangeEstado,
  setCronometroIniciado, 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [iniciado, setIniciado] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  function horasToSeconds(horas: string | null) {
    if (!horas) return 0;
    const [h, m, s] = horas.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  }

  const refreshIncidencia = async () => {
    const nueva = await getIncidenciaPorId(incidenciaId);
    const secs = horasToSeconds(nueva.horas);
    setSeconds(secs);
    setIsRunning(nueva.estado === 'en_reparacion' && !nueva.pausada);
    setFinalizado(nueva.estado === 'resuelta');
    setIniciado(secs > 0 || (nueva.estado === 'en_reparacion' && !nueva.pausada));
  };

  useEffect(() => {
    refreshIncidencia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleIniciar = async () => {
    setLoading(true);
    try {
      await actualizarIncidencia(incidenciaId, {
        estado: 'en_reparacion',
        fecha_inicio: new Date().toISOString().slice(0, 19).replace('T', ' '),
        horas: '00:00:00'
      });
      await queryClient.invalidateQueries({ queryKey: ['incidencia', incidenciaId] });
      setSeconds(0);
      setIsRunning(true);
      setFinalizado(false);
      setIniciado(true);
      setCronometroIniciado?.(true);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const handlePausar = async () => {
    setLoading(true);
    try {
      await pausarIncidencia(incidenciaId, new Date().toISOString());
      await refreshIncidencia();
      const nueva = await getIncidenciaPorId(incidenciaId);
      const nuevosSegundos = horasToSeconds(nueva.horas);
      setSeconds(nuevosSegundos);
      setIsRunning(false);
      setFinalizado(false);
      setIniciado(true);
      setCronometroIniciado?.(false);
      onChangeEstado?.(true);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const handleReanudar = async () => {
    setLoading(true);
    try {
      await reanudarIncidencia(incidenciaId);
      await refreshIncidencia();
      setIniciado(true);
      onChangeEstado?.(false);
      setCronometroIniciado?.(true);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  function formatHoraMySQL(s: number) {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${ss}`;
  }

  const handleParar = async () => {
    setIsRunning(false);
    setFinalizado(true);
    await actualizarIncidencia(incidenciaId, {
      estado: 'resuelta',
      fecha_final: new Date().toISOString().slice(0, 19).replace('T', ' '),
      horas: formatHoraMySQL(seconds),
    });
    queryClient.invalidateQueries({ queryKey: ['incidencia', incidenciaId] });
    queryClient.invalidateQueries({ queryKey: ['incidencias-resueltas', user.id] });
    setCronometroIniciado?.(false);

    
    
  };

  const format = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${ss}`;
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.timer}>{format(seconds)}</Text>
      <View style={styles.row}>
        {!isRunning && !finalizado && !iniciado && (
          <TouchableOpacity style={styles.btn} onPress={handleIniciar} disabled={loading}>
            <Text style={styles.btnText}>Iniciar</Text>
          </TouchableOpacity>
        )}
        {!isRunning && !finalizado && iniciado && (
          <TouchableOpacity style={styles.btn} onPress={handleReanudar} disabled={loading}>
            <Text style={styles.btnText}>Reanudar</Text>
          </TouchableOpacity>
        )}
        {isRunning && !finalizado && (
          <TouchableOpacity style={styles.btn} onPress={handlePausar} disabled={loading}>
            <Text style={styles.btnText}>Pausar</Text>
          </TouchableOpacity>
        )}
        {!finalizado && (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setModalVisible(true)}
            disabled={loading || seconds === 0}
          >
            <Text style={styles.btnText}>Parar</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={{ marginTop: 6, color: finalizado ? "#27ae60" : isRunning ? "#27ae60" : "#888" }}>
        {finalizado
          ? 'Incidencia finalizada'
          : isRunning
            ? 'En curso'
            : iniciado
              ? 'Pausado'
              : 'Sin iniciar'}
      </Text>

      {/* Modal de confirmación */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBG}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>¿Parar incidencia?</Text>
            <Text style={styles.modalText}>¿Seguro que quieres parar la incidencia? No podrás reanudarla después.</Text>
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <TouchableOpacity
                style={styles.btnMini}
                onPress={async() => {setModalVisible(false)
                }
                  
                }
              >
                <Text style={styles.btnMiniText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnMini, { backgroundColor: '#e9445a' }]}
                onPress={async () => {
                  setModalVisible(false);
                   await handleParar(); // espera que handleParar termine
                   console.log("hola")
                }}
              >
                <Text style={styles.btnMiniText}>Parar</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 22,
    minWidth: 250,
    maxWidth: 340,
    elevation: 8,
    alignItems: 'center',
  },
  modalTitle: { fontWeight: 'bold', fontSize: 20, color: '#199', marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 18, color: '#444' },
  btnMini: {
    backgroundColor: '#2edbd1',
    borderRadius: 7,
    paddingVertical: 9,
    paddingHorizontal: 32,
    marginHorizontal: 5,
  },
  btnMiniText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CronometroIncidencia;
