import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './styles/App.css';

// --- Nossas Páginas (Views) ---
import WelcomeView from './views/WelcomeView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView'; // Agora importa o componente real
import RecommendationView from './views/RecommendationView';
import ResultsView from './views/ResultsView';
import AdminLayout from './views/AdminLayout';
import MinhasBuildsView from './views/MinhasBuildsView';

// --- Componente de Rota Protegida (Otimização) ---
const AdminRoute: React.FC = () => {
  const { isAdmin, isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <AdminLayout />;
};

function App() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* --- Header Dinâmico --- */}
      <header className="main-header">
        <nav className="nav-left">
          <NavLink to="/">Ideal-Computer</NavLink>
          <NavLink to="/montar-pc">Montar PC</NavLink>
          
          {isLoggedIn && (
            <NavLink to="/minhas-builds">Minhas Builds</NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin">Admin Hardware</NavLink>
          )}
        </nav>
        <nav className="nav-right">
          {!isLoggedIn ? (
            <>
              <NavLink to="/login" className="nav-button">
                Entrar
              </NavLink>
              <NavLink to="/register" className="nav-button primary">
                Registrar
              </NavLink>
            </>
          ) : (
            <button onClick={handleLogout} className="nav-button">
              Sair
            </button>
          )}
        </nav>
      </header>

      {/* --- Área de Conteúdo (Rotas) --- */}
      <main>
        <Routes>
          <Route path="/" element={<WelcomeView />} />
          <Route path="/montar-pc" element={<RecommendationView />} />
          <Route path="/resultado" element={<ResultsView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} /> {/* Rota agora usa o componente real */}
          <Route path="/minhas-builds" element={<MinhasBuildsView />} />
          
          <Route path="/admin/*" element={<AdminRoute />} />
        </Routes>
      </main>
    </>
  )
}

export default App;