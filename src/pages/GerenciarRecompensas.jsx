import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Titulo from '../components/Titulo'
import './Pages.css'

function GerenciarRecompensas() {
  const { register, handleSubmit, reset } = useForm()
  const [recompensas, setRecompensas] = useState([])
  const [criancas, setCriancas] = useState([])

  useEffect(() => {
    carregarRecompensas()
    carregarCriancas()
  }, [])

  async function carregarRecompensas() {
    try {
      const resposta = await fetch('http://localhost:3001/recompensas')
      const dados = await resposta.json()
      setRecompensas(dados)
    } catch (error) {
      console.error('Erro ao carregar recompensas:', error)
    }
  }

  async function carregarCriancas() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    try {
      const resposta = await fetch(`http://localhost:3001/criancas?responsavelId=${usuarioLogado.id}`)
      const dados = await resposta.json()
      setCriancas(dados)
    } catch (error) {
      console.error('Erro ao carregar crianças:', error)
    }
  }

  async function criarRecompensa(data) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    
    const novaRecompensa = {
      titulo: data.titulo,
      descricao: data.descricao,
      pontos: parseInt(data.pontos),
      icone: data.icone,
      responsavelId: usuarioLogado.id,
      criancaId: data.criancaId ? parseInt(data.criancaId) : null, // null = para todas
      ativa: true,
      dataCriacao: new Date().toISOString()
    }

    try {
      const resposta = await fetch('http://localhost:3001/recompensas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaRecompensa)
      })

      if (resposta.ok) {
        const recompensaSalva = await resposta.json()
        setRecompensas([...recompensas, recompensaSalva])
        alert('🎁 Recompensa criada com sucesso!')
        reset()
      }
    } catch (error) {
      console.error('Erro ao criar recompensa:', error)
      alert('Erro ao criar recompensa')
    }
  }

  async function toggleRecompensa(recompensaId, ativa) {
    try {
      const resposta = await fetch(`http://localhost:3001/recompensas/${recompensaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativa: !ativa })
      })

      if (resposta.ok) {
        carregarRecompensas()
      }
    } catch (error) {
      console.error('Erro ao atualizar recompensa:', error)
    }
  }

  async function excluirRecompensa(recompensaId) {
    if (confirm('Tem certeza que deseja excluir esta recompensa?')) {
      try {
        await fetch(`http://localhost:3001/recompensas/${recompensaId}`, {
          method: 'DELETE'
        })
        carregarRecompensas()
      } catch (error) {
        console.error('Erro ao excluir recompensa:', error)
      }
    }
  }

  function getCriancaNome(criancaId) {
    if (!criancaId) return 'Todas as crianças'
    const crianca = criancas.find(c => c.id === criancaId)
    return crianca ? crianca.nome : 'Criança não encontrada'
  }

  return (
    <>
      <Titulo />
      <div className="page-container">
        <div className="page-header">
          <h1>🎁 Gerenciar Recompensas</h1>
          <p>Crie recompensas que suas crianças podem resgatar com os pontos</p>
        </div>

        <div className="content-grid">
          <div className="form-section">
            <h3>➕ Criar Nova Recompensa</h3>
            <form onSubmit={handleSubmit(criarRecompensa)} className="styled-form">
              <div className="form-group">
                <label>Título da Recompensa:</label>
                <input 
                  type="text" 
                  required 
                  {...register('titulo')}
                  placeholder="Ex: Passeio no Parque, Sorvete, etc."
                />
              </div>

              <div className="form-group">
                <label>Descrição:</label>
                <textarea 
                  {...register('descricao')}
                  placeholder="Descreva a recompensa..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pontos Necessários:</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    {...register('pontos')}
                    placeholder="Ex: 100"
                  />
                </div>

                <div className="form-group">
                  <label>Ícone:</label>
                  <select {...register('icone')} defaultValue="🎁">
                    <option value="🎁">Presente</option>
                    <option value="🍦">Sorvete</option>
                    <option value="🎮">Video-game</option>
                    <option value="🎬">Cinema</option>
                    <option value="🏆">Troféu</option>
                    <option value="⭐">Estrela</option>
                    <option value="🎪">Parque</option>
                    <option value="📚">Livro</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Para qual criança? (Opcional)</label>
                <select {...register('criancaId')}>
                  <option value="">Todas as crianças</option>
                  {criancas.map(crianca => (
                    <option key={crianca.id} value={crianca.id}>
                      {crianca.avatar} {crianca.nome}
                    </option>
                  ))}
                </select>
                <small>Deixe em branco para disponibilizar para todas as crianças</small>
              </div>

              <button type="submit" className="btn-submit">
                🎯 Criar Recompensa
              </button>
            </form>
          </div>

          <div className="list-section">
            <h3>📋 Recompensas Cadastradas</h3>
            
            {recompensas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-emoji">🎁</div>
                <h4>Nenhuma recompensa criada</h4>
                <p>Crie sua primeira recompensa para motivar suas crianças!</p>
              </div>
            ) : (
              <div className="recompensas-grid">
                {recompensas.map(recompensa => (
                  <div key={recompensa.id} className={`recompensa-card ${recompensa.ativa ? 'ativa' : 'inativa'}`}>
                    <div className="recompensa-header">
                      <span className="recompensa-icone">{recompensa.icone}</span>
                      <div className="recompensa-info">
                        <h4>{recompensa.titulo}</h4>
                        <p>{recompensa.descricao}</p>
                        <div className="recompensa-detalhes">
                          <span className="pontos-recompensa">⭐ {recompensa.pontos} pontos</span>
                          <span className="crianca-alvo">👶 {getCriancaNome(recompensa.criancaId)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="recompensa-actions">
                      <button 
                        onClick={() => toggleRecompensa(recompensa.id, recompensa.ativa)}
                        className={`btn-status ${recompensa.ativa ? 'ativa' : 'inativa'}`}
                      >
                        {recompensa.ativa ? '✅ Ativa' : '❌ Inativa'}
                      </button>
                      <button 
                        onClick={() => excluirRecompensa(recompensa.id)}
                        className="btn-excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default GerenciarRecompensas