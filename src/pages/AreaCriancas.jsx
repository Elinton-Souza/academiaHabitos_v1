import { useState, useEffect } from 'react'
import Titulo from '../components/Titulo'
import CardTarefa from '../components/CardTarefa'
import './Pages.css'

function AreaCriancas() {
  const [trilhas, setTrilhas] = useState([])
  const [crianca, setCrianca] = useState(null)

  useEffect(() => {
    const criancaLogada = localStorage.getItem('criancaLogada')
    if (criancaLogada) {
      const criancaData = JSON.parse(criancaLogada)
      setCrianca(criancaData)
      carregarTrilhas(criancaData.id)
    }
  }, [])

  async function carregarTrilhas(criancaId) {
    try {
      const resposta = await fetch(`http://localhost:3001/trilhas?criancaId=${criancaId}`)
      const trilhasData = await resposta.json()
      setTrilhas(trilhasData)
    } catch (error) {
      console.error('Erro ao carregar trilhas:', error)
    }
  }

  if (!crianca) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>🚫 Acesso Restrito</h2>
          <p>Você precisa fazer login como criança primeiro!</p>
          <button onClick={() => window.location.href = '/selecao-perfil'} className="btn-primary">
            Voltar para Seleção
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Titulo />
      <div className="page-container kids-theme">
        <div className="page-header kids-header">
          <h1>🎮 Bem-vindo, {crianca.nome}!</h1>
          <p>Complete as missões e ganhe recompensas! 🏆</p>
          <div className="kid-stats">
            <div className="kid-stat">
<div className="kid-stat">
  <span className="stat-emoji">🛍️</span>
  <Link to="/loja" className="stat-value">Loja de Recompensas</Link>
</div>
              <span className="stat-emoji">⭐</span>
              <span className="stat-value">{crianca.pontos || 0} pontos</span>
            </div>
            <div className="kid-stat">
              <span className="stat-emoji">🎯</span>
              <span className="stat-value">{crianca.tarefasCompletas || 0} missões</span>
            </div>
          </div>
        </div>

        {trilhas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-emoji">🤔</div>
            <h3>Nenhuma missão disponível</h3>
            <p>Peça para seus pais criarem algumas missões para você!</p>
          </div>
        ) : (
          <div className="trilhas-container">
            {trilhas.map(trilha => (
              <div key={trilha.id} className="trilha-section">
                <div className="trilha-header">
                  <h2>{trilha.icone} {trilha.titulo}</h2>
                  <span className="trilha-badge">{trilha.tarefas?.length || 0} missões</span>
                </div>
                <div className="tarefas-grid">
                  {trilha.tarefas?.map(tarefa => (
                    <CardTarefa 
                      key={tarefa.id} 
                      tarefa={tarefa} 
                      criancaId={crianca.id}
                      onTarefaCompleta={() => carregarTrilhas(crianca.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="kids-motivation">
          <p>💫 Cada missão completada te aproxima de recompensas incríveis!</p>
        </div>
      </div>
    </>
  )
}

export default AreaCriancas