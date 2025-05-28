import { Stack } from 'expo-router';

export default function AutonomoLayout() {
  return <Stack screenOptions={{ headerShown: false }} />; // Si no quieres header automático
}
