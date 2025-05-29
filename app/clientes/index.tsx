import { useQuery } from '@tanstack/react-query';
import React from 'react';
import ListaClientes from '../../components/ListaClientes';
import { useAuth } from '../../context/AuthProvider';
import { getClientesPorEmpresa } from '../../utils/handler_usuarios';

export default function PantallaClientes() {
  const { user } = useAuth();

  const clientesQuery = useQuery({
    queryKey: ['clientes-empresa', user?.empresa_id],
    queryFn: () => getClientesPorEmpresa(user.empresa_id),
    enabled: !!user?.empresa_id,
  });

  return (
    <ListaClientes
      query={clientesQuery}
      emptyMessage="No hay clientes para esta empresa."
    />
  );
}
