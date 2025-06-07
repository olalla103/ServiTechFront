import { Ionicons } from '@expo/vector-icons';
import { Text } from '@react-navigation/elements';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    Keyboard,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import ProductoItem from '../../components/ProductoItem';
import { useAuth } from '../../context/AuthProvider';
import { Producto } from '../../types/producto';
import { getProductos } from '../../utils/handler_productos';

export default function PantallaProductos() {
  const { user } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [headerShadow, setHeaderShadow] = useState(new Animated.Value(0));

  useEffect(() => {
    getProductos()
      .then(data => setProductos(data))
      .catch(err => setError(err.message || 'Error al cargar productos'))
      .finally(() => setLoading(false));
  }, []);

  // Filtrar productos por nombre
  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerBox, {
        shadowOpacity: headerShadow.interpolate({
          inputRange: [0, 8],
          outputRange: [0, 0.12],
        }),
        elevation: headerShadow.interpolate({
          inputRange: [0, 8],
          outputRange: [0, 7],
        }),
      }]}>
        <TouchableOpacity
          style={styles.iconoFlecha}
          onPress={() => router.push('/autonomo')}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={28} color="#14b8a6" />
        </TouchableOpacity>
        <Text style={styles.header}>Productos</Text>
        <View style={styles.userRow}>
          <Ionicons name="person-circle-outline" size={22} color="#94a3b8" />
          <Text style={styles.userText}>{user?.nombre || 'Sin usuario'}</Text>
        </View>
      </Animated.View>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={19} color="#bbb" style={styles.iconoBuscar} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto por nombre"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
        />
      </View>
      <View style={styles.listBox}>
        {loading ? (
          <ActivityIndicator size="large" color="#14b8a6" style={{ marginTop: 70 }} />
        ) : error ? (
          <Text style={styles.errorMsg}>{error}</Text>
        ) : (
          <FlatList
            data={filteredProductos}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <ProductoItem producto={item} />}
            ListEmptyComponent={
              <Text style={styles.emptyMsg}>No hay productos.</Text>
            }
            contentContainerStyle={{ paddingBottom: 50, paddingTop: 5 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderSeparator}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: headerShadow } } }],
              { useNativeDriver: false }
            )}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  headerBox: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 64 : 44,
    paddingBottom: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 7,
    zIndex: 11,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#14b8a6',
    letterSpacing: 1.1,
    textAlign: 'center',
    marginBottom: 2,
    marginTop: 2,
  },
  iconoFlecha: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 55 : 35,
    left: 18,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#0003',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  userText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 15,
    paddingLeft: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '88%',
    alignSelf: 'center',
    marginTop: 16,
    borderRadius: 16,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    shadowColor: '#14b8a64a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 1,
    paddingHorizontal: 10,
  },
  iconoBuscar: {
    marginRight: 6,
    marginLeft: 2,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 16,
    fontSize: 16,
    color: '#222',
    paddingVertical: 10,
    paddingHorizontal: 4,
    minHeight: 38,
  },
  listBox: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  separator: {
    height: 5,
  },
  emptyMsg: {
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 17,
  },
  errorMsg: {
    color: '#e11d48',
    textAlign: 'center',
    marginTop: 55,
    fontWeight: 'bold',
    fontSize: 17,
  },
});
