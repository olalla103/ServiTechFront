import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthProvider';

export default function PantallaInicioCliente() {
  const { user, loading, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (loading || !user) {
    return <Text style={{ color: "#2edbd1", fontSize: 24, marginTop: 70 }}>Cargando...</Text>;
  }

  // Función para cerrar sesión
  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login'); // Vuelve al login tras logout
  };

  return (
    <>
    <View style={[styles.container, { paddingTop: insets.top + 50 }]}>
      {/* Botón logout arriba a la derecha */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={28} color="#2edbd1" />
      </TouchableOpacity>


      {/* Cabecera con saludo */}
      <View style={styles.header}>
        <Text style={styles.saludo}>¡Hola, {user.nombre}!</Text>
        <Text style={styles.subtitulo}>Aquí podrás reportar tus incidencias</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.grid, { paddingTop: 80 }]} showsVerticalScrollIndicator={false}>
        <Card
          title="Reportar Incidencia"
          icon="🛠️"
          color="#ffe082"
          onPress={() => router.push('/incidencias/crearIncidenciaForm')} badge={undefined}        />
      </ScrollView>
    </View>
    </>
  );
}

type CardProps = {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
  badge?: number;
};

function Card({ title, icon, color, onPress, badge }: CardProps) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.84}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 70,
    paddingHorizontal: 16,
  },
  logoutBtn: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 19,
    padding: 8,
    elevation: 4,
    shadowColor: '#e9445a33',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
    marginTop: 50
  },
  saludo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2edbd1',
    marginBottom: 2,
    textAlign: 'center',
    textShadowColor: '#0001',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  subtitulo: {
    color: '#444',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
    opacity: 0.87,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: 14,
    gap: 16,
  },
  card: {
    width: '47%',
    minWidth: 150,
    height: 120,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#0004',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    position: 'relative',
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 22,
    backgroundColor: '#ff5252',
    borderRadius: 14,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
