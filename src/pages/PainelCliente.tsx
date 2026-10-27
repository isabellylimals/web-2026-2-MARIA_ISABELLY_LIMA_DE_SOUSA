import { useState, useEffect, useMemo, type FormEvent, type ChangeEvent } from 'react';

interface Orcamento {
  id: number;
  fotografoNome: string;
  tipoEvento: string;
  dataEvento: string;
  horario: string;
  local: string;
  status: string;
  dataSolicitacao: string;
  valorProposto?: string | null;
  observacoes?: string;
  respostaFotografo?: string;
}

type Filtro = 'Todos' | 'Pendente' | 'Respondido' | 'Confirmado' | 'Recusado';
const FILTROS: Filtro[] = ['Todos', 'Pendente', 'Respondido', 'Confirmado', 'Recusado'];

const TAMANHO_MAX_FOTO = 2 * 1024 * 1024; // 2 MB

/* ---------- Ícones (SVG inline, sem emojis) ---------- */
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
  calendario: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  relogio: 'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  local: 'M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  check: 'M20 6L9 17l-5-5',
  fechar: 'M18 6L6 18M6 6l12 12',
  editar: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
  lista: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  usuario: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  telefone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  alerta: 'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  caixa: 'M22 12h-6l-2 3h-4l-2-3H2M5.5 5.1L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1z',
};

/* ---------- Utilidades ---------- */
const getBadgeStatus = (status: string) => {
  switch (status) {
    case 'Respondido':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'Confirmado':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Recusado':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  }
};

const textoStatus = (status: string) => {
  switch (status) {
    case 'Respondido':
      return 'O fotógrafo enviou uma proposta. Aprove para contratar.';
    case 'Confirmado':
      return 'Contratação confirmada.';
    case 'Recusado':
      return 'O fotógrafo não pôde atender este pedido.';
    default:
      return 'Aguardando a resposta do fotógrafo.';
  }
};

const mascaraTelefone = (valor: string) => {
  const n = valor.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 2) return n.length ? `(${n}` : '';
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
};

const formatarData = (iso: string) => {
  const partes = iso.split('-');
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : iso;
};

const lerOrcamentos = (): Orcamento[] => {
  try {
    return JSON.parse(localStorage.getItem('orcamentos_db') || '[]');
  } catch {
    return [];
  }
};

const classeInput =
  'w-full bg-bg-main border border-border-custom rounded-lg px-3 py-2.5 text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-wine-primary focus:ring-2 focus:ring-wine-primary/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

