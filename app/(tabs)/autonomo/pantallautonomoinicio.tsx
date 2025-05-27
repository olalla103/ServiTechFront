import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../context/AuthProvider'; // Ajusta la ruta
// import Fondo from '../../components/fondo'; // No lo usamos aquí para fondo blanc
 
export default function AutonomoHomeScreen() {
  const { user,loading } = useAuth();
  console.log("USER EN PANTALLA ", user);
 /* const router = useRouter();*/

 if (loading || !user) {
  // Puedes poner un loader, un texto de "Cargando..." o simplemente return null;
  return <Text style={{color: "#2edbd1", fontSize: 24, marginTop: 40}}>Cargando...</Text>;
}

  return (
    <View style={styles.container}>
      {/* Cabecera con saludo */}
      <View style={styles.header}>
        <Text style={styles.saludo}>¡Hola, {user.nombre}!</Text>
        <Text style={styles.subtitulo}>Panel de gestión de tu negocio</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        <Card
          title="Incidencias"
          icon="🛠️"
          color="#ffe082"
          /*onPress={() => router.push('/autonomo/facturas')}*/
          badge={3}
        />
        <Card
          title="Clientes"
          icon="👥"
          color="#aed581"
          /*onPress={() => {'/autonomo/clientes'}}*/
        />
        <Card
          title="Facturas"
          icon="💼"
          color="#81d4fa"
          /*onPress={() => {'/autonomo/facturas'}}*/
        />
        <Card
          title="Perfil"
          icon="🧑‍💼"
          color="#b39ddb"
          /*onPress={() => {'/autonomo/perfil'}}*/
        />
      </ScrollView>
    </View>
  );
}

function Card({ title, icon, color, onPress, badge }: any) {
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
    backgroundColor: '#f7f8fa', // Fondo súper claro
    paddingTop: 38,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
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
    width: 150,
    height: 120,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 9,
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