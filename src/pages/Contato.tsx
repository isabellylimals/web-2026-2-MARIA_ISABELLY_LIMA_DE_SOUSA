export default function Contato() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-normal text-text-main mb-6 text-center">Entre em Contato</h1>
      <form className="bg-bg-secondary border border-border-custom rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Nome</label>
          <input
            type="text"
            className="w-full bg-bg-main border border-border-custom rounded-lg px-4 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary"
            placeholder="Seu nome completo"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">E-mail</label>
          <input
            type="email"
            className="w-full bg-bg-main border border-border-custom rounded-lg px-4 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Mensagem</label>
          <textarea
            rows={4}
            className="w-full bg-bg-main border border-border-custom rounded-lg px-4 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary"
            placeholder="Como podemos ajudar?"
          ></textarea>
        </div>
        <button
          type="button"
          className="w-full bg-wine-primary hover:bg-wine-dark text-bg-main font-medium py-2.5 rounded-lg transition-colors text-sm"
        >
          Enviar Mensagem
        </button>
      </form>
    </div>
  );
}