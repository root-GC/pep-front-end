import React, { useEffect, useState } from "react";
import styles from "./css/Dashboard.module.css";
import {
  createUser,
  desativarUser,
  ativarUser,
  createCurso,
  getLogs,
  getUsers,
  updateUser,
  getCursos,
  updateCurso,
  deleteCurso,
  ativarCurso,
  desativarCurso,
  getActiveUsers,
} from "../../services/adminService.js";
import api from "../../api/api.js";                     // ← adicionado
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";       // ← adicionado

const DashboardAdmin = () => {
  const navigate = useNavigate();                     // ← adicionado

  // ========== Navigation ==========
  const [activeMenu, setActiveMenu] = useState("users");

  // ========== Users State ==========
  const [users, setUsers] = useState([]);
  const [nomeChefe, setNomeChefe] = useState("");
  const [emailChefe, setEmailChefe] = useState("");
  const [passwordChefe, setPasswordChefe] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editUserData, setEditUserData] = useState({ name: "", email: "" });

  // ========== Courses State ==========
  const [cursos, setCursos] = useState([]);
  const [cursoForm, setCursoForm] = useState({
    titulo: "",
    instituicao: "",
    duracao: "",
    objetivos: "",
  });
  const [editingCurso, setEditingCurso] = useState(null);
  const [editCursoData, setEditCursoData] = useState({
    titulo: "",
    instituicao: "",
    duracao: "",
    objetivos: "",
  });

  // ========== Logs State ==========
  const [logs, setLogs] = useState([]);

  // ========== Active Sessions State ==========
  const [activeUsers, setActiveUsers] = useState([]);

  // ========== UI Helpers ==========
  const [searchTerm, setSearchTerm] = useState("");

  // ========== Data Fetching ==========
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error("Erro ao carregar utilizadores");
      console.error(err);
    }
  };

  const fetchCursos = async () => {
    try {
      const res = await getCursos();
      setCursos(res.data);
    } catch (err) {
      toast.error("Erro ao carregar cursos");
      console.error(err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await getLogs();
      setLogs(res.data);
    } catch (err) {
      toast.error("Erro ao carregar logs");
      console.error(err);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const res = await getActiveUsers();
      setActiveUsers(res.data);
    } catch (err) {
      toast.error("Erro ao carregar sessões ativas");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeMenu === "cursos") fetchCursos();
    if (activeMenu === "logs") fetchLogs();
    if (activeMenu === "activeSessions") fetchActiveUsers();
  }, [activeMenu]);

  // ========== User Operations ==========
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
      await fetchUsers();
      setNomeChefe("");
      setEmailChefe("");
      setPasswordChefe("");
      setConfirmarPassword("");
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Erro ao registar chefe de repartição");
    }
  };

  const handleDesativarUser = async (id) => {
    try {
      await desativarUser(id);
      toast.info("Utilizador suspenso");
      await fetchUsers();
    } catch (err) {
      toast.error("Erro ao suspender utilizador");
    }
  };

  const handleAtivarUser = async (id) => {
    try {
      await ativarUser(id);
      toast.success("Utilizador reativado");
      await fetchUsers();
    } catch (err) {
      toast.error("Erro ao reativar utilizador");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditUserData({ name: user.name, email: user.email });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.id, editUserData);
      toast.success("Utilizador actualizado");
      setEditingUser(null);
      await fetchUsers();
    } catch (err) {
      toast.error("Erro ao actualizar utilizador");
    }
  };

  // ========== Course Operations ==========
  const handleCreateCurso = async (e) => {
    e.preventDefault();
    try {
      await createCurso(cursoForm);
      toast.success("Curso criado com sucesso!");
      setCursoForm({ titulo: "", instituicao: "", duracao: "", objetivos: "" });
      await fetchCursos();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar curso");
    }
  };

  const handleEditCurso = (curso) => {
    setEditingCurso(curso);
    setEditCursoData({
      titulo: curso.titulo,
      instituicao: curso.instituicao,
      duracao: curso.duracao,
      objetivos: curso.objetivos,
    });
  };

  const handleUpdateCurso = async (e) => {
    e.preventDefault();
    try {
      await updateCurso(editingCurso.id, editCursoData);
      toast.success("Curso actualizado");
      setEditingCurso(null);
      await fetchCursos();
    } catch (err) {
      toast.error("Erro ao actualizar curso");
    }
  };

  const handleDeleteCurso = async (id) => {
    if (!window.confirm("Tem a certeza que pretende eliminar este curso?")) return;
    try {
      await deleteCurso(id);
      toast.success("Curso eliminado");
      await fetchCursos();
    } catch (err) {
      toast.error("Erro ao eliminar curso");
    }
  };

  const handleAtivarCurso = async (id) => {
    try {
      await ativarCurso(id);
      toast.success("Curso activado");
      await fetchCursos();
    } catch (err) {
      toast.error("Erro ao activar curso");
    }
  };

  const handleDesativarCurso = async (id) => {
    try {
      await desativarCurso(id);
      toast.info("Curso desactivado");
      await fetchCursos();
    } catch (err) {
      toast.error("Erro ao desactivar curso");
    }
  };

  // ========== Filter Helpers ==========
  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCursos = cursos.filter((curso) =>
    `${curso.titulo} ${curso.instituicao}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredLogs = logs.filter((log) =>
    JSON.stringify(log).toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredActiveUsers = activeUsers.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========== Logout ==========
  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.warn("Falha ao comunicar logout com servidor", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // ========== Render Sections ==========
  const renderUsersSection = () => (
    <>
      <div className={styles.welcomeSection}>
        <div>
          <h2 className={styles.pageTitle}>Gestão de Utilizadores</h2>
          <p className={styles.pageSubtitle}>
            Gerir chefs de repartição e outros utilizadores do sistema.
          </p>
        </div>
      </div>

      <div className={styles.columns}>
        {/* Users Table */}
        <div className={styles.tableColumn}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Lista de Utilizadores</h3>
            <select className={styles.filterSelect} defaultValue="todos">
              <option value="todos">Todos</option>
              <option value="ativos">Ativos</option>
              <option value="inativos">Inativos</option>
            </select>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Função</th>
                  <th>Status</th>
                  <th className={styles.textRight}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
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
                    <td>{user.role === "CHEFE_REPARTICAO" ? "Chefe de Repartição" : user.role}</td>
                    <td>
                      {user.ativo ? (
                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                          Ativo
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
                          onClick={() => handleEditUser(user)}
                          title="Editar"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        {user.ativo ? (
                          <button
                            className={styles.iconBtn}
                            onClick={() => handleDesativarUser(user.id)}
                            title="Suspender"
                          >
                            <span className="material-symbols-outlined">block</span>
                          </button>
                        ) : (
                          <button
                            className={styles.iconBtn}
                            onClick={() => handleAtivarUser(user.id)}
                            title="Reativar"
                          >
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>
                Mostrando {filteredUsers.length} de {users.length} registos
              </span>
            </div>
          </div>
        </div>

        {/* Register Chefe Form */}
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
          <div className={styles.infoNote}>
            <span className="material-symbols-outlined">info</span>
            <p className={styles.infoText}>
              Nota: Novos chefes de repartição terão acesso imediato ao sistema após registo.
            </p>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className={styles.modalOverlay} onClick={() => setEditingUser(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Editar Utilizador</h3>
            <form onSubmit={handleUpdateUser}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={editUserData.name}
                  onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input
                  type="email"
                  className={styles.formInput}
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  required
                />
              </div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setEditingUser(null)} className={styles.cancelBtn}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  const renderCoursesSection = () => (
    <>
      <div className={styles.welcomeSection}>
        <div>
          <h2 className={styles.pageTitle}>Gestão de Cursos</h2>
          <p className={styles.pageSubtitle}>
            Criar, editar, activar e desactivar planos de estágio.
          </p>
        </div>
      </div>

      <div className={styles.columns}>
        {/* Courses Table */}
        <div className={styles.tableColumn}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Lista de Cursos</h3>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Instituição</th>
                  <th>Duração</th>
                  <th>Status</th>
                  <th className={styles.textRight}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCursos.map((curso) => (
                  <tr key={curso.id}>
                    <td>{curso.titulo}</td>
                    <td>{curso.instituicao}</td>
                    <td>{curso.duracao}</td>
                    <td>
                      {curso.ativo ? (
                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>Ativo</span>
                      ) : (
                        <span className={`${styles.statusBadge} ${styles.statusInactive}`}>Inativo</span>
                      )}
                    </td>
                    <td className={styles.textRight}>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.iconBtn}
                          onClick={() => handleEditCurso(curso)}
                          title="Editar"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          className={styles.iconBtn}
                          onClick={() => handleDeleteCurso(curso.id)}
                          title="Eliminar"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                        {curso.ativo ? (
                          <button
                            className={styles.iconBtn}
                            onClick={() => handleDesativarCurso(curso.id)}
                            title="Desactivar"
                          >
                            <span className="material-symbols-outlined">block</span>
                          </button>
                        ) : (
                          <button
                            className={styles.iconBtn}
                            onClick={() => handleAtivarCurso(curso.id)}
                            title="Activar"
                          >
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>
                Mostrando {filteredCursos.length} de {cursos.length} cursos
              </span>
            </div>
          </div>
        </div>

        {/* Create Course Form */}
        <div className={styles.formColumn}>
          <h3 className={styles.formSectionTitle}>Criar Novo Curso</h3>
          <div className={styles.formCard}>
            <form className={styles.form} onSubmit={handleCreateCurso}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Título</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={cursoForm.titulo}
                  onChange={(e) => setCursoForm({ ...cursoForm, titulo: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Instituição</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={cursoForm.instituicao}
                  onChange={(e) => setCursoForm({ ...cursoForm, instituicao: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Duração (meses)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={cursoForm.duracao}
                  onChange={(e) => setCursoForm({ ...cursoForm, duracao: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Objectivos</label>
                <textarea
                  className={styles.formInput}
                  rows="3"
                  value={cursoForm.objetivos}
                  onChange={(e) => setCursoForm({ ...cursoForm, objetivos: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className={styles.submitBtn}>Criar Curso</button>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Course Modal */}
      {editingCurso && (
        <div className={styles.modalOverlay} onClick={() => setEditingCurso(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Editar Curso</h3>
            <form onSubmit={handleUpdateCurso}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Título</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={editCursoData.titulo}
                  onChange={(e) => setEditCursoData({ ...editCursoData, titulo: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Instituição</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={editCursoData.instituicao}
                  onChange={(e) => setEditCursoData({ ...editCursoData, instituicao: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Duração (meses)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={editCursoData.duracao}
                  onChange={(e) => setEditCursoData({ ...editCursoData, duracao: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Objectivos</label>
                <textarea
                  className={styles.formInput}
                  rows="3"
                  value={editCursoData.objetivos}
                  onChange={(e) => setEditCursoData({ ...editCursoData, objetivos: e.target.value })}
                  required
                />
              </div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setEditingCurso(null)} className={styles.cancelBtn}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  const renderLogsSection = () => (
    <>
      <div className={styles.welcomeSection}>
        <div>
          <h2 className={styles.pageTitle}>Logs de Actividade</h2>
          <p className={styles.pageSubtitle}>
            Histórico de acções no sistema.
          </p>
        </div>
      </div>
      <div className={styles.tableColumn}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Utilizador</th>
                <th>Acção</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={idx}>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>{log.user?.name || "Sistema"}</td>
                  <td>{log.acao}</td>
                  <td>{log.detalhes}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>Nenhum log encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Mostrando {filteredLogs.length} de {logs.length} logs
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const renderActiveSessionsSection = () => (
    <>
      <div className={styles.welcomeSection}>
        <div>
          <h2 className={styles.pageTitle}>Sessões Activas</h2>
          <p className={styles.pageSubtitle}>
            Utilizadores actualmente online e últimos acessos.
          </p>
        </div>
      </div>
      <div className={styles.tableColumn}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Último Acesso</th>
                <th>IP</th>
                <th>Possível Abuso</th>
              </tr>
            </thead>
            <tbody>
              {filteredActiveUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.last_login ? new Date(user.last_login).toLocaleString() : "N/A"}</td>
                  <td>{user.last_ip || "N/A"}</td>
                  <td>
                    {user.failed_attempts > 3 ? (
                      <span className={styles.abuseWarning}>Possível tentativa de abuso</span>
                    ) : (
                      "Normal"
                    )}
                  </td>
                </tr>
              ))}
              {filteredActiveUsers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>Nenhuma sessão activa encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Mostrando {filteredActiveUsers.length} de {activeUsers.length} sessões
            </span>
          </div>
        </div>
      </div>
    </>
  );

  // ========== Main Render ==========
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
            <a
              href="#"
              className={`${styles.navLink} ${activeMenu === "users" ? styles.navLinkActive : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu("users"); }}
            >
              <span className="material-symbols-outlined">group</span>
              <span>Utilizadores</span>
            </a>
            <a
              href="#"
              className={`${styles.navLink} ${activeMenu === "cursos" ? styles.navLinkActive : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu("cursos"); }}
            >
              <span className="material-symbols-outlined">class</span>
              <span>Cursos</span>
            </a>
            <a
              href="#"
              className={`${styles.navLink} ${activeMenu === "logs" ? styles.navLinkActive : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu("logs"); }}
            >
              <span className="material-symbols-outlined">history_edu</span>
              <span>Logs de Actividade</span>
            </a>
            <a
              href="#"
              className={`${styles.navLink} ${activeMenu === "activeSessions" ? styles.navLinkActive : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu("activeSessions"); }}
            >
              <span className="material-symbols-outlined">devices</span>
              <span>Sessões Activas</span>
            </a>
          </nav>

          <div className={styles.systemStatus}>
            <p className={styles.statusTitle}>Status do Sistema</p>
            <div className={styles.statusIndicator}>
              <span className={styles.statusDot}></span>
              <p className={styles.statusText}>Ambiente Online</p>
            </div>
          </div>

          {/* Botão Sair */}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            <span>Sair</span>
          </button>
        </aside>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Header with Search */}
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.searchWrapper}>
                <span className="material-symbols-outlined">search</span>
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Content Area */}
          <main className={styles.content}>
            {activeMenu === "users" && renderUsersSection()}
            {activeMenu === "cursos" && renderCoursesSection()}
            {activeMenu === "logs" && renderLogsSection()}
            {activeMenu === "activeSessions" && renderActiveSessionsSection()}
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