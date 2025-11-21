import { useEffect, useState } from 'react'
import './App.css'
import Titulo from './components/Titulo'

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const usuarioSalvo = localStorage.getItem('usuarioLogado')
    const criancaSalva = localStorage.getItem('criancaLogada')
    
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo))
    } else if (criancaSalva) {
      setUsuarioLogado(JSON.parse(criancaSalva))
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('usuarioLogado')
    localStorage.removeItem('criancaLogada')
    setUsuarioLogado(null)
    window.location.href = '/'
  }

  function handleContinuarApp() {
    if (usuarioLogado) {
      window.location.href = '/selecao-perfil'
    } else {
      window.location.href = '/login'
    }
  }

  return (
    <>
      <Titulo usuario={usuarioLogado} onLogout={handleLogout} />
      <div className="landing-container">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Transforme Rotinas em Aventuras! 🎯</h1>
            <p>A plataforma que torna as tarefas diárias das crianças em missões divertidas e recompensadoras</p>
            
            {usuarioLogado ? (
              <div className="welcome-user">
                <p>Que bom te ver de novo, <strong>{usuarioLogado.nome}</strong>! 🎉</p>
                <div className="user-actions">
                  <button onClick={handleContinuarApp} className="btn-primary large">
                    Continuar para o App 🚀
                  </button>
                  <button onClick={handleLogout} className="btn-secondary large">
                    Sair da Conta
                  </button>
                </div>
              </div>
            ) : (
              <div className="cta-buttons">
                <button onClick={() => window.location.href = '/login'} className="btn-primary large">
                  Fazer Login
                </button>
                <button onClick={() => window.location.href = '/registro'} className="btn-secondary large">
                  Criar Conta
                </button>
              </div>
            )}
          </div>
          <div className="hero-visual">
            <div className="floating-card mission">🎯 Missões</div>
            <div className="floating-card points">⭐ Pontos</div>
            <div className="floating-card rewards">🏆 Recompensas</div>
          </div>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👶</div>
            <h3>Para Crianças</h3>
            <p>Interface colorida e divertida onde cada tarefa vira uma missão emocionante</p>
            <ul>
              <li>🎮 Sistema de pontos gamificado</li>
              <li>🏆 Conquistas e recompensas</li>
              <li>📱 Design amigável e intuitivo</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍👩‍👧‍👦</div>
            <h3>Para Pais</h3>
            <p>Controle total sobre as atividades e acompanhamento do progresso</p>
            <ul>
              <li>📊 Dashboard de progresso</li>
              <li>🎯 Criação de tarefas personalizadas</li>
              <li>📱 Acompanhamento em tempo real</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💫</div>
            <h3>Para Famílias</h3>
            <p>Fortalecendo laços através de rotinas saudáveis e divertidas</p>
            <ul>
              <li>🤝 Desenvolvimento de hábitos</li>
              <li>❤️ Melhora na comunicação familiar</li>
              <li>🎉 Celebração de conquistas juntos</li>
            </ul>
          </div>
        </div>

        <div className="plans-section">
          <h2>Escolha o Plano Perfeito para Sua Família 💫</h2>
          <div className="plans-grid">
            <div className="plan-card free">
              <div className="plan-header">
                <h3>Grátis</h3>
                <div className="plan-price">R$ 0</div>
                <span>para sempre</span>
              </div>
              <ul className="plan-features">
                <li>✅ Até 2 crianças</li>
                <li>✅ 5 tarefas por criança</li>
                <li>✅ Sistema básico de pontos</li>
                <li>✅ Acompanhamento simples</li>
                <li>❌ Recompensas personalizadas</li>
                <li>❌ Relatórios detalhados</li>
              </ul>
              <button className="plan-btn" onClick={() => window.location.href = '/registro'}>
                Começar Grátis
              </button>
            </div>

            <div className="plan-card premium">
              <div className="plan-badge">Mais Popular</div>
              <div className="plan-header">
                <h3>Premium</h3>
                <div className="plan-price">R$ 19,90</div>
                <span>por mês</span>
              </div>
              <ul className="plan-features">
                <li>✅ Crianças ilimitadas</li>
                <li>✅ Tarefas ilimitadas</li>
                <li>✅ Sistema avançado de pontos</li>
                <li>✅ Recompensas personalizadas</li>
                <li>✅ Relatórios detalhados</li>
                <li>✅ Suporte prioritário</li>
              </ul>
              <button className="plan-btn primary" onClick={() => window.location.href = '/registro'}>
                Assinar Premium
              </button>
            </div>

            <div className="plan-card family">
              <div className="plan-header">
                <h3>Família</h3>
                <div className="plan-price">R$ 29,90</div>
                <span>por mês</span>
              </div>
              <ul className="plan-features">
                <li>✅ Todas as features Premium</li>
                <li>✅ Até 3 famílias conectadas</li>
                <li>✅ Competições saudáveis</li>
                <li>✅ Dashboard familiar</li>
                <li>✅ Eventos e desafios especiais</li>
                <li>✅ Consultoria personalizada</li>
              </ul>
              <button className="plan-btn" onClick={() => window.location.href = '/registro'}>
                Escolher Família
              </button>
            </div>
          </div>
        </div>

        {!usuarioLogado && (
          <div className="final-cta">
            <h2>Pronto para Transformar a Rotina da Sua Família? 🚀</h2>
            <p>Junte-se a mais de 10.000 famílias que já descobriram o segredo para tornar as tarefas divertidas</p>
            <div className="cta-buttons">
              <button onClick={() => window.location.href = '/registro'} className="btn-primary large">
                Começar Agora - É Grátis!
              </button>
            </div>
            <div className="trust-badges">
              <span>⭐ 4.9/5 - Avaliado por 2.000+ famílias</span>
              <span>👨‍👩‍👧‍👦 10.000+ famílias felizes</span>
              <span>🔒 100% seguro e privado</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App