import React, { useState } from 'react';
import api from '../../api/api.js';
import styles from './css/Login.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';

// Mapeamento de roles (minúsculas, conforme seeder) para as rotas
const dashboardByRole: Record<string, string> = {
  admin: '/admin/dashboard',
  coordenador: '/coordenador/dashboard',
  estudante: '/estagiario/dashboard',          // ← antes era "estagiario"
  chefe_repartição: '/chefe/dashboard',        // ← antes era "chefe_reparticao"
  supervisor: '/supervisor/dashboard',
  tutor: '/tutor/dashboard',
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser, setRoles } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      // Salva no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      const roleNames = user.roles.map((r: any) => r.name);
      localStorage.setItem('roles', JSON.stringify(roleNames));

      // Atualiza o contexto
      setUser(user);
      setRoles(roleNames);

      // Define o destino de acordo com a primeira role
      const role = roleNames[0];
      const target = dashboardByRole[role] || '/login';
      navigate(target);
    } catch (error: any) {
      alert('Credenciais inválidas');
      console.error('Erro no login', error);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logo}>
            <span className="material-symbols-outlined">school</span>
          </div>
          <h1 className={styles.appTitle}>SGP-EP</h1>
          <p className={styles.appSubtitle}>
            Sistema de Gestão de Práticas e Estágios Profissionalizantes
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h2 className={styles.formTitle}>Aceda a sua conta</h2>

          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <div className={styles.inputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>mail</span>
              <input
                type="email"
                id="email"
                placeholder="exemplo@pep.com"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <div className={styles.inputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
              <input
                type="password"
                id="password"
                placeholder="Digite sua senha"
                className={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className={styles.loginButton}>
            <span>Entrar</span>
            <span className="material-symbols-outlined">login</span>
          </button>
        </form>

        <div className={styles.loginFooter}>
          <Link to="/forgot-password" className={styles.forgotLink}>
            Esqueceu sua senha?
          </Link>
          <div className={styles.divider}></div>
          <p className={styles.signupText}>
            Ainda não tem acesso?
            <Link to="/solicitar-acesso" className={styles.signupLink}>
              Solicite aqui
            </Link>
          </p>
        </div>
      </div>

      <p className={styles.copyright}>
        © 2026 PEP Estágios • Programa de Estágios e Práticas Profissionais
      </p>
    </div>
  );
};

export default Login;