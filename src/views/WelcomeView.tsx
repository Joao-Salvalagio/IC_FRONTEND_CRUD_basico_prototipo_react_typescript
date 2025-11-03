import React from 'react';
import { Link } from 'react-router-dom';

const styles: React.CSSProperties = {
  padding: '4rem 3rem',
  textAlign: 'center',
  maxWidth: '700px',
  margin: '0 auto',
};

const heroActions: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginTop: '2.5rem',
};

function WelcomeView() {
  return (
    <main style={styles}>
      <h1>Monte seu PC dos sonhos</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        Receba recomendações personalizadas de peças para seu computador ideal. Nossa inteligência analisa suas necessidades e orçamento.
      </p>
      <div style={heroActions}>
        <Link to="/montar-pc" className="nav-button primary">Começar (Visitante)</Link>
        <Link to="/login" className="nav-button">Fazer Login</Link>
      </div>
    </main>
  );
}

export default WelcomeView;