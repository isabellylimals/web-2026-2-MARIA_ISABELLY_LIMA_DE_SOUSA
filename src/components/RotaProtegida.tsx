import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PropsRotaProtegida {
  children: ReactNode;
  papeisPermitidos: Array<'admin' | 'fotografo' | 'cliente'>;
}

export default function RotaProtegida({ children, papeisPermitidos }: PropsRotaProtegida) {
  const sessao = localStorage.getItem('usuarioLogado');

  if (!sessao) {
    return <Navigate to="/login" replace />;
  }

  try {
    const usuario = JSON.parse(sessao);
    if (!papeisPermitidos.includes(usuario.papel)) {
      // Se não tiver permissão para esta rota, redireciona para a Home
      return <Navigate to="/" replace />;
    }
  } catch (err) {
    localStorage.removeItem('usuarioLogado');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}