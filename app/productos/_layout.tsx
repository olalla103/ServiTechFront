// /app/usuarioCliente/_layout.tsx
import { Stack } from 'expo-router';

export default function UsuarioClienteLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Aquí NO hace falta poner cada pantalla, se añaden automáticamente */}
    </Stack>
  );
}
