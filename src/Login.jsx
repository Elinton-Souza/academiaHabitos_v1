import { useForm } from "react-hook-form"
import './Auth.css'
import Titulo from './components/Titulo'
import { useEffect } from "react"

function Login() {
  const { register, handleSubmit, reset, setFocus } = useForm()

  useEffect(() => {
    // Se já estiver logado, redirecionar
    const usuarioLogado = localStorage.getItem('usuarioLogado')
    const criancaLogada = localStorage.getItem('criancaLogada')
    
    if (usuarioLogado || criancaLogada) {
      window.location.href = '/selecao-perfil'
    }
    
    setFocus("email")
  }, [])

  async function fazerLogin(data) {
    const email = data.email
    const senha = data.senha

    try {
      const resposta = await fetch("http://localhost:3001/usuarios")
      const usuarios = await resposta.json()
      
      const usuario = usuarios.find(u => u.email === email && u.senha === senha)
      
      if (usuario) {
        // Salvar no localStorage para login persistente
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario))
        window.location.href = "/selecao-perfil"
      } else {
        alert("Email ou senha incorretos!")
      }
    } catch (erro) {
      console.log(`Erro: ${erro.message}`)
      alert("Erro ao conectar com o servidor. Verifique se o JSON Server está rodando.")
    }
    reset()
  }

  return (
    <>
      <Titulo />
      <div className='auth-container'>
        <h1 style={{'marginTop': 0, 'textAlign': 'center'}}>Login</h1>
        <form onSubmit={handleSubmit(fazerLogin)}>
          <p>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" required
              className='campos larguraG' 
              {...register("email")}/>
          </p>
          <p>
            <label htmlFor="senha">Senha:</label>
            <input type="password" id="senha" required
              className='campos larguraG'
              {...register("senha")} />
          </p>
          <input type="submit" value="Entrar" className='btn submit' />
          <a href="/registro" className='btn reset' style={{marginLeft: '20px'}}>Criar Conta</a>
        </form>
      </div>
    </>
  )
}

export default Login