export default function PainelCliente() {
  const sessaoStr = localStorage.getItem('usuarioLogado');
  const usuarioInicial = sessaoStr ? JSON.parse(sessaoStr) : {};

  const [abaAtiva, setAbaAtiva] = useState<'perfil' | 'orcamentos'>('orcamentos');
  const [modoEdicao, setModoEdicao] = useState(false);

  // Estados dos dados do perfil
  const [nome, setNome] = useState(usuarioInicial.nome || 'Cliente Teste');
  const [email, setEmail] = useState(usuarioInicial.email || 'cliente@lumina.com');
  const [telefone, setTelefone] = useState(usuarioInicial.telefone || '(84) 99888-7766');
  const [cidade, setCidade] = useState(usuarioInicial.cidade || 'Pau dos Ferros - RN');
  const [categoriaInteresse, setCategoriaInteresse] = useState(
    usuarioInicial.categoriaInteresse || 'Casamentos'
  );
  const [fotoPerfil, setFotoPerfil] = useState<string>(usuarioInicial.fotoPerfil || '');
  const [erroFoto, setErroFoto] = useState('');

  // Cópia temporária para restaurar os dados caso o usuário cancele a edição
  const [tempDados, setTempDados] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    categoriaInteresse: '',
    fotoPerfil: '',
  });

  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('Todos');
  const [contratandoId, setContratandoId] = useState<number | null>(null);

  useEffect(() => {
    const orcamentosSalvos = lerOrcamentos();

    if (orcamentosSalvos.length === 0) {
      const mockInicial: Orcamento[] = [
        {
          id: 101,
          fotografoNome: 'Lucas Andrade',
          tipoEvento: 'Casamentos',
          dataEvento: '2026-11-20',
          horario: '17:00',
          local: 'Espaço Jardim, Pau dos Ferros - RN',
          status: 'Pendente',
          dataSolicitacao: '28/09/2026',
          observacoes: 'Cobertura completa da cerimônia e recepção.',
        },
      ];
      localStorage.setItem('orcamentos_db', JSON.stringify(mockInicial));
      setOrcamentos(mockInicial);
    } else {
      setOrcamentos(orcamentosSalvos);
    }
  }, []);

  // Fecha o modal de contratação com Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContratandoId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const contagem = useMemo(() => {
    const base: Record<string, number> = { Todos: orcamentos.length };
    orcamentos.forEach((o) => {
      base[o.status] = (base[o.status] || 0) + 1;
    });
    return base;
  }, [orcamentos]);

  const listaFiltrada = useMemo(
    () => orcamentos.filter((o) => filtro === 'Todos' || o.status === filtro),
    [orcamentos, filtro]
  );

  const orcamentoParaContratar = orcamentos.find((o) => o.id === contratandoId) || null;

  const mostrarSucesso = (texto: string) => {
    setMensagemSucesso(texto);
    setTimeout(() => setMensagemSucesso(''), 3000);
  };

  // Upload da imagem de perfil (conversão para Base64)
  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > TAMANHO_MAX_FOTO) {
      setErroFoto('A imagem deve ter no máximo 2 MB.');
      return;
    }

    setErroFoto('');
    const reader = new FileReader();
    reader.onloadend = () => setFotoPerfil(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleEntrarModoEdicao = () => {
    setTempDados({ nome, email, telefone, cidade, categoriaInteresse, fotoPerfil });
    setErroFoto('');
    setModoEdicao(true);
  };

  const handleCancelarEdicao = () => {
    setNome(tempDados.nome);
    setEmail(tempDados.email);
    setTelefone(tempDados.telefone);
    setCidade(tempDados.cidade);
    setCategoriaInteresse(tempDados.categoriaInteresse);
    setFotoPerfil(tempDados.fotoPerfil);
    setErroFoto('');
    setModoEdicao(false);
  };

  const handleSalvarPerfil = (e: FormEvent) => {
    e.preventDefault();

    const usuarioAtualizado = {
      ...usuarioInicial,
      nome,
      email,
      telefone,
      cidade,
      categoriaInteresse,
      fotoPerfil,
    };

    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
    setModoEdicao(false);
    mostrarSucesso('Perfil atualizado com sucesso.');
  };

  const handleConfirmarContratacao = () => {
    if (contratandoId === null) return;

    const atualizados = lerOrcamentos().map((item) =>
      item.id === contratandoId ? { ...item, status: 'Confirmado' } : item
    );
    localStorage.setItem('orcamentos_db', JSON.stringify(atualizados));
    setOrcamentos(atualizados);
    setContratandoId(null);
    mostrarSucesso('Contratação confirmada. O fotógrafo será avisado.');
  };

  const resumo = [
    { rotulo: 'Pedidos enviados', valor: contagem.Todos || 0, cor: 'text-text-main' },
    { rotulo: 'Aguardando resposta', valor: contagem.Pendente || 0, cor: 'text-yellow-500' },
    { rotulo: 'Propostas recebidas', valor: contagem.Respondido || 0, cor: 'text-green-400' },
    { rotulo: 'Confirmados', valor: contagem.Confirmado || 0, cor: 'text-blue-400' },
  ];

  const abas = [
    { id: 'orcamentos' as const, rotulo: 'Meus pedidos', icone: ICONES.lista, contador: orcamentos.length },
    { id: 'perfil' as const, rotulo: 'Dados do perfil', icone: ICONES.usuario },
  ];

  const Avatar = ({ tamanho }: { tamanho: string }) =>
    fotoPerfil ? (
      <img
        src={fotoPerfil}
        alt={nome}
        className={`${tamanho} rounded-full object-cover border-2 border-wine-primary`}
      />
    ) : (
      <div
        className={`${tamanho} bg-wine-primary/10 rounded-full flex items-center justify-center font-semibold text-wine-primary border-2 border-wine-primary`}
      >
        {nome.charAt(0).toUpperCase()}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* CABEÇALHO */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-text-main">Meu painel</h1>
          <p className="text-sm text-text-secondary mt-1">
            Acompanhe suas solicitações de orçamento e gerencie sua conta.
          </p>
        </div>
        <div className="self-start md:self-auto flex items-center gap-3 bg-bg-secondary border border-border-custom pl-2 pr-4 py-2 rounded-full">
          <span className="w-8 h-8 rounded-full overflow-hidden bg-wine-primary/10 border border-wine-primary/40 text-wine-primary text-xs font-semibold flex items-center justify-center">
            {fotoPerfil ? (
              <img src={fotoPerfil} alt="" className="w-full h-full object-cover" />
            ) : (
              nome.charAt(0).toUpperCase()
            )}
          </span>
          <div className="leading-tight">
            <p className="text-sm text-text-main font-medium">{nome}</p>
            <p className="text-[11px] text-text-secondary">Cliente</p>
          </div>
        </div>
      </header>

      {/* AVISO DE SUCESSO */}
      {mensagemSucesso && (
        <div
          role="status"
          className="mb-6 flex items-center gap-3 bg-wine-primary/10 border border-wine-primary text-wine-primary text-sm p-4 rounded-xl"
        >
          <Icone d={ICONES.check} className="w-4 h-4 shrink-0" />
          {mensagemSucesso}
        </div>
      )}

      {/* ABAS */}
      <div className="flex border-b border-border-custom mb-8 gap-6 overflow-x-auto" role="tablist">
        {abas.map((aba) => {
          const ativa = abaAtiva === aba.id;
          return (
            <button
              key={aba.id}
              role="tab"
              aria-selected={ativa}
              onClick={() => setAbaAtiva(aba.id)}
              className={`shrink-0 flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                ativa
                  ? 'border-wine-primary text-wine-primary'
                  : 'border-transparent text-text-secondary hover:text-text-main'
              }`}
            >
              <Icone d={aba.icone} />
              {aba.rotulo}
              {aba.contador !== undefined && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    ativa ? 'bg-wine-primary/10' : 'bg-bg-secondary border border-border-custom'
                  }`}
                >
                  {aba.contador}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ABA 1: MEUS PEDIDOS */}
      {abaAtiva === 'orcamentos' && (
        <div>
          <section aria-label="Resumo" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {resumo.map((r) => (
              <div
                key={r.rotulo}
                className="bg-bg-secondary border border-border-custom rounded-xl px-4 py-4"
              >
                <p className={`text-2xl font-semibold ${r.cor}`}>{r.valor}</p>
                <p className="text-xs text-text-secondary mt-1">{r.rotulo}</p>
              </div>
            ))}
          </section>

          <div className="flex gap-2 overflow-x-auto pb-1 mb-5" role="tablist" aria-label="Filtrar por status">
            {FILTROS.map((f) => {
              const ativo = filtro === f;
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={ativo}
                  onClick={() => setFiltro(f)}
                  className={`shrink-0 text-xs px-3.5 py-2 rounded-full border transition-colors ${
                    ativo
                      ? 'bg-wine-primary text-bg-main border-wine-primary font-medium'
                      : 'bg-bg-secondary text-text-secondary border-border-custom hover:text-text-main hover:border-wine-primary/50'
                  }`}
                >
                  {f}
                  <span className={`ml-1.5 ${ativo ? 'opacity-80' : 'opacity-60'}`}>
                    {contagem[f] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {listaFiltrada.length === 0 ? (
              <div className="bg-bg-secondary border border-border-custom rounded-xl p-10 text-center">
                <span className="mx-auto mb-3 w-12 h-12 rounded-full bg-bg-main border border-border-custom text-text-secondary flex items-center justify-center">
                  <Icone d={ICONES.caixa} className="w-5 h-5" />
                </span>
                <p className="text-sm font-medium text-text-main">
                  {orcamentos.length === 0
                    ? 'Você ainda não fez nenhum pedido'
                    : 'Nenhum pedido com este status'}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {orcamentos.length === 0
                    ? 'Peça um orçamento a um fotógrafo e acompanhe a resposta aqui.'
                    : 'Escolha outro status para ver seus pedidos.'}
                </p>
                {orcamentos.length > 0 && (
                  <button
                    onClick={() => setFiltro('Todos')}
                    className="mt-4 text-xs text-wine-primary hover:underline"
                  >
                    Ver todos os pedidos
                  </button>
                )}
              </div>
            ) : (
              listaFiltrada.map((item) => (
                <article
                  key={item.id}
                  className="bg-bg-secondary border border-border-custom rounded-xl hover:border-wine-primary/40 transition-colors overflow-hidden"
                >
                  <div className="p-5 sm:p-6 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <span className="w-10 h-10 rounded-full bg-wine-primary/10 border border-wine-primary/30 text-wine-primary text-sm font-semibold flex items-center justify-center shrink-0">
                          {item.fotografoNome.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <h3 className="text-base font-semibold text-text-main truncate">
                              {item.fotografoNome}
                            </h3>
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full border ${getBadgeStatus(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {textoStatus(item.status)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs bg-bg-main p-4 rounded-lg border border-border-custom">
                        <div className="flex items-center gap-2.5">
                          <span className="text-wine-primary">
                            <Icone d={ICONES.camera} />
                          </span>
                          <div>
                            <p className="text-text-secondary">Evento</p>
                            <p className="text-text-main font-medium">{item.tipoEvento}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-wine-primary">
                            <Icone d={ICONES.calendario} />
                          </span>
                          <div>
                            <p className="text-text-secondary">Data</p>
                            <p className="text-text-main font-medium">{formatarData(item.dataEvento)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-wine-primary">
                            <Icone d={ICONES.relogio} />
                          </span>
                          <div>
                            <p className="text-text-secondary">Horário</p>
                            <p className="text-text-main font-medium">{item.horario}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-wine-primary">
                            <Icone d={ICONES.local} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-text-secondary">Local</p>
                            <p className="text-text-main font-medium truncate">{item.local}</p>
                          </div>
                        </div>
                      </div>

                      {item.observacoes && (
                        <div className="border-l-2 border-border-custom pl-3">
                          <p className="text-xs text-text-main font-medium mb-0.5">Sua observação</p>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {item.observacoes}
                          </p>
                        </div>
                      )}

                      {item.respostaFotografo && (
                        <div className="text-xs bg-green-500/5 p-3.5 rounded-lg border border-green-500/20">
                          <p className="text-green-400 font-medium mb-1">Mensagem do fotógrafo</p>
                          <p className="text-text-secondary leading-relaxed">{item.respostaFotografo}</p>
                        </div>
                      )}

                      <p className="text-[11px] text-text-secondary">
                        Enviado em {item.dataSolicitacao}
                      </p>
                    </div>

                    {/* PROPOSTA */}
                    <div className="border-t md:border-t-0 md:border-l border-border-custom pt-4 md:pt-0 md:pl-6 flex flex-col justify-between items-stretch md:items-end gap-4 md:min-w-[190px]">
                      <div className="md:text-right">
                        <span className="text-xs text-text-secondary block">Proposta de valor</span>
                        <span
                          className={`block mt-0.5 ${
                            item.valorProposto
                              ? 'text-xl font-bold text-wine-primary'
                              : 'text-sm text-text-secondary'
                          }`}
                        >
                          {item.valorProposto ? item.valorProposto : 'Aguardando resposta'}
                        </span>
                      </div>

                      {item.status === 'Respondido' && (
                        <button
                          onClick={() => setContratandoId(item.id)}
                          className="w-full md:w-auto text-xs bg-wine-primary hover:bg-wine-dark text-bg-main font-medium px-4 py-2.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-wine-primary/60"
                        >
                          Aprovar e contratar
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}

      {/* ABA 2: PERFIL */}
      {abaAtiva === 'perfil' && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* CARTÃO RESUMO */}
          <aside className="bg-bg-secondary border border-border-custom rounded-xl p-6 flex flex-col items-center text-center h-fit">
            <div className="relative mb-4">
              <Avatar tamanho="w-28 h-28 text-4xl" />

              {modoEdicao && (
                <label
                  htmlFor="upload-foto"
                  className="absolute bottom-0 right-0 bg-wine-primary hover:bg-wine-dark text-bg-main p-2 rounded-full cursor-pointer shadow-md transition-colors"
                  title="Alterar foto"
                >
                  <Icone d={ICONES.camera} />
                  <span className="sr-only">Alterar foto</span>
                </label>
              )}
              <input
                id="upload-foto"
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
                disabled={!modoEdicao}
              />
            </div>

            {erroFoto && (
              <p className="flex items-center gap-1.5 text-xs text-wine-primary mb-3" role="alert">
                <Icone d={ICONES.alerta} className="w-3.5 h-3.5 shrink-0" />
                {erroFoto}
              </p>
            )}

            <h2 className="text-lg font-semibold text-text-main">{nome}</h2>
            <p className="text-xs text-text-secondary mb-5">{categoriaInteresse}</p>

            <ul className="w-full pt-5 border-t border-border-custom text-left text-xs text-text-secondary space-y-3">
              <li className="flex items-center gap-2.5 min-w-0">
                <span className="text-wine-primary shrink-0">
                  <Icone d={ICONES.mail} />
                </span>
                <span className="truncate">{email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-wine-primary shrink-0">
                  <Icone d={ICONES.telefone} />
                </span>
                {telefone || 'Não informado'}
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-wine-primary shrink-0">
                  <Icone d={ICONES.local} />
                </span>
                {cidade || 'Não informada'}
              </li>
            </ul>
          </aside>

          {/* FORMULÁRIO */}
          <section className="md:col-span-2 bg-bg-secondary border border-border-custom rounded-xl p-6">
            <div className="flex justify-between items-center gap-3 mb-6 pb-4 border-b border-border-custom">
              <div>
                <h2 className="text-lg font-medium text-text-main">Informações pessoais</h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  {modoEdicao
                    ? 'Altere os campos e salve para atualizar seu perfil.'
                    : 'Mantenha seus dados atualizados para facilitar o contato.'}
                </p>
              </div>

              {!modoEdicao && (
                <button
                  type="button"
                  onClick={handleEntrarModoEdicao}
                  className="shrink-0 flex items-center gap-2 text-xs bg-wine-primary hover:bg-wine-dark text-bg-main px-4 py-2.5 rounded-lg transition-colors font-medium"
                >
                  <Icone d={ICONES.editar} className="w-3.5 h-3.5" />
                  Editar perfil
                </button>
              )}
            </div>

            <form onSubmit={handleSalvarPerfil} className="space-y-5">
              <div>
                <label htmlFor="nome" className="block text-xs font-medium text-text-secondary mb-1.5">
                  Nome completo
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  disabled={!modoEdicao}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  autoComplete="name"
                  className={classeInput}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-1.5">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled={!modoEdicao}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className={classeInput}
                  />
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-xs font-medium text-text-secondary mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <input
                    id="telefone"
                    type="tel"
                    inputMode="numeric"
                    value={telefone}
                    disabled={!modoEdicao}
                    onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    autoComplete="tel"
                    className={classeInput}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="cidade" className="block text-xs font-medium text-text-secondary mb-1.5">
                    Cidade / Estado
                  </label>
                  <input
                    id="cidade"
                    type="text"
                    value={cidade}
                    disabled={!modoEdicao}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Cidade - UF"
                    className={classeInput}
                  />
                </div>

                <div>
                  <label htmlFor="categoria" className="block text-xs font-medium text-text-secondary mb-1.5">
                    Categoria de maior interesse
                  </label>
                  <select
                    id="categoria"
                    value={categoriaInteresse}
                    disabled={!modoEdicao}
                    onChange={(e) => setCategoriaInteresse(e.target.value)}
                    className={classeInput}
                  >
                    <option value="Casamentos">Casamentos</option>
                    <option value="Aniversários">Aniversários</option>
                    <option value="Corporativo">Corporativo</option>
                    <option value="Formaturas">Formaturas</option>
                  </select>
                </div>
              </div>

              {modoEdicao && (
                <div className="pt-5 border-t border-border-custom flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelarEdicao}
                    className="text-xs bg-bg-main border border-border-custom text-text-secondary px-4 py-2.5 rounded-lg hover:text-text-main transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-wine-primary hover:bg-wine-dark text-bg-main text-xs font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Salvar alterações
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>
      )}

      {/* MODAL DE CONTRATAÇÃO */}
      {orcamentoParaContratar && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setContratandoId(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-contratar"
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-secondary border border-border-custom rounded-xl max-w-sm w-full p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 id="titulo-contratar" className="text-base font-semibold text-text-main">
                Aprovar e contratar?
              </h3>
              <button
                onClick={() => setContratandoId(null)}
                aria-label="Fechar"
                className="text-text-secondary hover:text-text-main p-1 -m-1 rounded-md"
              >
                <Icone d={ICONES.fechar} className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 text-xs bg-bg-main border border-border-custom rounded-lg p-4 space-y-1.5">
              <p className="text-text-secondary">
                Fotógrafo:{' '}
                <span className="text-text-main font-medium">{orcamentoParaContratar.fotografoNome}</span>
              </p>
              <p className="text-text-secondary">
                Evento:{' '}
                <span className="text-text-main font-medium">
                  {orcamentoParaContratar.tipoEvento} em {formatarData(orcamentoParaContratar.dataEvento)}
                </span>
              </p>
              <p className="text-text-secondary">
                Valor:{' '}
                <span className="text-wine-primary font-semibold">{orcamentoParaContratar.valorProposto}</span>
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setContratandoId(null)}
                className="text-xs bg-bg-main border border-border-custom text-text-secondary px-4 py-2.5 rounded-lg hover:text-text-main transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmarContratacao}
                className="text-xs bg-wine-primary hover:bg-wine-dark text-bg-main font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Confirmar contratação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}