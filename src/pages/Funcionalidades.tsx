export default function Funcionalidades() {
  const usuariosCadastrados = [
    { email: 'admin@lumina.com', nome: 'Gerenciador Geral', papel: 'admin', status: 'Ativo' },
    { email: 'fotografo@lumina.com', nome: 'Lucas Andrade', papel: 'fotografo', status: 'Aprovado' },
    { email: 'cliente@lumina.com', nome: 'Cliente Teste', papel: 'cliente', status: 'Ativo' },
    { email: 'novo.fotografo@email.com', nome: 'Beatriz Lima', papel: 'fotografo', status: 'Pendente de Aprovação' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      <div className="border-b border-border-custom pb-6">
        <span className="text-xs uppercase tracking-widest text-wine-primary bg-bg-secondary px-3 py-1 rounded-full border border-border-custom font-medium">
          Acesso Restrito - Gerenciador Geral
        </span>
        <h1 className="text-3xl font-normal text-text-main mt-3">Painel Administrativo da Plataforma</h1>
        <p className="text-xs text-text-secondary mt-1">
          Controle de usuários cadastrados no DynamoDB, moderação de perfis e métricas de sistema.
        </p>
      </div>

      {/* Cartões de Métricas Globais */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-bg-secondary border border-border-custom p-6 rounded-2xl">
          <p className="text-xs text-text-secondary font-medium">Total de Usuários</p>
          <p className="text-3xl font-semibold text-wine-primary mt-2">3</p>
          <p className="text-[11px] text-text-secondary mt-1">Sincronizado com o DynamoDB</p>
        </div>
        <div className="bg-bg-secondary border border-border-custom p-6 rounded-2xl">
          <p className="text-xs text-text-secondary font-medium">Fotógrafos Ativos</p>
          <p className="text-3xl font-semibold text-wine-primary mt-2">1</p>
          <p className="text-[11px] text-text-secondary mt-1">Perfis com portfólio visível</p>
        </div>
        <div className="bg-bg-secondary border border-border-custom p-6 rounded-2xl">
          <p className="text-xs text-text-secondary font-medium">Solicitações Pendentes</p>
          <p className="text-3xl font-semibold text-wine-primary mt-2">1</p>
          <p className="text-[11px] text-text-secondary mt-1">Aguardando validação de cadastro</p>
        </div>
      </div>

      {/* Tabela de Gestão de Usuários */}
      <section className="bg-bg-secondary border border-border-custom rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-normal text-text-main">Gestão de Perfis no Banco de Dados</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-custom text-text-secondary uppercase">
              <tr>
                <th className="pb-3 font-semibold">Nome</th>
                <th className="pb-3 font-semibold">E-mail (PK)</th>
                <th className="pb-3 font-semibold">Papel</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom">
              {usuariosCadastrados.map((u, i) => (
                <tr key={i} className="hover:bg-bg-main/50 transition-colors">
                  <td className="py-3 font-medium text-text-main">{u.nome}</td>
                  <td className="py-3 text-text-secondary">{u.email}</td>
                  <td className="py-3">
                    <span className="uppercase text-[10px] bg-bg-main border border-border-custom px-2 py-0.5 rounded text-wine-primary font-semibold">
                      {u.papel}
                    </span>
                  </td>
                  <td className="py-3 text-text-secondary">{u.status}</td>
                  <td className="py-3 text-right space-x-2">
                    {u.status === 'Pendente de Aprovação' ? (
                      <button className="bg-wine-primary text-bg-main px-2.5 py-1 rounded text-[11px] hover:bg-wine-dark transition-colors">
                        Aprovar
                      </button>
                    ) : (
                      <button className="border border-border-custom text-text-secondary px-2.5 py-1 rounded text-[11px] hover:text-wine-primary transition-colors">
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}