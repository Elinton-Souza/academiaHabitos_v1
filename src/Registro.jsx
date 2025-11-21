import { useForm } from "react-hook-form"
import './Auth.css'
import Titulo from './components/Titulo'
import { useEffect } from "react"

function Registro() {
  const { register, handleSubmit, reset, setFocus } = useForm()

  async function cadastrarUsuario(data) {
    const nome = data.nome
    const email = data.email
    const senha = data.senha

    try {
      const resposta = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({
          nome, email, senha, tipo: 'pai',
          dataCriacao: new Date().toISOString()
        })
      })
      if (!resposta.ok) throw new Error("Erro ao criar usuário")
      const novoUsuario = await resposta.json()
      alert(`🎉 Conta de responsável criada com sucesso!`)
      window.location.href = "/login"
    } catch (erro) {
      console.log(`Erro: ${erro.message}`)
      alert("Erro ao criar conta. Verifique se o JSON Server está rodando.")
    }
    reset()
  }

  useEffect(() => {
    setFocus("nome")
  }, [])

  return (
    <>
      <Titulo />
      <div className='auth-container'>
        <h1 style={{'marginTop': 0, 'textAlign': 'center'}}>Criar Conta de Responsável</h1>
        <p style={{'textAlign': 'center', 'color': '#666', 'marginBottom': '2rem'}}>
          Apenas pais/responsáveis podem criar contas. Crianças acessam com token.
        </p>
        <form onSubmit={handleSubmit(cadastrarUsuario)}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo:</label>
            <input type="text" id="nome" required
              className='campos larguraG' 
              {...register("nome")}
              placeholder="Seu nome completo"/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" required
              className='campos larguraG' 
              {...register("email")}
              placeholder="seu@email.com"/>
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input type="password" id="senha" required
              className='campos larguraG'
              {...register("senha")} 
              placeholder="Mínimo 6 caracteres"/>
          </div>
          
          <div className="form-actions">
            <input type="submit" value="Criar Conta de Responsável" className='btn submit' />
            <a href="/login" className='btn reset'>Já tenho conta</a>
          </div>
        </form>
      </div>
    </>
  )
}

export default Registro