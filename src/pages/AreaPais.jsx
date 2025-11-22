import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Titulo from '../components/Titulo'
import './Pages.css'

function AreaPais() {
  const [criancas, setCriancas] = useState([])
  const [trilhas, setTrilhas] = useState([])

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resCriancas, resTrilhas] = await Promise.all([
          fetch('http://localhost:3001/criancas'),
          fetch('http://localhost:3001/trilhas')
        ])
        
        const criancasData = await resCriancas.json()
        const trilhasData = await resTrilhas.json()
        
        setCriancas(criancasData)
        setTrilhas(trilhasData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }
    carregarDados()
  }, [])

  return (
    <>
      <Titulo />
      <div className="page-container">
        <div className="page-header">
          <h1>👨‍👩‍👧‍👦 Área dos Papais</h1>
          <p>Gerencie os hábitos e acompanhe o progresso dos seus filhos</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card warning">
  <div className="card-icon">🎁</div>
  <h3>Recompensas</h3>
  <p>Crie recompensas que as crianças podem resgatar com pontos</p>
  <Link to="/recompensas" className="card-button">
    Gerenciar Recompensas
  </Link>
</div>
          <div className="dashboard-card primary">
            <div className="card-icon">👶</div>
            <h3>Gerenciar Crianças</h3>
            <p>Cadastre e gerencie os perfis das crianças</p>
            <Link to="/cadastro-crianca" className="card-button">
              Cadastrar Criança
            </Link>
          </div>

          <div className="dashboard-card secondary">
            <div className="card-icon">🎯</div>
            <h3>Criar Trilhas</h3>
            <p>Crie hábitos, rotinas e tarefas personalizadas</p>
            <Link to="/criar-trilha" className="card-button">
              Nova Trilha
            </Link>
          </div>

          <div className="dashboard-card success">
            <div className="card-icon">📊</div>
            <h3>Ver Progresso</h3>
            <p>Acompanhe o desenvolvimento das crianças</p>
            <Link to="/progresso" className="card-button">
              Ver Progresso
            </Link>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">{criancas.length}</span>
            <span className="stat-label">Crianças Cadastradas</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{trilhas.length}</span>
            <span className="stat-label">Trilhas Criadas</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {trilhas.reduce((total, trilha) => total + (trilha.tarefas?.length || 0), 0)}
            </span>
            <span className="stat-label">Tarefas Ativas</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default AreaPais