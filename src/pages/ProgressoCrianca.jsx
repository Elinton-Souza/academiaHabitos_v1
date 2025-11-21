import { useState, useEffect } from 'react'
import Titulo from '../components/Titulo'
import './Pages.css'

function ProgressoCrianca() {
  const [criancas, setCriancas] = useState([])
  const [trilhas, setTrilhas] = useState([])
  const [criancaSelecionada, setCriancaSelecionada] = useState(null)

  useEffect(() => {
    carregarCriancas()
  }, [])

  async function carregarCriancas() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    try {
      const resposta = await fetch(`http://localhost:3001/criancas?responsavelId=${usuarioLogado.id}`)
      const criancasData = await resposta.json()
      setCriancas(criancasData)
    } catch (error) {
      console.error('Erro ao carregar crianças:', error)
    }
  }

  async function carregarTrilhas(criancaId) {
    try {
      const resposta = await fetch(`http://localhost:3001/trilhas?criancaId=${criancaId}`)
      const trilhasData = await resposta.json()
      setTrilhas(trilhasData)
      setCriancaSelecionada(criancas.find(c => c.id === criancaId))
    } catch (error) {
      console.error('Erro ao carregar trilhas:', error)
    }
  }

  function calcularProgresso(trilha) {
    if (!trilha.tarefas || trilha.tarefas.length === 0) return 0
    const tarefasCompletas = trilha.tarefas.filter(t => t.completada).length
    return (tarefasCompletas / trilha.tarefas.length) * 100
  }

  return (
    <>
      <Titulo />
      <div className="page-container">
        <div className="page-header">
          <h1>📊 Acompanhar Progresso</h1>
          <p>Veja o desenvolvimento das crianças</p>
        </div>

        <div className="criancas-selector">
          <h3>Selecione uma criança:</h3>
          <div className="criancas-grid">
            {criancas.map(crianca => (
              <div 
                key={crianca.id} 
                className={`crianca-card ${criancaSelecionada?.id === crianca.id ? 'selected' : ''}`}
                onClick={() => carregarTrilhas(crianca.id)}
              >
                <div className="crianca-avatar">{crianca.avatar}</div>
                <div className="crianca-info">
                  <h4>{crianca.nome}</h4>
                  <p>{crianca.idade} anos</p>
                  <div className="crianca-stats">
                    <span>⭐ {crianca.pontos || 0} pontos</span>
                    <span>🎯 {crianca.tarefasCompletas || 0} completas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {criancaSelecionada && (
          <div className="progresso-container">
            <div className="crianca-header">
              <h2>Progresso de {criancaSelecionada.nome}</h2>
              <div className="crianca-resumo">
                <div className="resumo-item">
                  <span className="resumo-valor">{criancaSelecionada.pontos || 0}</span>
                  <span className="resumo-label">Pontos Totais</span>
                </div>
                <div className="resumo-item">
                  <span className="resumo-valor">{criancaSelecionada.tarefasCompletas || 0}</span>
                  <span className="resumo-label">Tarefas Completas</span>
                </div>
                <div className="resumo-item">
                  <span className="resumo-valor">{trilhas.length}</span>
                  <span className="resumo-label">Trilhas Ativas</span>
                </div>
              </div>
            </div>

            {trilhas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-emoji">📝</div>
                <h3>Nenhuma trilha encontrada</h3>
                <p>Crie algumas trilhas para {criancaSelecionada.nome} começar!</p>
              </div>
            ) : (
              <div className="trilhas-progresso">
                {trilhas.map(trilha => {
                  const progresso = calcularProgresso(trilha)
                  return (
                    <div key={trilha.id} className="trilha-progresso-card">
                      <div className="trilha-header">
                        <span className="trilha-icone">{trilha.icone}</span>
                        <h3>{trilha.titulo}</h3>
                        <span className="progresso-percent">{Math.round(progresso)}%</span>
                      </div>
                      
                      <div className="progresso-bar">
                        <div 
                          className="progresso-fill" 
                          style={{ width: `${progresso}%` }}
                        ></div>
                      </div>

                      <div className="tarefas-progresso">
                        {trilha.tarefas?.map(tarefa => (
                          <div key={tarefa.id} className="tarefa-progresso">
                            <span className={`tarefa-status ${tarefa.completada ? 'completa' : 'pendente'}`}>
                              {tarefa.completada ? '✅' : '⏳'}
                            </span>
                            <span className="tarefa-titulo">{tarefa.titulo}</span>
                            <span className="tarefa-pontos">+{tarefa.pontos}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default ProgressoCrianca