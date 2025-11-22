import { useEffect, useState } from "react";
import Titulo from "./components/Titulo";
import "./Auth.css";

function SelecaoPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [tokenCrianca, setTokenCrianca] = useState("");

  useEffect(() => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (usuarioLogado) {
      123456;
      setUsuario(JSON.parse(usuarioLogado));
    }
  }, []);

  async function handlePerfilPai() {
    const senha = prompt("Digite sua senha novamente para confirmar:");
    if (senha === usuario.senha) {
      window.location.href = "/area-pais";
    } else {
      alert("Senha incorreta!");
    }
  }

  async function handlePerfilCrianca() {
    if (!tokenCrianca) {
      alert("Digite o token de acesso!");
      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:3001/criancas?token=${tokenCrianca}`
      );
      const criancas = await resposta.json();

      if (criancas.length > 0) {
        localStorage.setItem("criancaLogada", JSON.stringify(criancas[0]));
        window.location.href = "/area-criancas";
      } else {
        alert("Token inválido! Verifique o token fornecido pelos seus pais.");
      }
    } catch (error) {
      console.error("Erro ao validar token:", error);
      alert("Erro ao validar token");
    }
  }

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Titulo />
      <div className="auth-container">
        <h1 style={{ marginTop: 0, textAlign: "center" }}>
          Olá, {usuario.nome}! 👋
        </h1>
        <p style={{ textAlign: "center", marginBottom: "2rem" }}>
          Como você gostaria de acessar?
        </p>

        <div className="perfil-options">
          <div className="perfil-option">
            <h3>👨‍👩‍👧‍👦 Área dos Pais</h3>
            <p>Crie hábitos e acompanhe o progresso</p>
            <button onClick={handlePerfilPai} className="btn submit">
              Acessar como Responsável
            </button>
          </div>

          <div className="perfil-divider">
            <span>ou</span>
          </div>

          <div className="perfil-option">
            <h3>🎮 Área das Crianças</h3>
            <p>Complete missões e ganhe pontos</p>
            <div className="token-input">
              <input
                type="text"
                placeholder="Digite seu token de 4 dígitos"
                value={tokenCrianca}
                onChange={(e) => setTokenCrianca(e.target.value)}
                maxLength="4"
                className="campos"
              />
            </div>
            <button onClick={handlePerfilCrianca} className="btn submit">
              Acessar como Criança
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SelecaoPerfil;
