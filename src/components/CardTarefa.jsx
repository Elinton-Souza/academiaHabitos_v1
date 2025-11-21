import './CardTarefa.css'

function CardTarefa({ tarefa, criancaId, onTarefaCompleta }) {
  async function marcarComoCompleta() {
    if (tarefa.completada) return

    try {
      // Atualizar tarefa como completa
      const tarefaAtualizada = { ...tarefa, completada: true }
      
      // Atualizar pontos da criança
      const respostaCrianca = await fetch(`http://localhost:3001/criancas/${criancaId}`)
      const crianca = await respostaCrianca.json()
      
      const criancaAtualizada = {
        ...crianca,
        pontos: (crianca.pontos || 0) + tarefa.pontos,
        tarefasCompletas: (crianca.tarefasCompletas || 0) + 1
      }
      
      await fetch(`http://localhost:3001/criancas/${criancaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criancaAtualizada)
      })

      alert(`🎉 Parabéns! Você ganhou ${tarefa.pontos} pontos!`)
      onTarefaCompleta()
      
    } catch (error) {
      console.error('Erro ao completar tarefa:', error)
      alert('Erro ao marcar tarefa como completa')
    }
  }

  return (
    <div className={`card-tarefa ${tarefa.completada ? 'completa' : ''}`}>
      <div className="tarefa-header">
        <span className="tarefa-icone">{tarefa.icone}</span>
        <span className="tarefa-pontos">+{tarefa.pontos}</span>
      </div>
      
      <div className="tarefa-content">
        <h3>{tarefa.titulo}</h3>
        <p>{tarefa.descricao}</p>
      </div>
      
      <div className="tarefa-actions">
        {!tarefa.completada ? (
          <button onClick={marcarComoCompleta} className="btn-completar">
            ✅ Marcar como Feita
          </button>
        ) : (
          <span className="tarefa-concluida">🎉 Concluída!</span>
        )}
      </div>
    </div>
  )
}

export default CardTarefa