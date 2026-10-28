import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type Papel } from '../contexts/AuthContext';

interface PropsRotaProtegida {
  children: ReactNode;
  papeisPermitidos: Papel[];
}

export default function RotaProtegida({ children, papeisPermitidos }: PropsRotaProtegida) {
  const { usuario, carregando } = useAuth();

  // Espera o Cognito e o perfil carregarem, para não expulsar o usuário por engano.
  if (carregando) {
    return <p className="p-6 text-sm text-text-secondary">Carregando...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!papeisPermitidos.includes(usuario.papel)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}