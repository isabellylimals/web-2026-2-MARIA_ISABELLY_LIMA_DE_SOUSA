import { useState, useEffect, useMemo, type FormEvent, type ChangeEvent } from 'react';

interface Orcamento {
  id: number;
  fotografoId?: number;
  fotografoNome: string;
  clienteNome: string;
  clienteEmail: string;
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
type Aba = 'solicitacoes' | 'perfil';

const FILTROS: Filtro[] = ['Todos', 'Pendente', 'Respondido', 'Confirmado', 'Recusado'];
const CATEGORIAS = ['Casamentos', 'Aniversários', 'Corporativo', 'Formaturas'];
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
  busca: 'M21 21l-4.3-4.3M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  fechar: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  caixa: 'M22 12h-6l-2 3h-4l-2-3H2M5.5 5.1L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1z',
  editar: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
  lista: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  usuario: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  telefone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  alerta: 'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
};

/* ---------- Utilidades ---------- */
const iniciais = (nome: string) =>
  (nome || 'C')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

const formatarMoeda = (valor: string) => {
  const numeros = valor.replace(/\D/g, '');
  if (!numeros) return '';
  const numero = Number(numeros) / 100;
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const mascaraTelefone = (valor: string) => {
  const n = valor.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 2) return n.length ? `(${n}` : '';
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
};

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

const lerOrcamentos = (): Orcamento[] => {
  try {
    return JSON.parse(localStorage.getItem('orcamentos_db') || '[]');
  } catch {
    return [];
  }
};

