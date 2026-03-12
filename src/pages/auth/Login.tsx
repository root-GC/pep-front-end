import React, { useState } from 'react';
import api from '../../api/api.js';
import './css/Login.css';
import { useNavigate } from "react-router-dom";


const dashboardByRole: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  COORDENADOR: "/dashboards/coordenador",
  ESTAGIARIO: "/dashboards/estagiario",
  CHEFE_REPARTICAO: "/chefe/dashboard",
};

const Login: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("roles", JSON.stringify(user.roles.map((r: any) => r.name)));

      // Redireciona para o dashboard baseado na primeira role
      const role = user.roles[0]?.name;
      const target = dashboardByRole[role] || "/login";
      navigate(target);

    } catch (error: any) {
      alert("Credenciais inválidas");
      console.error("Erro no login", error);
    }
  };


  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <div className="logo">
            <span className="material-symbols-outlined">school</span>
          </div>

          <h1 className="app-title">SGP-EP</h1>

          <p className="app-subtitle">
            Sistema de Gestão de Práticas e Estágios Profissionalizantes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          <h2 className="form-title">Aceda a sua conta</h2>

          <div className="input-group">
            <label htmlFor="email">E-mail</label>

            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">mail</span>

              <input
                type="email"
                id="email"
                placeholder="exemplo@pep.com"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>
          </div>

          <div className="input-group">

            <label htmlFor="password">Senha</label>

            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">lock</span>

              <input
                type="password"
                id="password"
                placeholder="Digite sua senha"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>
          </div>

          <button type="submit" className="login-button">
            <span>Entrar</span>
            <span className="material-symbols-outlined">login</span>
          </button>

        </form>

        <div className="login-footer">
          <a href="#" className="forgot-link">Esqueceu sua senha?</a>

          <div className="divider"></div>

          <p className="signup-text">
            Ainda não tem acesso? 
            <a href="#" className="signup-link">Solicite aqui</a>
          </p>
        </div>

      </div>

      <p className="copyright">
        © 2024 PEP - Sistema de Gestão de Estágios.
      </p>

    </div>
  );
};

export default Login;