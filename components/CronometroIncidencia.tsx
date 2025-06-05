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
};

const CronometroIncidencia: React.FC<Props> = ({
  incidenciaId,
  onChangeEstado,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [iniciado, setIniciado] = useState(false); // Nuevo estado para saber si alguna vez se inició
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Conversión de "HH:MM:SS" a segundos
  function horasToSeconds(horas: string | null) {
    if (!horas) return 0;
    const [h, m, s] = horas.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  }

  // Refresca la incidencia y actualiza el cronómetro
const refreshIncidencia = async () => {
  const nueva = await getIncidenciaPorId(incidenciaId);
  const secs = horasToSeconds(nueva.horas); // Esto siempre lo tienes que poner
  setSeconds(secs); // <-- aquí SIEMPRE refresca con el tiempo del back
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
      setSeconds(0);         // Reinicia contador SOLO al iniciar
      setIsRunning(true);    // ¡Arranca el cronómetro!
      setFinalizado(false);  // Por si se usó parar antes
      setIniciado(true);     // Marca como iniciado
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
    // Si el backend devuelve 0, mantenemos el valor anterior
    setSeconds(nuevosSegundos);
    setIsRunning(false);
    setFinalizado(false);
    setIniciado(true); // Sigue marcado como iniciado
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
    await refreshIncidencia(); // <-- Aquí recuperas el tiempo acumulado
    setIniciado(true);
    onChangeEstado?.(false);
  } catch (e) {
    console.log(e);
  }
  setLoading(false);
};


  function formatHoraMySQL(s: number) {
    const h = Math.floor(s / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${ss}`;
  }

  const handleParar = async () => {
    setIsRunning(false);
    setFinalizado(true);
    setModalVisible(true);

    await actualizarIncidencia(incidenciaId, {
      estado: 'resuelta',
      fecha_final: new Date().toISOString().slice(0, 19).replace('T', ' '),
      horas: formatHoraMySQL(seconds),
    });

    queryClient.invalidateQueries({ queryKey: ['incidencia', incidenciaId] });
    queryClient.invalidateQueries({ queryKey: ['incidencias-resueltas', user.id] });
  };

  const handleCerrarModal = () => {
    setModalVisible(false);
  };

  const format = (s: number) => {
    const h = Math.floor(s / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${ss}`;
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.timer}>{format(seconds)}</Text>
      <View style={styles.row}>
        {/* Botón INICIAR solo si aún no ha empezado */}
        {!isRunning && !finalizado && !iniciado && (
          <TouchableOpacity style={styles.btn} onPress={handleIniciar} disabled={loading}>
            <Text style={styles.btnText}>Iniciar</Text>
          </TouchableOpacity>
        )}

        {/* Botón REANUDAR si ya se inició pero está pausado */}
        {!isRunning && !finalizado && iniciado && (
          <TouchableOpacity style={styles.btn} onPress={handleReanudar} disabled={loading}>
            <Text style={styles.btnText}>Reanudar</Text>
          </TouchableOpacity>
        )}

        {/* Botón PAUSAR si está corriendo */}
        {isRunning && !finalizado && (
          <TouchableOpacity style={styles.btn} onPress={handlePausar} disabled={loading}>
            <Text style={styles.btnText}>Pausar</Text>
          </TouchableOpacity>
        )}

        {/* Botón PARAR siempre visible salvo si ya está finalizado */}
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

      {/* ESTADO DEL CRONÓMETRO */}
      <Text style={{ marginTop: 6, color: finalizado ? "#27ae60" : isRunning ? "#27ae60" : "#888" }}>
        {finalizado
          ? 'Incidencia finalizada'
          : isRunning
          ? 'En curso'
          : iniciado
          ? 'Pausado'
          : 'Sin iniciar'}
      </Text>

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
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.btnMiniText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnMini, { backgroundColor: '#e9445a' }]}
          onPress={async () => {
            setModalVisible(false);
            await handleParar(); // Aquí tu función de parar
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