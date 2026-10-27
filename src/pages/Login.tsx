import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../lib/dynamodb';

/* ---------- Ícones (SVG inline) ---------- */
const Icone = ({ d, className = 'w-4 h-4' }: { d: string; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const ICONES = {
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  cadeado: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4',
  olho: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  olhoFechado:
    'M17.9 17.9A10.1 10.1 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.1-5.9M9.9 4.2A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.2 3.2M1 1l22 22M14.1 14.1a3 3 0 1 1-4.2-4.2',
  alerta: 'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  usuario: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  engrenagem:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
};

const CREDENCIAIS_TESTE = [
  { papel: 'Admin', email: 'admin@lumina.com', senha: 'admin123', icone: ICONES.engrenagem },
  { papel: 'Fotógrafo', email: 'fotografo@lumina.com', senha: 'foto123', icone: ICONES.camera },
  { papel: 'Cliente', email: 'cliente@lumina.com', senha: 'user123', icone: ICONES.usuario },
];

// Coloque o arquivo da logo em public/logo.png (ou ajuste o caminho abaixo)
const LOGO_SRC = '/logo.png';

export default function Login() {
  const [logoErro, setLogoErro] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const preencher = (e: string, s: string) => {
    setEmail(e);
    setSenha(s);
    setErro('');
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !senha.trim()) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      // Busca o item no DynamoDB usando a Partition Key (email)
      const command = new GetCommand({
        TableName: 'Usuarios',
        Key: { email: email.trim().toLowerCase() },
      });

      const response = await docClient.send(command);
      const usuario = response.Item;

      if (!usuario) {
        setErro('Usuário não cadastrado.');
        return;
      }

      // Validação da senha inserida com a cadastrada na AWS
      if (usuario.senha !== senha) {
        setErro('Senha incorreta.');
        return;
      }

      // Salva a sessão ativa no navegador com as permissões do usuário
      localStorage.setItem(
        'usuarioLogado',
        JSON.stringify({
          email: usuario.email,
          nome: usuario.nome,
          papel: usuario.papel,
        })
      );

      // Redirecionamento automático pelo papel (role)
      if (usuario.papel === 'admin') {
        navigate('/funcionalidades');
      } else if (usuario.papel === 'fotografo') {
        navigate('/painel-fotografo');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Erro na autenticação DynamoDB:', err);
      setErro('Erro ao conectar à AWS. Verifique suas credenciais no .env.local.');
    } finally {
      setCarregando(false);
    }
  };

  const classeInput =
    'w-full bg-bg-main border border-border-custom rounded-lg pl-10 pr-4 py-3 text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-wine-primary focus:ring-2 focus:ring-wine-primary/20 transition-colors';

  return (
    // Tela cheia: cobre qualquer menu/rodapé do layout e centraliza o login
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg-main">
      <div className="min-h-full flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md">
      {/* Espaço da logo */}
      <div className="flex flex-col items-center mb-8">
        {logoErro ? (
          <span className="w-16 h-16 rounded-2xl bg-wine-primary/10 border border-wine-primary/40 text-wine-primary flex items-center justify-center mb-5">
            <Icone d={ICONES.camera} className="w-8 h-8" />
          </span>
        ) : (
          <img
            src={LOGO_SRC}
            alt="LuminaEvents"
            onError={() => setLogoErro(true)}
            className="h-16 w-auto max-w-[220px] object-contain mb-5"
          />
        )}
        <h1 className="text-2xl font-semibold text-text-main text-center">Acesso ao sistema</h1>
        <p className="text-sm text-text-secondary text-center mt-1.5">
          Entre com suas credenciais para continuar.
        </p>
      </div>

      <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          {/* E-mail */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                <Icone d={ICONES.mail} />
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                aria-invalid={!!erro}
                className={classeInput}
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="senha" className="block text-xs font-medium text-text-secondary mb-1.5">
              Senha
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                <Icone d={ICONES.cadeado} />
              </span>
              <input
                id="senha"
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                aria-invalid={!!erro}
                className={`${classeInput} pr-11`}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((v) => !v)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-text-secondary hover:text-text-main transition-colors"
              >
                <Icone d={mostrarSenha ? ICONES.olhoFechado : ICONES.olho} />
              </button>
            </div>
          </div>

          {/* Erro */}
          {erro && (
            <div
              role="alert"
              className="flex items-start gap-2.5 bg-wine-primary/10 border border-wine-primary/40 text-wine-primary text-xs font-medium p-3 rounded-lg"
            >
              <Icone d={ICONES.alerta} className="w-4 h-4 shrink-0 mt-px" />
              <span>{erro}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full flex items-center justify-center gap-2 bg-wine-primary hover:bg-wine-dark text-bg-main font-medium py-3 rounded-lg transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-wine-primary/60"
          >
            {carregando && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Contas de teste */}
        <div className="mt-8 pt-6 border-t border-border-custom">
          <p className="text-xs font-medium text-text-main">Contas de teste</p>
          <p className="text-xs text-text-secondary mt-0.5 mb-3">
            Clique em uma conta para preencher o formulário.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {CREDENCIAIS_TESTE.map((c) => (
              <button
                key={c.papel}
                type="button"
                onClick={() => preencher(c.email, c.senha)}
                className="flex flex-col items-center gap-1.5 bg-bg-main border border-border-custom hover:border-wine-primary/60 rounded-lg px-2 py-3 text-xs text-text-secondary hover:text-text-main transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-wine-primary/40"
              >
                <span className="text-wine-primary">
                  <Icone d={c.icone} className="w-5 h-5" />
                </span>
                {c.papel}
              </button>
            ))}
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}