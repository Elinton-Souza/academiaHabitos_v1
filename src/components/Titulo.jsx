import { Link } from "react-router-dom";
import "./Titulo.css";

export default function Titulo({ usuario, onLogout }) {
  return (
    <>
      <header>
        <div className="header-container">
          <div className="logo">
            <div className="logo-icon">🎯</div>
            <div className="logo-text">
              <h1>Academia de Hábitos</h1>
              <span>Transformando rotinas em aventuras</span>
            </div>
          </div>

          <nav className="main-nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            {!usuario ? (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/registro" className="nav-link">
                  Cadastrar
                </Link>
              </>
            ) : (
              <>
                <Link to="/selecao-perfil" className="nav-link">
                  Meu App
                </Link>
                <div className="user-menu">
                  <span className="user-greeting">Olá, {usuario.nome}</span>
                  <div className="user-avatar">
                    {usuario.avatar || (usuario.tipo === "pai" ? "👨" : "👦")}
                  </div>
                  <button
                    onClick={onLogout}
                    className="logout-btn"
                    title="Sair"
                  >
                    🚪
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
