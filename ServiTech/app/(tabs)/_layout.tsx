// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AuthProvider } from '@/components/AuthProvider';
import { useColorScheme } from '@/hooks/useColorScheme';

// Crea el cliente **una sola vez**, fuera del componente
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          {/*
            Aquí usamos **Stack** vacío: Expo Router detecta
            todos los archivos en app/ y registra rutas automáticamente.
          */}
          <Stack
            screenOptions={{
              headerShown: false,
              // Si quisieras pestañas, en lugar de Stack usarías <Tabs>...
              // Pero si de verdad quieres tabs, cambia esto por:
              // <Tabs screenOptions={{ ... }} />
              // y en babel/metro no mezcles Stack y Tabs en el mismo layout.
            }}
          />
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
