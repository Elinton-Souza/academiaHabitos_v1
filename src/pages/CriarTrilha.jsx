import { useForm } from "react-hook-form";
import { useState } from "react";
import Titulo from "../components/Titulo";
import "./Pages.css";

function CriarTrilha() {
  const { register, handleSubmit, reset } = useForm();
  const [criancas, setCriancas] = useState([]);
  const [tarefas, setTarefas] = useState([]);

  useState(() => {
    carregarCriancas();
  }, []);

  async function carregarCriancas() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    try {
      const resposta = await fetch(
        `http://localhost:3001/criancas?responsavelId=${usuarioLogado.id}`
      );
      const criancasData = await resposta.json();
      setCriancas(criancasData);
    } catch (error) {
      console.error("Erro ao carregar crianças:", error);
    }
  }

  function adicionarTarefa(data) {
    const novaTarefa = {
      id: Date.now(),
      titulo: data.tituloTarefa,
      descricao: data.descricaoTarefa,
      pontos: parseInt(data.pontosTarefa),
      icone: data.iconeTarefa,
      repetir: data.repetirTarefa || "diaria",
    };
    setTarefas([...tarefas, novaTarefa]);
    reset({
      tituloTarefa: "",
      descricaoTarefa: "",
      pontosTarefa: 10,
      iconeTarefa: "✅",
    });
  }

  async function salvarTrilha(data) {
    if (tarefas.length === 0) {
      alert("Adicione pelo menos uma tarefa à trilha!");
      return;
    }

    const novaTrilha = {
      titulo: data.tituloTrilha,
      descricao: data.descricaoTrilha,
      criancaId: parseInt(data.criancaId),
      icone: data.iconeTrilha,
      tarefas: tarefas,
      dataCriacao: new Date().toISOString(),
      ativa: true,
    };

    try {
      const resposta = await fetch("http://localhost:3001/trilhas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaTrilha),
      });

      if (resposta.ok) {
        alert("🎉 Trilha criada com sucesso!");
        setTarefas([]);
        reset();
      }
    } catch (error) {
      console.error("Erro ao criar trilha:", error);
      alert("Erro ao criar trilha");
    }
  }

  function removerTarefa(tarefaId) {
    setTarefas(tarefas.filter((t) => t.id !== tarefaId));
  }

  return (
    <>
      <Titulo />
      <div className="page-container">
        <div className="page-header">
          <h1>🎯 Criar Nova Trilha</h1>
          <p>Crie uma sequência de tarefas para seu filho</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit(salvarTrilha)} className="styled-form">
            <div className="form-row">
              <div className="form-group">
                <label>Título da Trilha:</label>
                <input
                  type="text"
                  required
                  {...register("tituloTrilha")}
                  placeholder="Ex: Rotina Matinal"
                />
              </div>

              <div className="form-group">
                <label>Ícone:</label>
                <select {...register("iconeTrilha")} defaultValue="🎯">
                  <option value="🛏">Arrumar a cama</option>
                  <option value="🪥">Escovar os dentes</option>
                  <option value="🚰">Beber água</option>
                  <option value="📒">Estudar</option>
                  <option value="🛝">Brincar</option>
                  <option value="🥗">Comer salada</option>
                  <option value="🔵🟡">Agradecer por ser Lobão</option>
                  <option value="⚫⚪🔵">Agradecer por ser Grêmio</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Descrição:</label>
              <textarea
                {...register("descricaoTrilha")}
                placeholder="Descreva o objetivo desta trilha..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Para qual criança?</label>
              <select {...register("criancaId")} required>
                <option value="">Selecione uma criança</option>
                {criancas.map((crianca) => (
                  <option key={crianca.id} value={crianca.id}>
                    {crianca.avatar} {crianca.nome} ({crianca.idade} anos)
                  </option>
                ))}
              </select>
            </div>

            <div className="tarefas-section">
              <h3>📝 Adicionar Tarefas</h3>

              <div className="tarefa-form">
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      {...register("tituloTarefa")}
                      placeholder="Título da tarefa"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      {...register("pontosTarefa")}
                      placeholder="Pontos"
                      defaultValue="10"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <textarea
                      {...register("descricaoTarefa")}
                      placeholder="Descrição da tarefa"
                      rows="2"
                    />
                  </div>
                  <div className="form-group">
                    <select {...register("iconeTarefa")} defaultValue="✅">
                      <option value="🛏">Arrumar a cama</option>
                      <option value="🪥">Escovar os dentes</option>
                      <option value="🚰">Beber água</option>
                      <option value="📒">Estudar</option>
                      <option value="🛝">Brincar</option>
                      <option value="🥗">Comer salada</option>
                      <option value="🔵🟡">Agradecer por ser Lobão</option>
                      <option value="⚫⚪🔵">Agradecer por ser Grêmio</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit(adicionarTarefa)}
                  className="btn-secondary"
                >
                  ➕ Adicionar Tarefa
                </button>
              </div>

              {tarefas.length > 0 && (
                <div className="tarefas-list">
                  <h4>Tarefas Adicionadas ({tarefas.length})</h4>
                  {tarefas.map((tarefa) => (
                    <div key={tarefa.id} className="tarefa-item">
                      <span className="tarefa-icone">{tarefa.icone}</span>
                      <div className="tarefa-info">
                        <strong>{tarefa.titulo}</strong>
                        <span>{tarefa.descricao}</span>
                        <small>{tarefa.pontos} pontos</small>
                      </div>
                      <button
                        type="button"
                        onClick={() => removerTarefa(tarefa.id)}
                        className="btn-remove"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={tarefas.length === 0}
            >
              🚀 Criar Trilha
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CriarTrilha;
