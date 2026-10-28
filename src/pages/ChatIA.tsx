import { useEffect, useRef, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

type Mensagem = {
  tipo: 'usuario' | 'assistente';
  texto: string;
};

export default function ChatIA() {
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [conectado, setConectado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
  let websocket: WebSocket | null = null;
  let cancelado = false;

  const conectar = async () => {
    try {
      const sessao = await fetchAuthSession();
      const token = sessao.tokens?.idToken?.toString();

      if (!token) {
        setErro('Sessão do Cognito não encontrada. Faça login novamente.');
        return;
      }

      if (cancelado) return;

      const url = new URL(
        'wss://dwpt8n9cgd.execute-api.us-east-1.amazonaws.com/dev/'
      );

      url.searchParams.set('token', token);

      websocket = new WebSocket(url.toString());
      websocketRef.current = websocket;

      websocket.onopen = () => {
        console.log('Conexão WebSocket estabelecida.');
        setConectado(true);
        setErro('');
      };

      websocket.onmessage = (evento) => {
        console.log('Mensagem recebida:', evento.data);

        try {
          const resposta = JSON.parse(evento.data);

          if (
            resposta.type === 'connected' ||
            resposta.type === 'ping' ||
            resposta.type === 'pong'
          ) {
            return;
          }

          if (resposta.type === 'error') {
            setErro(
              resposta.message ||
                'Não foi possível obter uma resposta da IA.'
            );
            setCarregando(false);
            return;
          }

          if (resposta.type === 'response') {
            const texto = resposta.message;

            if (typeof texto === 'string' && texto.trim()) {
              setMensagens((anteriores) => [
                ...anteriores,
                { tipo: 'assistente', texto },
              ]);
            }

            setCarregando(false);
            return;
          }

          console.log('Mensagem WebSocket ignorada:', resposta);
        } catch {
          console.error(
            'Mensagem recebida em formato JSON inválido:',
            evento.data
          );

          setErro('O servidor enviou uma resposta em formato inválido.');
          setCarregando(false);
        }
      };

      websocket.onerror = () => {
        console.error('Erro na conexão WebSocket.');
        setErro('Ocorreu um erro na conexão com o servidor.');
      };

      websocket.onclose = () => {
        console.log('Conexão WebSocket encerrada.');
        setConectado(false);
        setCarregando(false);
      };
    } catch (erroConexao) {
      console.error('Erro ao obter sessão ou conectar ao WebSocket:', erroConexao);
      setErro('Não foi possível autenticar a conexão. Faça login novamente.');
    }
  };

  void conectar();

  return () => {
    cancelado = true;
    websocket?.close();
    websocketRef.current = null;
  };
}, []);
  const enviarMensagem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const texto = mensagem.trim();
    const websocket = websocketRef.current;

    if (!texto || carregando) return;

    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      setErro('Não foi possível conectar à API. Tente novamente.');
      return;
    }

    setMensagens((anteriores) => [
      ...anteriores,
      { tipo: 'usuario', texto },
    ]);

    setMensagem('');
    setErro('');
    setCarregando(true);

    websocket.send(JSON.stringify({ message: texto }));
  };

  return (
    <section className="min-h-[70vh] px-4 py-10">
      <div className="mx-auto flex max-w-3xl flex-col overflow-hidden rounded-2xl border border-border-custom bg-bg-secondary shadow-sm">
        <header className="border-b border-border-custom p-6">
          <h1 className="text-2xl font-semibold text-text-main">
            Assistente IA
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Converse com nosso assistente inteligente.
          </p>

          <p className="mt-2 text-sm">
            Status:{' '}
            <span className={conectado ? 'text-green-600' : 'text-red-600'}>
              {conectado ? 'Conectado' : 'Desconectado'}
            </span>
          </p>
        </header>

        <div
          className="flex min-h-80 flex-1 flex-col gap-4 overflow-y-auto p-6"
          aria-live="polite"
        >
          {mensagens.length === 0 && (
            <div className="m-auto max-w-md text-center">
              <p className="text-lg font-medium text-text-main">
                Como posso ajudar?
              </p>

              <p className="mt-2 text-sm text-text-secondary">
                Digite sua pergunta abaixo para começar a conversa.
              </p>
            </div>
          )}

          {mensagens.map((item, indice) => (
            <div
              key={indice}
              className={`max-w-[85%] whitespace-pre-wrap break-words rounded-xl px-4 py-3 text-sm ${
                item.tipo === 'usuario'
                  ? 'self-end bg-wine-primary text-white'
                  : 'self-start border border-border-custom bg-bg-main text-text-main'
              }`}
            >
              {item.texto}
            </div>
          ))}

          {carregando && (
            <p className="self-start text-sm text-text-secondary">
              Aguardando resposta do assistente...
            </p>
          )}

          {erro && (
            <p role="alert" className="text-sm text-red-600">
              {erro}
            </p>
          )}
        </div>

        <form
          onSubmit={enviarMensagem}
          className="flex gap-3 border-t border-border-custom p-4"
        >
          <input
            type="text"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite sua pergunta..."
            aria-label="Digite sua pergunta"
            className="min-w-0 flex-1 rounded-lg border border-border-custom bg-bg-main px-4 py-3 text-sm text-text-main outline-none focus:border-wine-primary"
          />

          <button
            type="submit"
            disabled={!mensagem.trim() || carregando || !conectado}
            className="rounded-lg bg-wine-primary px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
