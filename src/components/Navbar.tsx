import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-bg-secondary border-b border-border-custom sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-purple-primary flex items-center justify-center font-bold text-text-main text-sm">
            L
          </span>
          LuminaEvents
        </Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className="text-text-secondary hover:text-lavender-soft transition-colors">
            Home
          </Link>
          <Link to="/sobre" className="text-text-secondary hover:text-lavender-soft transition-colors">
            Sobre
          </Link>
          <Link to="/funcionalidades" className="text-text-secondary hover:text-lavender-soft transition-colors">
            Funcionalidades
          </Link>
          <Link to="/contato" className="text-text-secondary hover:text-lavender-soft transition-colors">
            Contato
          </Link>
        </div>
      </div>
    </nav>
  );
}