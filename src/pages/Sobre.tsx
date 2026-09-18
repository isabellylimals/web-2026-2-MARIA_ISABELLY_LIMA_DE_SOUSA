export default function Sobre() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
      {/* Cabecalho Editorial */}
      <section className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-wine-primary font-medium">
          Proposta do Projeto
        </span>
        <h1 className="text-4xl md:text-5xl font-normal text-text-main mt-3 mb-6">
          Conectando historias visuais a quem precisa registra-las
        </h1>
        <p className="text-text-secondary text-base md:text-lg leading-relaxed">
          Encontrar o fotografo ideal para um evento especial nao deveria ser um processo desorganizado espalhado por redes sociais e trocas informais de mensagens.
        </p>
      </section>

      {/* Bloco de Destaque da Solucao */}
      <section className="bg-bg-secondary border-l-4 border-wine-primary p-8 md:p-10 rounded-r-2xl border-y border-r border-border-custom">
        <h2 className="text-2xl font-normal text-text-main mb-3">A Solucao LuminaEvents</h2>
        <p className="text-text-secondary leading-relaxed text-sm md:text-base">
          Desenvolvemos uma plataforma centralizada para divulgacao e contratacao de servicos fotograficos. Fotografos autonomos ganham uma vitrine profissional sem a necessidade de manter um site proprio, enquanto clientes encontram transparencia de precos, disponibilidades e portfolios em um so lugar.
        </p>
      </section>

      {/* Divisao de Perfis de Usuario */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="border border-border-custom p-8 rounded-xl bg-bg-main">
          <span className="text-xs uppercase tracking-wider text-wine-primary font-semibold block mb-2">
            Para Clientes
          </span>
          <h3 className="text-2xl font-normal text-text-main mb-3">Busca Transparente e Pratica</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Pesquise profissionais por tipo de evento, compare galerias de trabalhos ja realizados, consulte datas disponiveis e envie solicitacoes de orcamento de forma padronizada.
          </p>
        </div>

        <div className="border border-border-custom p-8 rounded-xl bg-bg-main">
          <span className="text-xs uppercase tracking-wider text-wine-primary font-semibold block mb-2">
            Para Fotografos
          </span>
          <h3 className="text-2xl font-normal text-text-main mb-3">Vitrine Profissional Simplificada</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Cadastre os tipos de eventos que atende, defina faixas de preço, exiba fotos de eventos anteriores e gerencie chamados de clientes diretamente no seu painel.
          </p>
        </div>
      </section>
    </div>
  );
}