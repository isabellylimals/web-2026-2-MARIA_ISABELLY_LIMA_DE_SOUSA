import { useState, type FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const FOTOGRAFOS_DETALHES = [
  {
    id: 1,
    nome: 'Lucas Andrade',
    cidade: 'Pau dos Ferros - RN',
    categoria: 'Casamentos',
    preco: 'A partir de R$ 1.200',
    bio: 'Atuo há mais de 8 anos registrando histórias de amor no Alto Oeste Potiguar. Meu foco é capturar emoções reais e espontâneas sem poses forçadas.',
    trabalhos: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 2,
    nome: 'Mariana Costa',
    cidade: 'Mossoró - RN',
    categoria: 'Aniversários',
    preco: 'A partir de R$ 600',
    bio: 'Especializada em festas infantis e registros de família. Eternizo os melhores momentos dos seus filhos.',
    trabalhos: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop'
    ]
  }
];

export default function Portfolio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fotografo = FOTOGRAFOS_DETALHES.find((f) => f.id === Number(id)) || FOTOGRAFOS_DETALHES[0];

  const [modalAberto, setModalAberto] = useState(false);
  const [dataEvento, setDataEvento] = useState('');
  const [horario, setHorario] = useState('');
  const [local, setLocal] = useState('');
  const [tipoEvento, setTipoEvento] = useState(fotografo.categoria);
  const [observacoes, setObservacoes] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  const sessaoStr = localStorage.getItem('usuarioLogado');
  const usuarioLogado = sessaoStr ? JSON.parse(sessaoStr) : null;

  const handleAbrirModal = () => {
    if (!usuarioLogado) {
      alert('Você precisa estar logado para solicitar um orçamento.');
      navigate('/login');
      return;
    }
    setModalAberto(true);
  };

  const handleEnviarOrcamento = (e: FormEvent) => {
    e.preventDefault();

    const novoOrcamento = {
      id: Date.now(),
      fotografoId: fotografo.id,
      fotografoNome: fotografo.nome,
      clienteNome: usuarioLogado.nome,
      clienteEmail: usuarioLogado.email,
      tipoEvento,
      dataEvento,
      horario,
      local,
      observacoes,
      status: 'Pendente',
      dataSolicitacao: new Date().toLocaleDateString('pt-BR'),
      valorProposto: null
    };

    const orcamentosAtuais = JSON.parse(localStorage.getItem('orcamentos_db') || '[]');
    orcamentosAtuais.push(novoOrcamento);
    localStorage.setItem('orcamentos_db', JSON.stringify(orcamentosAtuais));

    setMensagemSucesso(true);
    setTimeout(() => {
      setMensagemSucesso(false);
      setModalAberto(false);
      // Limpa campos
      setDataEvento('');
      setHorario('');
      setLocal('');
      setObservacoes('');
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link to="/" className="text-xs text-wine-primary hover:underline mb-6 inline-block">
        ← Voltar ao Catálogo
      </Link>

      <div className="bg-bg-secondary border border-border-custom rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-custom pb-6 mb-6">
          <div>
            <span className="text-xs text-wine-primary bg-bg-main border border-border-custom px-3 py-1 rounded-md uppercase font-medium">
              {fotografo.categoria}
            </span>
            <h1 className="text-3xl font-semibold text-text-main mt-2">{fotografo.nome}</h1>
            <p className="text-sm text-text-secondary">{fotografo.cidade}</p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-sm text-text-secondary block">Investimento estimado</span>
            <span className="text-xl font-semibold text-wine-primary">{fotografo.preco}</span>
          </div>
        </div>

        <p className="text-sm text-text-main leading-relaxed mb-6">{fotografo.bio}</p>

        <button
          onClick={handleAbrirModal}
          className="bg-wine-primary hover:bg-wine-dark text-bg-main text-xs font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Solicitar Orçamento
        </button>
      </div>

      <h2 className="text-xl font-semibold text-text-main mb-4">Galeria de Trabalhos</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {fotografo.trabalhos.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Trabalho ${index + 1}`}
            className="w-full h-60 object-cover rounded-xl border border-border-custom hover:opacity-95 transition-opacity"
          />
        ))}
      </div>

      {/* MODAL DE SOLICITAÇÃO DE ORÇAMENTO */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-secondary border border-border-custom rounded-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setModalAberto(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-main text-sm"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold text-text-main mb-1">
              Solicitar Orçamento para {fotografo.nome}
            </h3>
            <p className="text-xs text-text-secondary mb-6">
              Preencha os detalhes do seu evento para receber a proposta.
            </p>

            {mensagemSucesso ? (
              <div className="bg-wine-primary/10 border border-wine-primary text-wine-primary p-4 rounded-xl text-center text-sm font-medium my-6">
                ✓ Pedido de orçamento enviado com sucesso!
              </div>
            ) : (
              <form onSubmit={handleEnviarOrcamento} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Tipo de Evento
                  </label>
                  <select
                    value={tipoEvento}
                    onChange={(e) => setTipoEvento(e.target.value)}
                    className="w-full bg-bg-main border border-border-custom rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary"
                  >
                    <option value="Casamentos">Casamento</option>
                    <option value="Aniversários">Aniversário</option>
                    <option value="Corporativo">Corporativo</option>
                    <option value="Formaturas">Formatura</option>
                    <option value="Ensaio">Ensaio Fotográfico</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Data do Evento
                    </label>
                    <input
                      type="date"
                      required
                      value={dataEvento}
                      onChange={(e) => setDataEvento(e.target.value)}
                      className="w-full bg-bg-main border border-border-custom rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Horário
                    </label>
                    <input
                      type="time"
                      required
                      value={horario}
                      onChange={(e) => setHorario(e.target.value)}
                      className="w-full bg-bg-main border border-border-custom rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Local / Cidade
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cerimonial Recanto, Pau dos Ferros - RN"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    className="w-full bg-bg-main border border-border-custom rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Observações ou detalhes adicionais
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Conte um pouco sobre o evento ou quantidade estimada de convidados..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="w-full bg-bg-main border border-border-custom rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
                  <button
                    type="button"
                    onClick={() => setModalAberto(false)}
                    className="text-xs bg-bg-main border border-border-custom text-text-secondary px-4 py-2.5 rounded-lg hover:text-text-main"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="text-xs bg-wine-primary hover:bg-wine-dark text-bg-main font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Enviar Solicitação
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}