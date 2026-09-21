import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [termoBusca, setTermoBusca] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (termoBusca.trim()) {
      // Navegação programática via código para outra página
      navigate(`/funcionalidades?busca=${encodeURIComponent(termoBusca.trim())}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-center flex flex-col items-center">
      <span className="text-xs uppercase tracking-widest text-wine-primary bg-bg-secondary px-4 py-1.5 rounded-full border border-border-custom mb-6 font-medium">
        Fotografia de Eventos
      </span>
      <h1 className="text-4xl md:text-6xl font-normal text-text-main max-w-3xl leading-tight mb-6">
        Encontre o fotógrafo ideal para o seu momento
      </h1>
      <p className="text-text-secondary max-w-2xl mb-10 text-base md:text-lg">
        Centralize buscas, comparativos de portfólio, faixas de preço e solicitações de orçamento para casamentos, aniversários e eventos corporativos.
      </p>

      {/* Formulário de Busca com Navegação Programática */}
      <form onSubmit={handleSearch} className="w-full max-w-xl bg-bg-secondary p-3 rounded-xl border border-border-custom flex gap-3">
        <input
          type="text"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          placeholder="Busque por tipo de evento ou cidade..."
          className="flex-1 bg-bg-main border border-border-custom rounded-lg px-4 py-2.5 text-sm text-text-main placeholder-text-secondary/70 focus:outline-none focus:border-wine-primary"
        />
        <button
          type="submit"
          className="bg-wine-primary hover:bg-wine-dark text-bg-main font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}