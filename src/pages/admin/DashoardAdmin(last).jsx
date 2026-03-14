import React, { useEffect, useState } from "react";
import styles from "./css/Dashboard.module.css";
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

  // Criação do Chefe de Repartição
  const [nomeChefe, setNomeChefe] = useState("");
  const [emailChefe, setEmailChefe] = useState("");
  const [passwordChefe, setPasswordChefe] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  // Buscar Users
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

  // Buscar users
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

  // Criar usuário (exemplo dummy)
  const handleCreateUser = async () => {
    try {
      await createUser({
        name: "Novo Chefe",
        email: "chefe@email.com",
        password: "12345678",
        role: "CHEFE",
      });
      toast.success("Utilizador criado com sucesso!");
      await fetchUsers(); // atualiza tabela
    } catch (err) {
      toast.error("Erro ao criar utilizador!");
      console.error(err);
    }
  };

  // Registar Chefe de Repartição
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
      await fetchUsers(); // atualiza a tabela
      setNomeChefe("");
      setEmailChefe("");
      setPasswordChefe("");
      setConfirmarPassword("");
    } catch (err) {
      console.log(err.response?.data);
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
    <div className={styles.dashboard}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={styles.flexContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <h1 className={styles.logoTitle}>Sistema PEP</h1>
              <p className={styles.logoSubtitle}>Administrador</p>
            </div>
          </div>

          <nav className={styles.nav}>
            <p className={styles.navLabel}>Menu Principal</p>
            <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>
              <span className="material-symbols-outlined">group</span>
              <span>Utilizadores</span>
            </a>
            <a href="#" className={styles.navLink}>
              <span className="material-symbols-outlined">class</span>
              <span>Cursos</span>
            </a>
            <a href="#" className={styles.navLink}>
              <span className="material-symbols-outlined">corporate_fare</span>
              <span>Instituições</span>
            </a>
            <a href="#" className={styles.navLink}>
              <span className="material-symbols-outlined">history_edu</span>
              <span>Logs de Atividade</span>
            </a>
            <a href="#" className={styles.navLink}>
              <span className="material-symbols-outlined">badge</span>
              <span>Orientadores</span>
            </a>
          </nav>

          <div className={styles.systemStatus}>
            <p className={styles.statusTitle}>Status do Sistema</p>
            <div className={styles.statusIndicator}>
              <span className={styles.statusDot}></span>
              <p className={styles.statusText}>Ambiente Online</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.searchWrapper}>
                <span className="material-symbols-outlined">search</span>
                <input
                  type="text"
                  placeholder="Pesquisar utilizador ou log..."
                  className={styles.searchInput}
                />
              </div>
            </div>
            <div className={styles.headerRight}>
              <button className={styles.notificationBtn}>
                <span className="material-symbols-outlined">notifications</span>
                <span className={styles.notificationBadge}></span>
              </button>
              <div className={styles.divider}></div>
              <div className={styles.userInfo}>
                <div className={styles.userText}>
                  <p className={styles.userName}>Admin Central</p>
                  <p className={styles.userRole}>Gestão de Sistema</p>
                </div>
                <div className={styles.avatar}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw2sg3X6j2RP2zeyQnj4NzkQHF0aiIWxGfo1bK44nIIdqBIITiXnQohHcGRzHZjI72VTWQCtZfFyt5CYGg54FIctgJUmAbNIyfU3APPCa10WHca0QUjklD5S01DCWmuh_AGVw7Hot6WJ1gYLIbGefUi6wAmQ8Bx4elYw3CrsFTr50bgm-wAQ3-0x0LhGOtM5x_nFzYZ79xXylIAk5z2YgWpzK0i6eN0qd3oO28IidT4_Hvr3uGOkD00kJRaOzU9PQAz-RWaCUH5HU"
                    alt="Avatar"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className={styles.content}>
            {/* Welcome Section */}
            <div className={styles.welcomeSection}>
              <div>
                <h2 className={styles.pageTitle}>Dashboard de Administração</h2>
                <p className={styles.pageSubtitle}>
                  Bem-vindo ao painel central de controle do Sistema PEP.
                </p>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.exportBtn}>
                  <span className="material-symbols-outlined">file_export</span>
                  Exportar Relatórios
                </button>
                <button
                  className={styles.newUserBtn}
                  onClick={handleCreateUser}
                >
                  <span className="material-symbols-outlined">person_add</span>
                  Novo Utilizador
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statLabel}>Total Estagiários</span>
                  <span className="material-symbols-outlined">person</span>
                </div>
                <p className={styles.statValue}>1,250</p>
                <p className={styles.statTrend}>+12% este mês</p>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statLabel}>Cursos Ativos</span>
                  <span className="material-symbols-outlined">library_books</span>
                </div>
                <p className={styles.statValue}>45</p>
                <p className={styles.statTrend}>Estável</p>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statLabel}>Escolas Parceiras</span>
                  <span className="material-symbols-outlined">school</span>
                </div>
                <p className={styles.statValue}>12</p>
                <p className={styles.statTrend}>Instituições Ativas</p>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statLabel}>Logs Diários</span>
                  <span className="material-symbols-outlined">monitoring</span>
                </div>
                <p className={styles.statValue}>{logs.length}</p>
                <p className={`${styles.statTrend} ${styles.trendPrimary}`}>
                  Atividades hoje
                </p>
              </div>
            </div>

            {/* Two-column layout */}
            <div className={styles.columns}>
              {/* User Table Column */}
              <div className={styles.tableColumn}>
                <div className={styles.tableHeader}>
                  <h3 className={styles.tableTitle}>
                    Gestão de Estagiários e Utilizadores
                  </h3>
                  <select className={styles.filterSelect}>
                    <option>Filtrar por Status</option>
                    <option>Em Estágio</option>
                    <option>Concluído</option>
                    <option>Suspenso</option>
                  </select>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Email Acadêmico</th>
                        <th>Status</th>
                        <th className={styles.textRight}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className={styles.userCell}>
                              <div className={styles.userInitials}>
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            {user.ativo ? (
                              <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                                Em Estágio
                              </span>
                            ) : (
                              <span className={`${styles.statusBadge} ${styles.statusInactive}`}>
                                Suspenso
                              </span>
                            )}
                          </td>
                          <td className={styles.textRight}>
                            <div className={styles.actionButtons}>
                              <button
                                className={styles.iconBtn}
                                onClick={() => handleDesativarUser(user.id)}
                                title="Suspender"
                              >
                                <span className="material-symbols-outlined">block</span>
                              </button>
                              <button
                                className={styles.iconBtn}
                                onClick={() => handleAtivarUser(user.id)}
                                title="Reativar"
                              >
                                <span className="material-symbols-outlined">check_circle</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className={styles.pagination}>
                    <span className={styles.paginationInfo}>
                      Mostrando {users.length} de {users.length} registros acadêmicos
                    </span>
                    <div className={styles.paginationControls}>
                      <button className={styles.paginationBtn} disabled>
                        Anterior
                      </button>
                      <button className={`${styles.paginationBtn} ${styles.paginationBtnActive}`}>
                        1
                      </button>
                      <button className={styles.paginationBtn}>Próximo</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Column - Registar Chefe de Repartição */}
              <div className={styles.formColumn}>
                <h3 className={styles.formSectionTitle}>Registar Chefe de Repartição</h3>
                <div className={styles.formCard}>
                  <form className={styles.form} onSubmit={handleCreateChefe}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Nome Completo</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={nomeChefe}
                        onChange={(e) => setNomeChefe(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Email Institucional</label>
                      <input
                        type="email"
                        className={styles.formInput}
                        value={emailChefe}
                        onChange={(e) => setEmailChefe(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Palavra-passe</label>
                      <input
                        type="password"
                        className={styles.formInput}
                        value={passwordChefe}
                        onChange={(e) => setPasswordChefe(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Confirmar Palavra-passe</label>
                      <input
                        type="password"
                        className={styles.formInput}
                        value={confirmarPassword}
                        onChange={(e) => setConfirmarPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                      Registar Chefe de Repartição
                    </button>
                  </form>
                </div>

                {/* Nota informativa */}
                <div className={styles.infoNote}>
                  <span className="material-symbols-outlined">info</span>
                  <p className={styles.infoText}>
                    Nota: Novos chefes de repartição terão acesso imediato ao sistema após registo.
                  </p>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className={styles.footer}>
            <p>PEP - Sistema de Gestão de Estágios Profissionalizantes © 2023</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;