import React, { useEffect, useState } from "react";
import "./css/Dashboard.css";
import {
  createUser,
  desativarUser,
  ativarUser,
  createCurso,
  getLogs,
  getUsers,
} from "../../services/adminService";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardAdmin = () => {
  // Estados
  const [logs, setLogs] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [duracao, setDuracao] = useState("");
  const [objetivos, setObjetivos] = useState("");

  //CRIACAO DO CHEFE DA REPATICAO
  const [nomeChefe, setNomeChefe] = useState("");
  const [emailChefe, setEmailChefe] = useState("");
  const [passwordChefe, setPasswordChefe] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  //Buscar Users 
  const [users, setUsers] = useState([]);




  // Buscar logs ao abrir o Dashboard
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getLogs();
        setLogs(res.data);
      } catch (err) {
        console.error("Erro ao carregar logs", err);
        toast.error("Erro ao carregar logs");
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  //Buscar users 
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error("Erro ao carregar utilizadores");
      console.error(err);
    }
  };


  // Criar curso
  const handleSubmitCurso = async (e) => {
    e.preventDefault();

    try {
      await createCurso({ titulo, instituicao, duracao, objetivos });

      toast.success("Plano de estágio criado com sucesso!");

      setTitulo("");
      setInstituicao("");
      setDuracao("");
      setObjetivos("");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar plano de estágio");
    }
  };

  // Criar usuário
  const handleCreateUser = async () => {
    try {
      await createUser({
        name: "Novo Chefe",
        email: "chefe@email.com",
        password: "12345678",
        role: "CHEFE",
      });

      toast.success("Utilizador criado com sucesso!");
    } catch (err) {
      toast.error("Erro ao criar utilizador!");
      console.error(err);
    }
  };

  //CHEFE DA REAPTICAO
  const handleCreateChefe = async (e) => {
    e.preventDefault();

    if (passwordChefe !== confirmarPassword) {
      toast.error("As palavras-passe não coincidem");
      return;
    }

    try {
      await createUser({
        name: nomeChefe,
        email: emailChefe,
        password: passwordChefe,
        role: "CHEFE_REPARTICAO",
      });

      toast.success("Chefe de repartição registado com sucesso!");
      await fetchUsers(); // 🔥 atualiza a tabela

      setNomeChefe("");
      setEmailChefe("");
      setPasswordChefe("");
      setConfirmarPassword("");
    } catch (err) {
      console.log(err.response.data);
      toast.error("Erro ao registar chefe de repartição");
    }
  };

  // Suspender usuário
  const handleDesativarUser = async (id) => {
    try {
      await desativarUser(id);
      toast.info("Utilizador suspenso");

      await fetchUsers(); // atualiza tabela
    } catch (err) {
      toast.error("Erro ao suspender utilizador");
    }
  };

  // Reativar usuário
  const handleAtivarUser = async (id) => {
    try {
      await ativarUser(id);
      toast.success("Utilizador reativado");

      await fetchUsers(); // atualiza tabela
    } catch (err) {
      toast.error("Erro ao reativar utilizador");
    }
  };

  return (
    <div className="dashboard">
      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ================= HEADER ================= */}
      <header className="header">
        <div className="header-logo">
          <div className="logo-icon">
            <span className="material-symbols-outlined">school</span>
          </div>
          <h2 className="logo-text">PEP - Gestão de Estágios</h2>
        </div>

        <div className="header-actions">
          <div className="search-bar">
            <span className="material-symbols-outlined search-icon">search</span>
            <input type="text" placeholder="Pesquisar..." className="search-input" />
          </div>

          <div className="action-buttons">
            <button className="icon-button">
              <span className="material-symbols-outlined">notifications</span>
            </button>

            <button className="icon-button">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="main-layout">

        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <p className="nav-section-title">Menu Principal</p>

            <a href="#" className="nav-item active">
              <span className="material-symbols-outlined">group</span>
              Utilizadores
            </a>

            <a href="#" className="nav-item">
              <span className="material-symbols-outlined">class</span>
              Cursos
            </a>

            <a href="#" className="nav-item">
              <span className="material-symbols-outlined">corporate_fare</span>
              Instituições de Ensino
            </a>

            <a href="#" className="nav-item">
              <span className="material-symbols-outlined">history_edu</span>
              Logs de Atividade
            </a>

            <a href="#" className="nav-item">
              <span className="material-symbols-outlined">badge</span>
              Orientadores
            </a>
          </nav>

          <div className="status-card">
            <p className="status-title">Status da Plataforma</p>
            <div className="status-indicator">
              <span className="status-dot"></span>
              <p className="status-text">Ambiente Online</p>
            </div>
          </div>
        </aside>

        {/* Conteúdo */}
        <main className="content">

          {/* Stats */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="material-symbols-outlined">person</span>
                <span className="stat-label">Total</span>
              </div>
              <p className="stat-value">1,250</p>
              <p className="stat-description">Estagiários Registrados</p>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="material-symbols-outlined">library_books</span>
                <span className="stat-label">Ativos</span>
              </div>
              <p className="stat-value">45</p>
              <p className="stat-description">Cursos de Estágio</p>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="material-symbols-outlined">school</span>
                <span className="stat-label">Escolas</span>
              </div>
              <p className="stat-value">12</p>
              <p className="stat-description">Instituições Ativas</p>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="material-symbols-outlined">monitoring</span>
                <span className="stat-label">Logs</span>
              </div>
              <p className="stat-value">{logs.length}</p>
              <p className="stat-description">Atividades de Hoje</p>
            </div>
          </section>

          {/* Conteúdo */}
          <div className="content-grid">

            {/* Tabela */}
            <section className="table-section">
              <div className="section-header">
                <h3 className="section-title">
                  Gestão de Estagiários e Utilizadores
                </h3>

                <button
                  className="btn btn-primary btn-small"
                  onClick={handleCreateUser}
                >
                  <span className="material-symbols-outlined">person_add</span>
                  Novo Utilizador
                </button>
              </div>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email Acadêmico</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>

                        <td>
                          {user.ativo ? (
                            <span className="badge badge-active">Ativo</span>
                          ) : (
                            <span className="badge badge-inactive">Suspenso</span>
                          )}
                        </td>

                        <td>
                          <button
                            className="btn btn-primary btn-small"
                            onClick={() => handleDesativarUser(user.id)}
                          >
                            Suspender
                          </button>

                          <button
                            className="btn btn-primary btn-small"
                            onClick={() => handleAtivarUser(user.id)}
                          >
                            Reativar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </section>


            {/* Formulário Registar Chefe de Repartição */}
            <section className="form-section">
              <h3 className="section-title">Registar Chefe de Repartição</h3>

              <div className="form-card">
                <form className="form" onSubmit={handleCreateChefe}>

                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input
                      type="text"
                      className="form-input"
                      value={nomeChefe}
                      onChange={(e) => setNomeChefe(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Institucional</label>
                    <input
                      type="email"
                      className="form-input"
                      value={emailChefe}
                      onChange={(e) => setEmailChefe(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Palavra-passe</label>
                    <input
                      type="password"
                      className="form-input"
                      value={passwordChefe}
                      onChange={(e) => setPasswordChefe(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirmar Palavra-passe</label>
                    <input
                      type="password"
                      className="form-input"
                      value={confirmarPassword}
                      onChange={(e) => setConfirmarPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    Registar Chefe de Repartição
                  </button>

                </form>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;