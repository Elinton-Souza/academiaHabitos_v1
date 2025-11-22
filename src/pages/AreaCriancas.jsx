import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Titulo from "../components/Titulo";
import CardTarefa from "../components/CardTarefa";
import "./Pages.css";

function AreaCriancas() {
  const [trilhas, setTrilhas] = useState([]);
  const [crianca, setCrianca] = useState(null);
  const [carregando, setCarregando] = useState(true);

  console.log("AreaCriancas carregando..."); // Debug

  useEffect(() => {
    console.log("useEffect executado"); // Debug
    const criancaLogada = localStorage.getItem("criancaLogada");
    console.log("criancaLogada:", criancaLogada); // Debug

    if (criancaLogada) {
      try {
        const criancaData = JSON.parse(criancaLogada);
        console.log("Dados da criança:", criancaData); // Debug
        setCrianca(criancaData);
        carregarTrilhas(criancaData.id);
      } catch (error) {
        console.error("Erro ao parsear criança:", error);
        setCarregando(false);
      }
    } else {
      console.log("Nenhuma criança logada encontrada");
      setCarregando(false);
    }
  }, []);

  async function carregarTrilhas(criancaId) {
    console.log("Carregando trilhas para criança:", criancaId); // Debug
    try {
      setCarregando(true);
      const resposta = await fetch(
        `http://localhost:3001/trilhas?criancaId=${criancaId}`
      );
      console.log("Resposta da API:", resposta); // Debug

      if (!resposta.ok) {
        throw new Error("Erro na resposta da API");
      }

      const trilhasData = await resposta.json();
      console.log("Trilhas carregadas:", trilhasData); // Debug

      // Adicionar trilhaId em cada tarefa para referência
      const trilhasComIds = trilhasData.map((trilha) => ({
        ...trilha,
        tarefas:
          trilha.tarefas?.map((tarefa) => ({
            ...tarefa,
            trilhaId: trilha.id,
          })) || [],
      }));

      setTrilhas(trilhasComIds);

      // Atualizar dados da criança do localStorage
      const respostaCrianca = await fetch(
        `http://localhost:3001/criancas/${criancaId}`
      );
      if (respostaCrianca.ok) {
        const criancaAtualizada = await respostaCrianca.json();
        setCrianca(criancaAtualizada);
        localStorage.setItem(
          "criancaLogada",
          JSON.stringify(criancaAtualizada)
        );
      }
    } catch (error) {
      console.error("Erro ao carregar trilhas:", error);
    } finally {
      setCarregando(false);
    }
  }

  function calcularTotalTarefas() {
    return trilhas.reduce(
      (total, trilha) => total + (trilha.tarefas?.length || 0),
      0
    );
  }

  function calcularTarefasCompletas() {
    return trilhas.reduce((total, trilha) => {
      const completas = trilha.tarefas?.filter((t) => t.completada).length || 0;
      return total + completas;
    }, 0);
  }

  // Debug: Mostrar estado atual
  console.log("Estado atual:", { crianca, trilhas, carregando });

  if (!crianca && !carregando) {
    return (
      <div className="page-container">
        <Titulo />
        <div className="error-message">
          <h2>🚫 Acesso Restrito</h2>
          <p>Você precisa fazer login como criança primeiro!</p>
          <button
            onClick={() => (window.location.href = "/selecao-perfil")}
            className="btn-primary"
          >
            Voltar para Seleção
          </button>
        </div>
      </div>
    );
  }

  if (carregando) {
    return (
      <div className="page-container">
        <Titulo />
        <div className="loading">
          <div className="loading-spinner">🎮</div>
          <p>Carregando suas missões...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Titulo usuario={crianca} />
      <div className="page-container kids-theme">
        <div className="page-header kids-header">
          <h1>🎮 Bem-vindo, {crianca.nome}!</h1>
          <p>Complete as missões e ganhe recompensas! 🏆</p>
          <div className="kid-stats">
            <div className="kid-stat">
              <span className="stat-emoji">⭐</span>
              <span className="stat-value">{crianca.pontos || 0} pontos</span>
            </div>
            <div className="kid-stat">
              <span className="stat-emoji">🎯</span>
              <span className="stat-value">
                {crianca.tarefasCompletas || 0} missões completas
              </span>
            </div>
            <div className="kid-stat">
              <span className="stat-emoji">📋</span>
              <span className="stat-value">
                {calcularTotalTarefas()} missões totais
              </span>
            </div>
            <div className="kid-stat">
              <span className="stat-emoji">🛍️</span>
              <Link to="/loja" className="stat-value link">
                Loja de Recompensas
              </Link>
            </div>
          </div>
        </div>

        {trilhas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-emoji">🤔</div>
            <h3>Nenhuma missão disponível</h3>
            <p>Peça para seus pais criarem algumas missões para você!</p>
            <button
              onClick={() => (window.location.href = "/selecao-perfil")}
              className="btn-primary"
            >
              Voltar para Seleção
            </button>
          </div>
        ) : (
          <div className="trilhas-container">
            {trilhas.map((trilha) => {
              const tarefasCompletas =
                trilha.tarefas?.filter((t) => t.completada).length || 0;
              const totalTarefas = trilha.tarefas?.length || 0;

              return (
                <div key={trilha.id} className="trilha-section">
                  <div className="trilha-header">
                    <div className="trilha-title">
                      <span className="trilha-icone">{trilha.icone}</span>
                      <h2>{trilha.titulo}</h2>
                    </div>
                    <div className="trilha-progress">
                      <span className="trilha-badge">
                        {tarefasCompletas}/{totalTarefas} missões
                      </span>
                      {totalTarefas > 0 && (
                        <div className="progress-mini">
                          <div
                            className="progress-mini-fill"
                            style={{
                              width: `${
                                (tarefasCompletas / totalTarefas) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {trilha.descricao && (
                    <p className="trilha-descricao">{trilha.descricao}</p>
                  )}

                  <div className="tarefas-grid">
                    {trilha.tarefas?.map((tarefa) => (
                      <CardTarefa
                        key={tarefa.id}
                        tarefa={tarefa}
                        criancaId={crianca.id}
                        onTarefaCompleta={() => carregarTrilhas(crianca.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="kids-motivation">
          <p>
            💫 Cada missão completada te aproxima de recompensas incríveis!
            Continue assim! 🚀
          </p>
        </div>
      </div>
    </>
  );
}

export default AreaCriancas;
