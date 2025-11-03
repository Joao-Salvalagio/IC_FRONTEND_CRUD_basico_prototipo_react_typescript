import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Corrigido para 'api' minúsculo
import { useAuth } from '../context/AuthContext';
import '../styles/AuthForm.css'; // ATUALIZADO: Importa o novo CSS genérico
import { jwtDecode } from 'jwt-decode'; // Importado no topo

// Interface para garantir a tipagem do token decodificado
interface DecodedToken {
  sub: string;
  nome: string;
  cargo: string;
  funcao: 'USUARIO' | 'ADMINISTRADOR';
}

function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email: email,
        password: password
      });

      if (response.data && response.data.token) {
        auth.login(response.data.token);
        
        try {
          // Decodifica o token para redirecionamento inteligente
          const decoded = jwtDecode<DecodedToken>(response.data.token);
          if (decoded.funcao === 'ADMINISTRADOR') {
            navigate('/admin'); // Redireciona admin para o painel
          } else {
            navigate('/montar-pc'); // Redireciona usuário comum
          }
        } catch {
          navigate('/montar-pc'); // Fallback
        }
      }

    } catch (error) {
      console.error('Falha no login:', error);
      setErrorMessage('Email ou senha inválidos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-view">
      <div className="login-card">
        <h2>Login</h2>
        <p>Acesse sua conta para salvar suas builds.</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="register-link">
          Não tem uma conta? <Link to="/register">Registre-se</Link>
        </div>
      </div>
    </main>
  );
}

export default LoginView;