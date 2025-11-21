import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Titulo from '../components/Titulo'
import './Pages.css'

function CadastroCrianca() {
  const { register, handleSubmit, reset } = useForm()
  const [criancas, setCriancas] = useState([])

  function gerarToken() {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  async function cadastrarCrianca(data) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    
    const novaCrianca = {
      nome: data.nome,
      idade: parseInt(data.idade),
      token: gerarToken(),
      responsavelId: usuarioLogado.id,
      pontos: 0,
      tarefasCompletas: 0,
      dataCadastro: new Date().toISOString(),
      avatar: data.avatar || '👶'
    }

    try {
      const resposta = await fetch('http://localhost:3001/criancas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaCrianca)
      })

      if (resposta.ok) {
        const criancaSalva = await resposta.json()
        setCriancas([...criancas, criancaSalva])
        alert(`✅ Criança cadastrada com sucesso!\nToken de acesso: ${criancaSalva.token}`)
        reset()
      }
    } catch (error) {
      console.error('Erro ao cadastrar criança:', error)
      alert('Erro ao cadastrar criança')
    }
  }

  return (
    <>
      <Titulo />
      <div className="page-container">
        <div className="page-header">
          <h1>👶 Cadastrar Nova Criança</h1>
          <p>Adicione uma criança para começar a usar o sistema</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit(cadastrarCrianca)} className="styled-form">
            <div className="form-group">
              <label>Nome da Criança:</label>
              <input 
                type="text" 
                required 
                {...register('nome')}
                placeholder="Digite o nome da criança"
              />
            </div>

            <div className="form-group">
              <label>Idade:</label>
              <input 
                type="number" 
                min="3" 
                max="12" 
                required 
                {...register('idade')}
                placeholder="Idade entre 3 e 12 anos"
              />
            </div>

            <div className="form-group">
              <label>Avatar:</label>
              <select {...register('avatar')} defaultValue="👶">
                <option value="👶">Bebê</option>
                <option value="👦">Menino</option>
                <option value="👧">Menina</option>
                <option value="🦸">Super-herói</option>
                <option value="🧙">Mago</option>
                <option value="🐱">Gatinho</option>
                <option value="🐶">Cachorrinho</option>
              </select>
            </div>

            <button type="submit" className="btn-submit">
              🎯 Cadastrar Criança
            </button>
          </form>
        </div>

        {criancas.length > 0 && (
          <div className="criancas-list">
            <h3>🎪 Crianças Cadastradas</h3>
            <div className="criancas-grid">
              {criancas.map(crianca => (
                <div key={crianca.id} className="crianca-card">
                  <div className="crianca-avatar">{crianca.avatar}</div>
                  <div className="crianca-info">
                    <h4>{crianca.nome}</h4>
                    <p>{crianca.idade} anos</p>
                    <p className="crianca-token">Token: {crianca.token}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CadastroCrianca