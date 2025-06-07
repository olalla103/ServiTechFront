import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../context/AuthProvider';


// Instanciamos el QueryClient una sola vez
const queryClient = new QueryClient();

// Función para saber el tipo de usuario
type TipoUsuario = "autonomo" | "admin_empresa" | "tecnico" | "cliente";
function getTipoUsuario(user: any): TipoUsuario {
  if (user?.admin_empresa && !!user.especialidad) return "autonomo";
  if (user?.admin_empresa && !user.especialidad) return "admin_empresa";
  if (!user?.admin_empresa && !!user.especialidad) return "tecnico";
  return "cliente";
}

// Este componente va dentro del AuthProvider
function RootNavigator() {
  console.log("🌍 PATHNAME ACTUAL:", usePathname());
  const { user, loading, login, logout } = useAuth();

  // Espera a que cargue la sesión (importante)
  if (loading) return null; // O un loader/spinner si quieres

  // Si no hay usuario logueado, mostramos las pantallas de auth
  if (!user) {
    console.log('Sin usuario: stack auth');
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth"/>
        {/* Otras screens de auth si tienes */}
      </Stack>
    );
  }

  // Ya hay usuario logueado: elegimos pantalla por tipo
  const tipo = getTipoUsuario(user);

  if (tipo === "autonomo") {
    console.log('Stack autonomo');
    // Home autónomo, más adelante puedes anidar aquí un stack/tab propio para autónomos
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="autonomo"/>
        <Stack.Screen name="incidencias"/>
        <Stack.Screen name="clientes"/>
        <Stack.Screen name="facturas"/>
        <Stack.Screen name="productos"/>
      </Stack>
    );
  }

  // if (tipo === "admin_empresa") {
  //   // Stack de admin empresa
  // }
  if (tipo === "tecnico") {
    console.log('Stack tecnico');
    // Stack de técnico
    return(
      <Stack>
        <Stack.Screen name="incidencias"/>
        <Stack.Screen name="clientes"/>
        <Stack.Screen name="facturas"/>
        <Stack.Screen name="productos"/>
      </Stack>
    );
  }
 if (tipo === "cliente") {
     // Stack de cliente
    console.log('Stack cliente');
     return(
      <Stack screenOptions={{headerShown: false}}>
       <Stack.Screen name="usuarioCliente"/>
      </Stack>
     );
      
   }

  // Si no coincide ninguno, fallback
  return (
    <Stack>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootNavigator />
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
