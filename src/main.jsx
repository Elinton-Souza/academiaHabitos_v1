import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './Login.jsx'
import Registro from './Registro.jsx'
import SelecaoPerfil from './SelecaoPerfil.jsx'
import AreaPais from './pages/AreaPais.jsx'
import AreaCriancas from './pages/AreaCriancas.jsx'
import CadastroCrianca from './pages/CadastroCrianca.jsx'
import CriarTrilha from './pages/CriarTrilha.jsx'
import ProgressoCrianca from './pages/ProgressoCrianca.jsx'
import GerenciarRecompensas from './pages/GerenciarRecompensas'
import LojaRecompensas from './pages/LojaRecompensas'

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/selecao-perfil" element={<SelecaoPerfil />} />
        <Route path="/area-pais" element={<AreaPais />} />
        <Route path="/area-criancas" element={<AreaCriancas />} />
        <Route path="/recompensas" element={<GerenciarRecompensas />} />
<Route path="/loja" element={<LojaRecompensas />} />
        <Route path="/cadastro-crianca" element={<CadastroCrianca />} />
        <Route path="/criar-trilha" element={<CriarTrilha />} />
        <Route path="/progresso" element={<ProgressoCrianca />} />
      </Routes>
    </Router>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)