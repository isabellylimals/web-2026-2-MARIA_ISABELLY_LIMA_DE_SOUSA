import { useSearchParams } from 'react-router-dom';

export default function Funcionalidades() {
  const [searchParams] = useSearchParams();
  const busca = searchParams.get('busca');

  const itens = [
    { titulo: 'Perfis Profissionais', desc: 'Exibição de especialidades, regiões de atendimento e faixas de preço.' },
    { titulo: 'Galeria de Trabalhos', desc: 'Registro visual de fotografias de eventos realizados anteriormente.' },
    { titulo: 'Solicitação de Orçamentos', desc: 'Envio direto de propostas com datas, locais e detalhes do evento.' },
    { titulo: 'Painel do Administrador', desc: 'Moderação de cadastros, categorias de eventos e métricas da plataforma.' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-normal text-text-main mb-4 text-center">
        Funcionalidades Principais
      </h1>

      {busca && (
        <p className="text-center text-sm text-wine-primary font-medium mb-8">
          Resultados filtrados para a pesquisa: "{busca}"
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {itens.map((item) => (
          <div key={item.titulo} className="bg-bg-secondary border border-border-custom rounded-xl p-6 hover:border-wine-primary transition-colors">
            <h2 className="text-xl font-normal text-wine-primary mb-2">{item.titulo}</h2>
            <p className="text-text-secondary text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}