import { useState, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Servico {
  nome: string;
  preco: string;
  duracao: string;
}

interface Foto {
  url: string;
  titulo: string;
  evento: string;
}

interface DetalhesFotografo {
  nome: string;
  cidade: string;
  categoria: string;
  fotoPerfil: string;
  bio: string;
  telefone: string;
  servicos: Servico[];
  galeria: Foto[];
}

const DADOS_FOTOGRAFOS: Record<string, DetalhesFotografo> = {
  '1': {
    nome: 'Lucas Andrade',
    cidade: 'Pau dos Ferros - RN',
    categoria: 'Casamentos',
    fotoPerfil: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&auto=format&fit=crop',
    bio: 'Fotógrafo profissional com mais de 7 anos de experiência registrando casamentos e ensaios de casal com estilo documental e espontâneo.',
    telefone: '(84) 99999-8888',
    servicos: [
      { nome: 'Cobertura Completa de Casamento', preco: 'R$ 2.500', duracao: '8 horas de evento' },
      { nome: 'Ensaio Pré-Wedding', preco: 'R$ 800', duracao: '3 horas de sessão' },
      { nome: 'Mini Ensaio de Casal', preco: 'R$ 450', duracao: '1.5 horas' }
    ],
    galeria: [
      { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop', titulo: 'Cerimônia ao Ar Livre', evento: 'Casamento' },
      { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop', titulo: 'Recepção e Festa', evento: 'Casamento' },
      { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&auto=format&fit=crop', titulo: 'Ensaio no Pôr do Sol', evento: 'Pré-Wedding' },
      { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&auto=format&fit=crop', titulo: 'Primeira Dança dos Noivos', evento: 'Casamento' }
    ]
  },
  '2': {
    nome: 'Mariana Costa',
    cidade: 'Mossoró - RN',
    categoria: 'Aniversários',
    fotoPerfil: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&auto=format&fit=crop',
    bio: 'Especialista em fotografia afetiva para festas infantis, aniversários de 15 anos e reuniões de família.',
    telefone: '(84) 98888-7777',
    servicos: [
      { nome: 'Festa Infantil Completa', preco: 'R$ 600', duracao: '4 horas' },
      { nome: 'Ensaio de Aniversário (Smash the Cake)', preco: 'R$ 350', duracao: '2 horas' }
    ],
    galeria: [
      { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop', titulo: 'Decoração e Bolo', evento: 'Aniversário' },
      { url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop', titulo: 'Comemoração em Família', evento: 'Aniversário' }
    ]
  }
};

export default function Portfolio() {
  const { id } = useParams();
  const fotografo = DADOS_FOTOGRAFOS[id || '1'] || DADOS_FOTOGRAFOS['1'];

  const [dataEvento, setDataEvento] = useState('');
  const [tipoEvento, setTipoEvento] = useState(fotografo.categoria);
  const [mensagem, setMensagem] = useState('');
  const [orcamentoEnviado, setOrcamentoEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const handleSolicitarOrcamento = (e: FormEvent) => {
    e.preventDefault();
    if (!dataEvento || !mensagem.trim()) {
      setErro('Por favor, informe a data do evento e os detalhes do orçamento.');
      return;
    }
    setErro('');
    setOrcamentoEnviado(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Botão de Retorno */}
      <Link to="/" className="inline-block text-xs text-wine-primary hover:underline font-medium">
        ← Voltar para a busca
      </Link>

      {/* Cabeçalho do Fotógrafo */}
      <div className="bg-bg-secondary border border-border-custom rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <img
          src={fotografo.fotoPerfil}
          alt={fotografo.nome}
          className="w-32 h-32 rounded-full object-cover border-2 border-wine-primary shadow-md"
        />
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h1 className="text-3xl font-normal text-text-main">{fotografo.nome}</h1>
            <span className="text-xs bg-bg-main text-wine-primary border border-border-custom px-3 py-1 rounded-full font-medium inline-block self-center md:self-auto">
              Especialista em {fotografo.categoria}
            </span>
          </div>
          <p className="text-xs text-text-secondary font-medium">{fotografo.cidade} • Contato: {fotografo.telefone}</p>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">{fotografo.bio}</p>
        </div>
      </div>

      {/* Serviços e Valores */}
      <section className="space-y-6">
        <h2 className="text-2xl font-normal text-text-main">Serviços Oferecidos</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {fotografo.servicos.map((servico, index) => (
            <div key={index} className="bg-bg-secondary border border-border-custom p-6 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-main mb-2">{servico.nome}</h3>
                <p className="text-xs text-text-secondary mb-4">Duração estimada: {servico.duracao}</p>
              </div>
              <p className="text-base font-semibold text-wine-primary border-t border-border-custom pt-3">
                {servico.preco}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Galeria de Fotos de Trabalhos Realizados */}
      <section className="space-y-6">
        <h2 className="text-2xl font-normal text-text-main">Galeria de Trabalhos</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {fotografo.galeria.map((foto, index) => (
            <div key={index} className="group relative bg-bg-secondary border border-border-custom rounded-xl overflow-hidden">
              <img
                src={foto.url}
                alt={foto.titulo}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-wine-dark/80 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-bg-main">
                <span className="text-xs font-semibold uppercase">{foto.evento}</span>
                <p className="text-sm font-medium">{foto.titulo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formulário de Solicitação de Orçamento */}
      <section className="bg-bg-secondary border border-border-custom rounded-2xl p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-normal text-text-main mb-2 text-center">Solicitar Orçamento</h2>
        <p className="text-xs text-text-secondary text-center mb-6">
          Envie os detalhes do seu evento para receber uma proposta diretamente de {fotografo.nome}.
        </p>

        {orcamentoEnviado ? (
          <div className="bg-bg-main border border-wine-primary p-6 rounded-xl text-center space-y-3">
            <h3 className="text-lg font-medium text-wine-primary">Solicitação Enviada!</h3>
            <p className="text-xs text-text-secondary">
              O fotógrafo {fotografo.nome} analisará a disponibilidade para a data informada e entrará em contato.
            </p>
            <button
              onClick={() => setOrcamentoEnviado(false)}
              className="text-xs text-wine-primary underline"
            >
              Enviar nova solicitação
            </button>
          </div>
        ) : (
          <form onSubmit={handleSolicitarOrcamento} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Tipo de Evento</label>
                <input
                  type="text"
                  value={tipoEvento}
                  onChange={(e) => setTipoEvento(e.target.value)}
                  className="w-full bg-bg-main border border-border-custom rounded-lg px-4 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Data Prevista</label>
                <input
                  type="date"
                  value={dataEvento}
                  onChange={(e) => setDataEvento(e.target.value)}
                  className="w-full bg-bg-main border border-border-custom rounded-lg px-4 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Detalhes do Evento / Mensagem</label>
              <textarea
                rows={3}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Informe o local do evento, número estimado de convidados e horários..."
                className="w-full bg-bg-main border border-border-custom rounded-lg px-4 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary"
              ></textarea>
            </div>

            {erro && <p className="text-xs text-wine-primary font-medium">{erro}</p>}

            <button
              type="submit"
              className="w-full bg-wine-primary hover:bg-wine-dark text-bg-main font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Enviar Solicitação de Orçamento
            </button>
          </form>
        )}
      </section>
    </div>
  );
}