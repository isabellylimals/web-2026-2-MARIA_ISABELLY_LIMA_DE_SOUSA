import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface Fotografo {
  id: number;
  nome: string;
  cidade: string;
  categoria: string;
  preco: string;
  descricao: string;
  imagem: string;
}

const FOTOGRAFOS_MOCK: Fotografo[] = [
  {
    id: 1,
    nome: 'Lucas Andrade',
    cidade: 'Pau dos Ferros - RN',
    categoria: 'Casamentos',
    preco: 'A partir de R$ 1.200',
    descricao: 'Especialista em cobertura documental e retratos espontâneos de casamentos.',
    imagem: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&auto=format&fit=crop'
  },
  {
    id: 2,
    nome: 'Mariana Costa',
    cidade: 'Mossoró - RN',
    categoria: 'Aniversários',
    preco: 'A partir de R$ 600',
    descricao: 'Fotografia afetiva para festas infantis e comemorações de aniversário.',
    imagem: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&auto=format&fit=crop'
  },
  {
    id: 3,
    nome: 'Estúdio Lumina Visual',
    cidade: 'Natal - RN',
    categoria: 'Corporativo',
    preco: 'A partir de R$ 1.500',
    descricao: 'Cobertura de congressos, feiras de negócios e retratos corporativos.',
    imagem: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format&fit=crop'
  },
  {
    id: 4,
    nome: 'Beatriz Lima',
    cidade: 'Pau dos Ferros - RN',
    categoria: 'Formaturas',
    preco: 'A partir de R$ 800',
    descricao: 'Ensaios individuais e cobertura de bailes e colações de grau.',
    imagem: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop'
  }
];

export default function Home() {
  const [termo, setTermo] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');

  const categorias = ['Todas', 'Casamentos', 'Aniversários', 'Corporativo', 'Formaturas'];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setBuscaAplicada(termo);
  };

  const fotografosFiltrados = FOTOGRAFOS_MOCK.filter((f) => {
    const atendeTermo =
      f.nome.toLowerCase().includes(buscaAplicada.toLowerCase()) ||
      f.cidade.toLowerCase().includes(buscaAplicada.toLowerCase()) ||
      f.categoria.toLowerCase().includes(buscaAplicada.toLowerCase());

    const atendeCategoria =
      categoriaAtiva === 'Todas' || f.categoria.toLowerCase() === categoriaAtiva.toLowerCase();

    return atendeTermo && atendeCategoria;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center">
      <span className="text-xs uppercase tracking-widest text-wine-primary bg-bg-secondary px-4 py-1.5 rounded-full border border-border-custom mb-6 font-medium">
        Plataforma para Contratação de Fotógrafos
      </span>

      <h1 className="text-4xl md:text-5xl font-normal text-text-main max-w-3xl leading-tight text-center mb-6">
        Encontre o fotógrafo ideal para o seu momento
      </h1>

      <p className="text-text-secondary max-w-2xl text-center mb-8 text-base md:text-lg">
        Compare portfólios, faixas de preço e disponibilidades para casamentos, aniversários e eventos corporativos na sua região.
      </p>

      {/* Formulario de Pesquisa */}
      <form onSubmit={handleSearch} className="w-full max-w-xl bg-bg-secondary p-3 rounded-xl border border-border-custom flex gap-3 shadow-sm mb-8">
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Busque por cidade, nome ou evento (ex: Casamento)..."
          className="flex-1 bg-bg-main border border-border-custom rounded-lg px-4 py-2.5 text-sm text-text-main placeholder-text-secondary/70 focus:outline-none focus:border-wine-primary"
        />
        <button
          type="submit"
          className="bg-wine-primary hover:bg-wine-dark text-bg-main font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Buscar
        </button>
      </form>

      {/* Filtros Rapidos por Categoria */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={`text-xs px-4 py-2 rounded-lg border transition-colors ${
              categoriaAtiva === cat
                ? 'bg-wine-primary text-bg-main border-wine-primary'
                : 'bg-bg-secondary text-text-secondary border-border-custom hover:border-wine-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exibicao dos Resultados */}
      <div className="w-full">
        <h2 className="text-2xl font-normal text-text-main mb-6">
          Fotógrafos Disponíveis ({fotografosFiltrados.length})
        </h2>

        {fotografosFiltrados.length === 0 ? (
          <div className="bg-bg-secondary border border-border-custom rounded-xl p-8 text-center text-text-secondary">
            Nenhum fotógrafo encontrado para os critérios pesquisados.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {fotografosFiltrados.map((item) => (
              <div
                key={item.id}
                className="bg-bg-secondary border border-border-custom rounded-xl overflow-hidden hover:border-wine-primary transition-all flex flex-col md:flex-row"
              >
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="w-full md:w-44 h-48 object-cover"
                />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-text-main">{item.nome}</h3>
                      <span className="text-xs bg-bg-main border border-border-custom px-2 py-1 rounded text-wine-primary">
                        {item.categoria}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mb-2">{item.cidade}</p>
                    <p className="text-xs text-text-secondary line-clamp-2 mb-3">{item.descricao}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-border-custom pt-3 mt-2">
                    <span className="text-xs font-semibold text-wine-primary">{item.preco}</span>
                    <Link
                      to={`/portfolio/${item.id}`}
                      className="text-xs bg-wine-primary hover:bg-wine-dark text-bg-main px-3 py-1.5 rounded transition-colors inline-block"
                    >
                      Ver Portfólio
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}