const lerSessao = () => {
  try {
    const s = localStorage.getItem('usuarioLogado');
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
};

const classeInput =
  'w-full bg-bg-main border border-border-custom rounded-lg px-3 py-2.5 text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-wine-primary focus:ring-2 focus:ring-wine-primary/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

export default function PainelFotografo() {
  const usuarioInicial = lerSessao();

  const [abaAtiva, setAbaAtiva] = useState<Aba>('solicitacoes');

  /* ----- Solicitações ----- */
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('Todos');
  const [busca, setBusca] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);
  const [recusandoId, setRecusandoId] = useState<number | null>(null);

  const [valorProposto, setValorProposto] = useState('');
  const [respostaFotografo, setRespostaFotografo] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  /* ----- Perfil ----- */
  const [modoEdicao, setModoEdicao] = useState(false);
  const [nome, setNome] = useState<string>(usuarioInicial.nome || 'Lucas Andrade');
  const [email, setEmail] = useState<string>(usuarioInicial.email || 'fotografo@lumina.com');
  const [telefone, setTelefone] = useState<string>(usuarioInicial.telefone || '');
  const [cidade, setCidade] = useState<string>(usuarioInicial.cidade || '');
  const [categoria, setCategoria] = useState<string>(usuarioInicial.categoria || 'Casamentos');
  const [instagram, setInstagram] = useState<string>(usuarioInicial.instagram || '');
  const [sobre, setSobre] = useState<string>(usuarioInicial.sobre || '');
  const [fotoPerfil, setFotoPerfil] = useState<string>(usuarioInicial.fotoPerfil || '');
  const [erroFoto, setErroFoto] = useState('');

  // Cópia para restaurar os dados caso o usuário cancele a edição
  const [tempDados, setTempDados] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    categoria: '',
    instagram: '',
    sobre: '',
    fotoPerfil: '',
  });

  useEffect(() => {
    setOrcamentos(lerOrcamentos());
  }, []);

  // Fecha modais com Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalAberto(false);
        setRecusandoId(null);
      }
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

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return orcamentos.filter((o) => {
      const passaFiltro = filtro === 'Todos' || o.status === filtro;
      const passaBusca =
        !termo ||
        (o.clienteNome || '').toLowerCase().includes(termo) ||
        (o.clienteEmail || '').toLowerCase().includes(termo) ||
        (o.tipoEvento || '').toLowerCase().includes(termo);
      return passaFiltro && passaBusca;
    });
  }, [orcamentos, filtro, busca]);

  const mostrarSucesso = (texto: string) => {
    setMensagemSucesso(texto);
    setTimeout(() => setMensagemSucesso(''), 3000);
  };

  /* ----- Ações: solicitações ----- */
  const handleAbrirModalResposta = (item: Orcamento) => {
    setOrcamentoSelecionado(item);
    setValorProposto(item.valorProposto || '');
    setRespostaFotografo(item.respostaFotografo || '');
    setModalAberto(true);
  };

  const handleEnviarProposta = (e: FormEvent) => {
    e.preventDefault();
    if (!orcamentoSelecionado) return;

    const atualizados = lerOrcamentos().map((item) =>
      item.id === orcamentoSelecionado.id
        ? { ...item, valorProposto, respostaFotografo, status: 'Respondido' }
        : item
    );

    localStorage.setItem('orcamentos_db', JSON.stringify(atualizados));
    setOrcamentos(atualizados);
    setModalAberto(false);
    mostrarSucesso('Proposta enviada ao cliente com sucesso.');
  };

  const handleConfirmarRecusa = () => {
    if (recusandoId === null) return;

    const atualizados = lerOrcamentos().map((item) =>
      item.id === recusandoId ? { ...item, status: 'Recusado' } : item
    );

    localStorage.setItem('orcamentos_db', JSON.stringify(atualizados));
    setOrcamentos(atualizados);
    setRecusandoId(null);
    mostrarSucesso('Solicitação recusada.');
  };

  /* ----- Ações: perfil ----- */
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
    setTempDados({ nome, email, telefone, cidade, categoria, instagram, sobre, fotoPerfil });
    setErroFoto('');
    setModoEdicao(true);
  };

  const handleCancelarEdicao = () => {
    setNome(tempDados.nome);
    setEmail(tempDados.email);
    setTelefone(tempDados.telefone);
    setCidade(tempDados.cidade);
    setCategoria(tempDados.categoria);
    setInstagram(tempDados.instagram);
    setSobre(tempDados.sobre);
    setFotoPerfil(tempDados.fotoPerfil);
    setErroFoto('');
    setModoEdicao(false);
  };

  const handleSalvarPerfil = (e: FormEvent) => {
    e.preventDefault();

    const usuarioAtualizado = {
      ...lerSessao(),
      nome,
      email,
      telefone,
      cidade,
      categoria,
      instagram,
      sobre,
      fotoPerfil,
    };

    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
    setModoEdicao(false);
    mostrarSucesso('Perfil atualizado com sucesso.');
  };

  const resumo = [
    { rotulo: 'Total recebido', valor: contagem.Todos || 0, cor: 'text-text-main' },
    { rotulo: 'Aguardando resposta', valor: contagem.Pendente || 0, cor: 'text-yellow-500' },
    { rotulo: 'Propostas enviadas', valor: contagem.Respondido || 0, cor: 'text-green-400' },
    { rotulo: 'Confirmados', valor: contagem.Confirmado || 0, cor: 'text-blue-400' },
  ];

  const abas = [
    { id: 'solicitacoes' as const, rotulo: 'Solicitações', icone: ICONES.lista, contador: orcamentos.length },
    { id: 'perfil' as const, rotulo: 'Meu perfil', icone: ICONES.usuario },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* CABEÇALHO */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-text-main">Painel do Fotógrafo</h1>
          <p className="text-sm text-text-secondary mt-1">
            Responda aos pedidos de orçamento e mantenha seu perfil atualizado.
          </p>
        </div>
        <div className="self-start md:self-auto flex items-center gap-3 bg-bg-secondary border border-border-custom pl-2 pr-4 py-2 rounded-full">
          <span className="w-8 h-8 rounded-full overflow-hidden bg-wine-primary/10 border border-wine-primary/40 text-wine-primary text-xs font-semibold flex items-center justify-center">
            {fotoPerfil ? (
              <img src={fotoPerfil} alt="" className="w-full h-full object-cover" />
            ) : (
              iniciais(nome)
            )}
          </span>
          <div className="leading-tight">
            <p className="text-sm text-text-main font-medium">{nome}</p>
            <p className="text-[11px] text-text-secondary">Fotógrafo</p>
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

      {/* ============ ABA: SOLICITAÇÕES ============ */}
      {abaAtiva === 'solicitacoes' && (
        <div>
          {/* RESUMO */}
          <section aria-label="Resumo" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
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

          {/* FILTROS E BUSCA */}
          <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filtrar por status">
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

            <div className="relative w-full lg:w-72">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                <Icone d={ICONES.busca} />
              </span>
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por cliente, e-mail ou evento"
                aria-label="Buscar solicitações"
                className="w-full bg-bg-secondary border border-border-custom rounded-lg pl-9 pr-3 py-2.5 text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-wine-primary"
              />
            </div>
          </section>

          {/* LISTAGEM */}
          <section className="space-y-4" aria-label="Solicitações recebidas">
            {listaFiltrada.length === 0 ? (
              <div className="bg-bg-secondary border border-border-custom rounded-xl p-10 text-center">
                <span className="mx-auto mb-3 w-12 h-12 rounded-full bg-bg-main border border-border-custom text-text-secondary flex items-center justify-center">
                  <Icone d={ICONES.caixa} className="w-5 h-5" />
                </span>
                <p className="text-sm font-medium text-text-main">
                  {orcamentos.length === 0
                    ? 'Nenhuma solicitação recebida ainda'
                    : 'Nenhum resultado para este filtro'}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {orcamentos.length === 0
                    ? 'Quando um cliente pedir um orçamento, ele aparecerá aqui.'
                    : 'Tente outro status ou limpe a busca.'}
                </p>
                {orcamentos.length > 0 && (
                  <button
                    onClick={() => {
                      setFiltro('Todos');
                      setBusca('');
                    }}
                    className="mt-4 text-xs text-wine-primary hover:underline"
                  >
                    Limpar filtros
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
                      {/* Cliente */}
                      <div className="flex items-start gap-3">
                        <span className="w-10 h-10 rounded-full bg-wine-primary/10 border border-wine-primary/30 text-wine-primary text-sm font-semibold flex items-center justify-center shrink-0">
                          {iniciais(item.clienteNome)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <h3 className="text-base font-semibold text-text-main truncate">
                              {item.clienteNome || 'Cliente'}
                            </h3>
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full border ${getBadgeStatus(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1.5 truncate">
                            <Icone d={ICONES.mail} className="w-3.5 h-3.5 shrink-0" />
                            {item.clienteEmail}
                          </p>
                        </div>
                      </div>

                      {/* Detalhes do evento */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs bg-bg-main p-4 rounded-lg border border-border-custom">
                        <div className="flex items-center gap-2.5">
                          <span className="text-wine-primary">
                            <Icone d={ICONES.camera} />
                          </span>
                          <div>
                            <p className="text-text-secondary">Tipo de evento</p>
                            <p className="text-text-main font-medium">{item.tipoEvento}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-wine-primary">
                            <Icone d={ICONES.calendario} />
                          </span>
                          <div>
                            <p className="text-text-secondary">Data</p>
                            <p className="text-text-main font-medium">{item.dataEvento}</p>
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
                          <p className="text-xs text-text-main font-medium mb-0.5">Detalhes do cliente</p>
                          <p className="text-xs text-text-secondary leading-relaxed">{item.observacoes}</p>
                        </div>
                      )}

                      {item.valorProposto && (
                        <div className="text-xs bg-green-500/5 p-3.5 rounded-lg border border-green-500/20">
                          <p className="text-green-400 font-medium">
                            Proposta enviada: {item.valorProposto}
                          </p>
                          {item.respostaFotografo && (
                            <p className="mt-1 text-text-secondary leading-relaxed">
                              {item.respostaFotografo}
                            </p>
                          )}
                        </div>
                      )}

                      <p className="text-[11px] text-text-secondary">
                        Recebido em {item.dataSolicitacao}
                      </p>
                    </div>

                    {/* AÇÕES */}
                    <div className="border-t md:border-t-0 md:border-l border-border-custom pt-4 md:pt-0 md:pl-6 flex flex-row md:flex-col justify-center items-stretch gap-3 md:min-w-[190px]">
                      {item.status !== 'Recusado' && (
                        <button
                          onClick={() => handleAbrirModalResposta(item)}
                          className="flex-1 md:flex-none text-xs bg-wine-primary hover:bg-wine-dark text-bg-main font-medium px-4 py-2.5 rounded-lg transition-colors text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-wine-primary/60"
                        >
                          {item.status === 'Respondido' ? 'Alterar proposta' : 'Enviar proposta'}
                        </button>
                      )}

                      {item.status === 'Pendente' && (
                        <button
                          onClick={() => setRecusandoId(item.id)}
                          className="flex-1 md:flex-none text-xs bg-bg-main border border-border-custom text-red-400 hover:bg-red-500/10 hover:border-red-500/30 px-4 py-2.5 rounded-lg transition-colors text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                        >
                          Recusar pedido
                        </button>
                      )}

                      {item.status === 'Recusado' && (
                        <p className="text-xs text-text-secondary md:text-right">
                          Pedido recusado. Nenhuma ação disponível.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      )}

      {/* ============ ABA: MEU PERFIL ============ */}
      {abaAtiva === 'perfil' && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* CARTÃO RESUMO */}
          <aside className="bg-bg-secondary border border-border-custom rounded-xl p-6 flex flex-col items-center text-center h-fit">
            <div className="relative mb-4">
              {fotoPerfil ? (
                <img
                  src={fotoPerfil}
                  alt={nome}
                  className="w-28 h-28 rounded-full object-cover border-2 border-wine-primary"
                />
              ) : (
                <div className="w-28 h-28 bg-wine-primary/10 rounded-full flex items-center justify-center text-4xl font-semibold text-wine-primary border-2 border-wine-primary">
                  {iniciais(nome)}
                </div>
              )}

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
            <p className="text-xs text-text-secondary mb-5">Fotógrafo de {categoria.toLowerCase()}</p>

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
              <li className="flex items-center gap-2.5 min-w-0">
                <span className="text-wine-primary shrink-0">
                  <Icone d={ICONES.link} />
                </span>
                <span className="truncate">{instagram || 'Não informado'}</span>
              </li>
            </ul>
          </aside>

          {/* FORMULÁRIO */}
          <section className="md:col-span-2 bg-bg-secondary border border-border-custom rounded-xl p-6">
            <div className="flex justify-between items-center gap-3 mb-6 pb-4 border-b border-border-custom">
              <div>
                <h2 className="text-lg font-medium text-text-main">Informações profissionais</h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  {modoEdicao
                    ? 'Altere os campos e salve para atualizar seu perfil.'
                    : 'Estes dados ajudam os clientes a conhecer e contatar você.'}
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
                    Categoria principal
                  </label>
                  <select
                    id="categoria"
                    value={categoria}
                    disabled={!modoEdicao}
                    onChange={(e) => setCategoria(e.target.value)}
                    className={classeInput}
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="instagram" className="block text-xs font-medium text-text-secondary mb-1.5">
                  Instagram ou portfólio
                </label>
                <input
                  id="instagram"
                  type="text"
                  value={instagram}
                  disabled={!modoEdicao}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@seuperfil ou link do portfólio"
                  className={classeInput}
                />
              </div>

              <div>
                <label htmlFor="sobre" className="block text-xs font-medium text-text-secondary mb-1.5">
                  Sobre você
                </label>
                <textarea
                  id="sobre"
                  rows={4}
                  maxLength={400}
                  value={sobre}
                  disabled={!modoEdicao}
                  onChange={(e) => setSobre(e.target.value)}
                  placeholder="Conte sua experiência, estilo de trabalho e o que está incluso nos seus serviços."
                  className={`${classeInput} resize-none`}
                />
                {modoEdicao && (
                  <p className="text-[11px] text-text-secondary mt-1 text-right">{sobre.length}/400</p>
                )}
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

      {/* MODAL DE PROPOSTA */}
      {modalAberto && orcamentoSelecionado && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setModalAberto(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-proposta"
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-secondary border border-border-custom rounded-xl max-w-lg w-full relative shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-border-custom">
              <div>
                <h3 id="titulo-proposta" className="text-lg font-semibold text-text-main">
                  Responder orçamento
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  {orcamentoSelecionado.clienteNome} · {orcamentoSelecionado.tipoEvento} em{' '}
                  {orcamentoSelecionado.dataEvento}
                </p>
              </div>
              <button
                onClick={() => setModalAberto(false)}
                aria-label="Fechar"
                className="text-text-secondary hover:text-text-main p-1 rounded-md hover:bg-bg-main transition-colors"
              >
                <Icone d={ICONES.fechar} className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnviarProposta} className="p-6 space-y-5">
              <div>
                <label
                  htmlFor="valor-proposta"
                  className="block text-xs font-medium text-text-secondary mb-1.5"
                >
                  Valor da proposta
                </label>
                <input
                  id="valor-proposta"
                  type="text"
                  inputMode="numeric"
                  required
                  autoFocus
                  placeholder="R$ 1.500,00"
                  value={valorProposto}
                  onChange={(e) => setValorProposto(formatarMoeda(e.target.value))}
                  className={classeInput}
                />
              </div>

              <div>
                <label
                  htmlFor="mensagem-proposta"
                  className="block text-xs font-medium text-text-secondary mb-1.5"
                >
                  Mensagem e condições de pagamento
                </label>
                <textarea
                  id="mensagem-proposta"
                  rows={4}
                  maxLength={500}
                  placeholder="Ex: Inclui 6 horas de cobertura e álbum impresso. Entrada de 30% e saldo no dia."
                  value={respostaFotografo}
                  onChange={(e) => setRespostaFotografo(e.target.value)}
                  className={`${classeInput} resize-none`}
                />
                <p className="text-[11px] text-text-secondary mt-1 text-right">
                  {respostaFotografo.length}/500
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="text-xs bg-bg-main border border-border-custom text-text-secondary px-4 py-2.5 rounded-lg hover:text-text-main transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="text-xs bg-wine-primary hover:bg-wine-dark text-bg-main font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Enviar proposta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE RECUSA */}
      {recusandoId !== null && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setRecusandoId(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-recusa"
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-secondary border border-border-custom rounded-xl max-w-sm w-full p-6 shadow-2xl"
          >
            <h3 id="titulo-recusa" className="text-base font-semibold text-text-main">
              Recusar este pedido?
            </h3>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              O cliente será informado de que o orçamento foi recusado. Essa ação não pode ser
              desfeita.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setRecusandoId(null)}
                className="text-xs bg-bg-main border border-border-custom text-text-secondary px-4 py-2.5 rounded-lg hover:text-text-main transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmarRecusa}
                className="text-xs bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                Recusar pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}