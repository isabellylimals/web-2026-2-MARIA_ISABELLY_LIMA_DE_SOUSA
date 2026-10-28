import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export type Papel = 'admin' | 'fotografo' | 'cliente';

export interface Usuario {
  email: string;
  nome: string;
  papel: Papel;
}

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  erroPerfil: string;
  recarregarPerfil: () => Promise<Usuario | null>;
  sair: () => Promise<void>;
}

const PERFIL_URL = 'https://6vm9dankfh.execute-api.us-east-1.amazonaws.com/perfil';
const PAPEIS: Papel[] = ['admin', 'fotografo', 'cliente'];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroPerfil, setErroPerfil] = useState('');
  // Evita que uma chamada antiga sobrescreva o resultado de uma mais nova.
  const contador = useRef(0);

  const limpar = useCallback((mensagem = '') => {
    setUsuario(null);
    setErroPerfil(mensagem);
    localStorage.removeItem('usuarioLogado');
  }, []);

  const recarregarPerfil = useCallback(async (): Promise<Usuario | null> => {
    const minhaVez = ++contador.current;

    try {
      const sessao = await fetchAuthSession();
      const token = sessao.tokens?.idToken?.toString();

      if (!token) {
        if (minhaVez === contador.current) limpar();
        return null;
      }

      const resposta = await fetch(PERFIL_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resposta.ok) {
        throw new Error(`A API de perfil retornou o status ${resposta.status}.`);
      }

      const dados = (await resposta.json()) as Partial<Usuario>;

      if (!dados.email || !dados.nome || !PAPEIS.includes(dados.papel as Papel)) {
        throw new Error('O perfil retornado está incompleto ou com papel inválido.');
      }

      const perfil: Usuario = {
        email: dados.email,
        nome: dados.nome,
        papel: dados.papel as Papel,
      };

      if (minhaVez === contador.current) {
        setUsuario(perfil);
        setErroPerfil('');
        localStorage.setItem('usuarioLogado', JSON.stringify(perfil));
      }

      return perfil;
    } catch (erro) {
      console.error('Erro ao carregar o perfil do usuário:', erro);
      if (minhaVez === contador.current) {
        limpar('Não foi possível carregar o perfil do usuário.');
      }
      return null;
    } finally {
      if (minhaVez === contador.current) setCarregando(false);
    }
  }, [limpar]);

  const sair = useCallback(async () => {
    try {
      await signOut();
    } catch (erro) {
      console.error('Erro ao encerrar sessão do Cognito:', erro);
    } finally {
      contador.current++;
      limpar();
      setCarregando(false);
    }
  }, [limpar]);

  useEffect(() => {
    recarregarPerfil();

    const cancelar = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') {
        recarregarPerfil();
      } else if (payload.event === 'signedOut') {
        contador.current++;
        limpar();
        setCarregando(false);
      }
    });

    return cancelar;
  }, [recarregarPerfil, limpar]);

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, erroPerfil, recarregarPerfil, sair }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }
  return contexto;
}