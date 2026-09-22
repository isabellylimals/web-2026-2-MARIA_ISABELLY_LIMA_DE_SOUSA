import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `transition-colors ${
      isActive
        ? 'text-wine-primary font-semibold border-b-2 border-wine-primary pb-1'
        : 'text-text-secondary hover:text-wine-primary'
    }`;

  return (
    <nav className="bg-bg-secondary border-b border-border-custom sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-text-main font-serif flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-wine-primary flex items-center justify-center font-bold text-bg-main text-sm font-sans">
            L
          </span>
          MomentAnia
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex gap-6 text-sm font-medium items-center">
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/sobre" className={navLinkStyle}>
            Sobre
          </NavLink>
          <NavLink to="/funcionalidades" className={navLinkStyle}>
            Funcionalidades
          </NavLink>
          <NavLink to="/contato" className={navLinkStyle}>
            Contato
          </NavLink>
        </div>

        {/* Botão do Menu Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-text-main p-2 focus:outline-none"
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Dropdown Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-bg-secondary border-b border-border-custom px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/sobre" onClick={() => setIsMenuOpen(false)} className={navLinkStyle}>
            Sobre
          </NavLink>
          <NavLink to="/funcionalidades" onClick={() => setIsMenuOpen(false)} className={navLinkStyle}>
            Funcionalidades
          </NavLink>
          <NavLink to="/contato" onClick={() => setIsMenuOpen(false)} className={navLinkStyle}>
            Contato
          </NavLink>
        </div>
      )}
    </nav>
  );
}