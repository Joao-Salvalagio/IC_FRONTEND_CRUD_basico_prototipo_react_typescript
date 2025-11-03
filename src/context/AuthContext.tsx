import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. A "forma" dos dados que embutimos no token JWT
interface DecodedToken {
  sub: string; // email
  nome: string;
  cargo: string;
  funcao: 'USUARIO' | 'ADMINISTRADOR';
}

// 2. A "forma" do nosso objeto de usuário
interface User {
  email: string;
  nome: string;
  cargo: string;
  funcao: 'USUARIO' | 'ADMINISTRADOR';
}

// 3. O que o nosso "Armazém" (Context) vai fornecer
interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 5. O "Provedor" (O componente que "abraça" a aplicação)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwtToken'));
  const [user, setUser] = useState<User | null>(null);

  // Executa sempre que o 'token' mudar
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        // TODO: Adicionar verificação de expiração do token (decoded.exp)
        
        setUser({
          email: decoded.sub,
          nome: decoded.nome,
          cargo: decoded.cargo,
          funcao: decoded.funcao,
        });
      } catch (error) {
        console.error("Token inválido ou expirado, limpando...", error);
        localStorage.removeItem('jwtToken');
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('jwtToken', newToken);
    setToken(newToken); // Atualiza o estado, o useEffect fará o resto
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
  };

  const isLoggedIn = !!token;
  const isAdmin = user?.funcao === 'ADMINISTRADOR';

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6. O "Hook" (A forma fácil de usar o armazém em outros componentes)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
