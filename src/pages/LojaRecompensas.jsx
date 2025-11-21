import { useState, useEffect } from 'react'
import Titulo from '../components/Titulo'
import './Pages.css'

function LojaRecompensas() {
  const [recompensas, setRecompensas] = useState([])
  const [crianca, setCrianca] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const criancaLogada = localStorage.getItem('criancaLogada')
    if (criancaLogada) {
      const criancaData = JSON.parse(criancaLogada)
      setCrianca(criancaData)
      carregarRecompensas(criancaData.id)
    } else {
      setCarregando(false)
    }
  }, [])

  async function carregarRecompensas(criancaId) {
    try {
      setCarregando(true)
      // Buscar recompensas para esta criança específica e recompensas gerais
      const resposta = await fetch(`http://localhost:3001/recompensas?ativa=true`)
      const todasRecompensas = await resposta.json()
      
      // Filtrar recompensas: da criança específica OU gerais (sem criancaId)
      const recompensasFiltradas = todasRecompensas.filter(
        r => !r.criancaId || r.criancaId === criancaId
      )
      
      setRecompensas(recompensasFiltradas)
    } catch (error) {
      console.error('Erro ao carregar recompensas:', error)
    } finally {
      setCarregando(false)
    }
  }

  async function resgatarRecompensa(recompensa) {
    if (!crianca) return

    if (crianca.pontos < recompensa.pontos) {
      alert(`❌ Você precisa de mais ${recompensa.pontos - crianca.pontos} pontos para resgatar esta recompensa!`)
      return
    }

    if (!confirm(`Tem certeza que deseja resgatar "${recompensa.titulo}" por ${recompensa.pontos} pontos?`)) {
      return
    }

    try {
      // Criar registro de resgate
      const resgate = {
        criancaId: crianca.id,
        recompensaId: recompensa.id,
        pontosGastos: recompensa.pontos,
        dataResgate: new Date().toISOString(),
        status: 'pendente'
      }

      await fetch('http://localhost:3001/resgates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resgate)
      })

      // Atualizar pontos da criança
      const criancaAtualizada = {
        ...crianca,
        pontos: crianca.pontos - recompensa.pontos
      }

      await fetch(`http://localhost:3001/criancas/${crianca.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criancaAtualizada)
      })

      // Atualizar localStorage
      setCrianca(criancaAtualizada)
      localStorage.setItem('criancaLogada', JSON.stringify(criancaAtualizada))

      alert(`🎉 Parabéns! Você resgatou "${recompensa.titulo}"!\n\nMostre esta mensagem para seus pais para receber sua recompensa!`)
      carregarRecompensas(crianca.id)
      
    } catch (error) {
      console.error('Erro ao resgatar recompensa:', error)
      alert('Erro ao resgatar recompensa')
    }
  }

  if (!crianca && !carregando) {
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

  if (carregando) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="loading-spinner">🛍️</div>
          <p>Carregando recompensas...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Titulo usuario={crianca} />
      <div className="page-container kids-theme">
        <div className="page-header kids-header">
          <h1>🛍️ Loja de Recompensas</h1>
          <p>Use seus pontos para resgatar recompensas incríveis! 🎁</p>
          <div className="kid-stats">
            <div className="kid-stat large">
              <span className="stat-emoji">⭐</span>
              <span className="stat-value">{crianca.pontos || 0} pontos disponíveis</span>
            </div>
          </div>
        </div>

        {recompensas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-emoji">🎁</div>
            <h3>Nenhuma recompensa disponível</h3>
            <p>Seus pais ainda não criaram recompensas. Peça para eles criarem algumas!</p>
          </div>
        ) : (
          <div className="loja-container">
            <div className="recompensas-grid loja">
              {recompensas.map(recompensa => {
                const podeResgatar = crianca.pontos >= recompensa.pontos
                
                return (
                  <div key={recompensa.id} className={`recompensa-card-loja ${podeResgatar ? 'disponivel' : 'indisponivel'}`}>
                    <div className="recompensa-header-loja">
                      <span className="recompensa-icone-loja">{recompensa.icone}</span>
                      <div className="preco-tag">⭐ {recompensa.pontos}</div>
                    </div>
                    
                    <div className="recompensa-content-loja">
                      <h3>{recompensa.titulo}</h3>
                      <p>{recompensa.descricao}</p>
                    </div>
                    
                    <div className="recompensa-actions-loja">
                      {podeResgatar ? (
                        <button 
                          onClick={() => resgatarRecompensa(recompensa)}
                          className="btn-resgatar"
                        >
                          🎯 Resgatar Agora!
                        </button>
                      ) : (
                        <div className="pontos-insuficientes">
                          ❌ Faltam {recompensa.pontos - crianca.pontos} pontos
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="loja-info">
          <h3>💡 Como funciona?</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-emoji">🎯</span>
              <p>Complete missões para ganhar pontos</p>
            </div>
            <div className="info-item">
              <span className="info-emoji">🛍️</span>
              <p>Escolha suas recompensas favoritas</p>
            </div>
            <div className="info-item">
              <span className="info-emoji">👨‍👩‍👧‍👦</span>
              <p>Mostre para seus pais para receber</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LojaRecompensas