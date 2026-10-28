import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Funcionalidades from './pages/Funcionalidades';
import Contato from './pages/Contato';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import ChatIA from './pages/ChatIA';
import PainelFotografo from './pages/PainelFotografo';
import PainelCliente from './pages/PainelCliente';
import RotaProtegida from './components/RotaProtegida';

export default function App() {
  return (
    <div className="min-h-screen bg-bg-main text-text-main flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Rotas Publicas */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat-ia" element={<ChatIA />} />
          <Route path="/portfolio/:id" element={<Portfolio />} />

          {/* Rota Protegida - Painel do Cliente */}
          <Route
            path="/painel-cliente"
            element={
              <RotaProtegida papeisPermitidos={['cliente', 'admin']}>
                <PainelCliente />
              </RotaProtegida>
            }
          />

          {/* Rota Protegida - Painel do Fotografo */}
          <Route
            path="/painel-fotografo"
            element={
              <RotaProtegida papeisPermitidos={['fotografo', 'admin']}>
                <PainelFotografo />
              </RotaProtegida>
            }
          />

          {/* Rota Protegida - Painel Geral (Admin) */}
          <Route
            path="/funcionalidades"
            element={
              <RotaProtegida papeisPermitidos={['admin']}>
                <Funcionalidades />
              </RotaProtegida>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}