import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthProvider';

type TipoUsuario = "autonomo" | "admin_empresa" | "tecnico" | "cliente";
function getTipoUsuario(user: any): TipoUsuario {
  if (user?.admin_empresa && !!user.especialidad) return "autonomo";
  if (user?.admin_empresa && !user.especialidad) return "admin_empresa";
  if (!user?.admin_empresa && !!user.especialidad) return "tecnico";
  return "cliente";
}

export default function HomeRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      const tipo = getTipoUsuario(user);
      if (tipo === "cliente") {
        router.replace('/usuarioCliente');
      } else if (tipo === "autonomo" || tipo === "tecnico" || tipo === "admin_empresa") {
        router.replace('/autonomo');
      }
    } else {
      router.replace('/auth/login');
    }
  }, [user, loading]);

  return <Text>Cargando...</Text>;
}
