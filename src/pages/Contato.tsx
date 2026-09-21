import { useState, FormEvent } from 'react';

interface FormData {
  nome: string;
  email: string;
  mensagem: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  mensagem?: string;
}

export default function Contato() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    mensagem: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório.';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'O nome deve ter pelo menos 3 caracteres.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Insira um e-mail válido.';
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'A mensagem é obrigatória.';
    } else if (formData.mensagem.trim().length < 10) {
      newErrors.mensagem = 'A mensagem deve conter pelo menos 10 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      setFormData({ nome: '', email: '', mensagem: '' });
      setErrors({});
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-normal text-text-main mb-6 text-center">
        Entre em Contato
      </h1>

      {isSubmitted ? (
        <div className="bg-bg-secondary border border-wine-primary text-text-main p-6 rounded-xl text-center space-y-3">
          <h2 className="text-xl font-normal text-wine-primary">Mensagem Enviada!</h2>
          <p className="text-sm text-text-secondary">
            Obrigado pelo contato. Sua solicitação foi recebida com sucesso e responderemos em breve.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="mt-4 bg-wine-primary text-bg-main text-xs font-medium px-4 py-2 rounded-lg hover:bg-wine-dark transition-colors"
          >
            Enviar outra mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-bg-secondary border border-border-custom rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Nome
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className={`w-full bg-bg-main border ${
                errors.nome ? 'border-wine-primary' : 'border-border-custom'
              } rounded-lg px-4 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary`}
              placeholder="Seu nome completo"
            />
            {errors.nome && (
              <p className="text-xs text-wine-primary mt-1 font-medium">{errors.nome}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              E-mail
            </label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full bg-bg-main border ${
                errors.email ? 'border-wine-primary' : 'border-border-custom'
              } rounded-lg px-4 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary`}
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-xs text-wine-primary mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Mensagem
            </label>
            <textarea
              rows={4}
              value={formData.mensagem}
              onChange={(e) => handleChange('mensagem', e.target.value)}
              className={`w-full bg-bg-main border ${
                errors.mensagem ? 'border-wine-primary' : 'border-border-custom'
              } rounded-lg px-4 py-2 text-sm text-text-main focus:outline-none focus:border-wine-primary`}
              placeholder="Como podemos ajudar?"
            ></textarea>
            {errors.mensagem && (
              <p className="text-xs text-wine-primary mt-1 font-medium">{errors.mensagem}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-wine-primary hover:bg-wine-dark text-bg-main font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            Enviar Mensagem
          </button>
        </form>
      )}
    </div>
  );
}