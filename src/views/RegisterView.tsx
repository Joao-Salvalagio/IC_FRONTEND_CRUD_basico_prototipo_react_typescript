import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Importa nosso serviço de API
import { useAuth } from '../context/AuthContext';
import '../styles/AuthForm.css'; // Reutiliza o mesmo CSS do Login
import { AxiosError } from 'axios'; // Importa o tipo de erro do Axios

function RegisterView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Para desabilitar o botão

  const auth = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      // --- ETAPA 1: REGISTRO ---
      await api.post('/api/auth/register', {
        name: name,
        email: email,
        password: password
        // Não enviamos "cargo" ou "funcao", o backend cuida disso
      });

      setSuccessMessage("Usuário registrado com sucesso! Fazendo login...");

      // --- ETAPA 2: LOGIN AUTOMÁTICO ---
      // Espera um pouco para o usuário ver a mensagem de sucesso
      setTimeout(async () => {
        try {
          const loginResponse = await api.post('/api/auth/login', {
            email: email,
            password: password
          });
          
          if (loginResponse.data && loginResponse.data.token) {
            auth.login(loginResponse.data.token);
            navigate('/montar-pc'); // Redireciona para o questionário
          } else {
            // Se o login automático falhar (não deve acontecer, mas por segurança)
            navigate('/login');
          }
        } catch (loginError) {
          console.error('Erro no login automático:', loginError);
          navigate('/login');
        }
      }, 1500); // Espera 1.5 segundos

    } catch (error) {
      console.error('Falha no registro:', error);
      
      // Verifica se é um erro do Axios e se o status é 409 (Email duplicado)
      if (error instanceof AxiosError && error.response && error.response.status === 409) {
        // Lê a mensagem de erro que o nosso backend enviou
        setErrorMessage(error.response.data.message || 'Este e-mail já está em uso.');
      } else {
        setErrorMessage('Ocorreu um erro no registro. Tente novamente.');
      }
      setIsLoading(false); // Reabilita o botão em caso de erro
    }
    // Não definimos setIsLoading(false) no sucesso, pois navegamos para outra página
  };

  return (
    <main className="login-view">
      <div className="login-card">
        <h2>Criar Conta</h2>
        <p>Junte-se ao Ideal-Computer e salve suas builds.</p>
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input 
              id="name" 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
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
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        
        <div className="register-link">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </div>
      </div>
    </main>
  );
}

export default RegisterView;