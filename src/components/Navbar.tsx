import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  const sessaoStr = localStorage.getItem('usuarioLogado');
  const usuario = sessaoStr ? JSON.parse(sessaoStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-wine-primary' : 'text-text-secondary hover:text-text-main'
    }`;

  const getHomeLink = () => {
    if (!usuario) return '/';
    if (usuario.papel === 'fotografo') return '/painel-fotografo';
    if (usuario.papel === 'admin') return '/funcionalidades';
    return '/';
  };

  return (
    <header className="border-b border-border-custom bg-bg-main sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={getHomeLink()} className="text-xl font-semibold text-wine-primary tracking-wide">
          FotoEventos
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {/* Menu para Visitantes Nao Logados */}
          {!usuario && (
            <>
              <NavLink to="/" className={linkClass}>Início</NavLink>
              <NavLink to="/sobre" className={linkClass}>Sobre</NavLink>
              <NavLink to="/contato" className={linkClass}>Contacto</NavLink>
            </>
          )}

          {/* Menu para Cliente Logado */}
          {usuario?.papel === 'cliente' && (
            <>
              <NavLink to="/" className={linkClass}>Explorar Fotógrafos</NavLink>
              <NavLink to="/painel-cliente" className={linkClass}>Meu Perfil</NavLink>
            </>
          )}

          {/* Menu para Fotografo */}
          {usuario?.papel === 'fotografo' && (
            <>
              <NavLink to="/painel-fotografo" className={linkClass}>Meu Painel</NavLink>
              <NavLink to="/" className={linkClass}>Ver Catálogo</NavLink>
            </>
          )}

          {/* Menu Limpo para Administrador */}
          {usuario?.papel === 'admin' && (
            <>
              <NavLink to="/funcionalidades" className={linkClass}>Painel Geral</NavLink>
              <NavLink to="/" className={linkClass}>Ver Catálogo</NavLink>
            </>
          )}

          {/* Bloco de Login / Perfil */}
          {usuario ? (
            <div className="flex items-center gap-3 border-l border-border-custom pl-4">
              <div className="text-right">
                <p className="text-xs font-semibold text-text-main">{usuario.nome}</p>
                <span className="text-[10px] uppercase tracking-wider text-wine-primary font-medium">
                  {usuario.papel}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs bg-bg-secondary hover:bg-border-custom text-text-main border border-border-custom px-3 py-1.5 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-wine-primary hover:bg-wine-dark text-bg-main text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>

        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="md:hidden text-text-main p-2 focus:outline-none text-xs"
        >
          {menuAberto ? 'Fechar' : 'Menu'}
        </button>
      </nav>

      {/* Menu Mobile */}
      {menuAberto && (
        <div className="md:hidden border-t border-border-custom bg-bg-secondary px-6 py-4 flex flex-col gap-3">
          {!usuario && (
            <>
              <NavLink to="/" onClick={() => setMenuAberto(false)} className={linkClass}>Início</NavLink>
              <NavLink to="/sobre" onClick={() => setMenuAberto(false)} className={linkClass}>Sobre</NavLink>
              <NavLink to="/contato" onClick={() => setMenuAberto(false)} className={linkClass}>Contacto</NavLink>
            </>
          )}

          {usuario?.papel === 'cliente' && (
            <>
              <NavLink to="/" onClick={() => setMenuAberto(false)} className={linkClass}>Explorar Fotógrafos</NavLink>
              <NavLink to="/painel-cliente" onClick={() => setMenuAberto(false)} className={linkClass}>Meu Perfil</NavLink>
            </>
          )}

          {usuario?.papel === 'fotografo' && (
            <>
              <NavLink to="/painel-fotografo" onClick={() => setMenuAberto(false)} className={linkClass}>Meu Painel</NavLink>
              <NavLink to="/" onClick={() => setMenuAberto(false)} className={linkClass}>Ver Catálogo</NavLink>
            </>
          )}

          {usuario?.papel === 'admin' && (
            <>
              <NavLink to="/funcionalidades" onClick={() => setMenuAberto(false)} className={linkClass}>Painel Geral</NavLink>
              <NavLink to="/" onClick={() => setMenuAberto(false)} className={linkClass}>Ver Catálogo</NavLink>
            </>
          )}

          {usuario ? (
            <div className="pt-2 border-t border-border-custom flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-text-main">{usuario.nome}</p>
                <p className="text-[10px] text-wine-primary uppercase">{usuario.papel}</p>
              </div>
              <button
                onClick={() => { setMenuAberto(false); handleLogout(); }}
                className="text-xs bg-bg-main text-wine-primary px-3 py-1 rounded border border-border-custom"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuAberto(false)}
              className="bg-wine-primary text-bg-main text-xs font-medium px-4 py-2 rounded-lg text-center mt-2"
            >
              Entrar
            </Link>
          )}
        </div>
      )}
    </header>
  );
}