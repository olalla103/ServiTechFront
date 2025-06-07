// app/clientes/pantallaClienteEditar.tsx

import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { getDireccionesUsuario } from '../../utils/handler_direcciones';
import { getUsuarioIdByEmail, getUsuarioPorId } from '../../utils/handler_usuarios';
import FormularioClienteEdicion from './formularioClienteEdit'; // ajusta si es necesario

export default function PantallaClienteEditar() {
  const { clienteEmail } = useLocalSearchParams();
  const router = useRouter();

  // Asegura que el email sea string
  const emailParam = Array.isArray(clienteEmail) ? clienteEmail[0] : clienteEmail;

  // 1. Obtén el ID del usuario a partir del email
  const { data: usuarioId, isLoading: loadingId, error: errorId } = useQuery({
    queryKey: ['usuarioId', emailParam],
    queryFn: () => getUsuarioIdByEmail(emailParam),
    enabled: !!emailParam,
  });

  // 2. Obtén los datos completos del usuario (solo cuando tengas el id)
  const { data: clienteEditar, isLoading: loadingUser, error: errorUser } = useQuery({
    queryKey: ['cliente', usuarioId],
    queryFn: () => usuarioId ? getUsuarioPorId(usuarioId) : null,
    enabled: !!usuarioId,
  });

  // 3. Obtén las direcciones (solo cuando tengas el id)
  const { data: direcciones, isLoading: loadingDir } = useQuery({
    queryKey: ['direcciones', usuarioId],
    queryFn: () => usuarioId ? getDireccionesUsuario(usuarioId) : [],
    enabled: !!usuarioId,
  });

  if (loadingId || loadingUser || loadingDir)
    return <ActivityIndicator size="large" color="#2edbd1" style={{ marginTop: 60 }} />;

  if (errorId || errorUser)
    return <Text style={{ margin: 30, color: 'red' }}>Error al cargar el cliente</Text>;

  if (!clienteEditar)
    return <Text style={{ margin: 30 }}>No se encontró el cliente</Text>;

  return (
    <FormularioClienteEdicion
      onClose={() => router.back()}
      clienteEditar={{
        ...clienteEditar,
        direcciones: direcciones || [],
      }}
    />
  );
}
