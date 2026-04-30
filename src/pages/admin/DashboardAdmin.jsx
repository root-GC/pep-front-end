import React, { useEffect, useState } from "react";
import styles from "./css/Dashboard.module.css";
import {
  createUser,
  desativarUser,
  ativarUser,
  getLogs,
  getUsers,
  updateUser,
  getCursos,
  createCurso,
  updateCurso,
  deleteCurso,
  ativarCurso,
  desativarCurso,
  getActiveUsers,
  getDepartamentos,
  createDepartamento,
  updateDepartamento,
  deleteDepartamento,
  getInstituicoes,
  createInstituicao,
  updateInstituicao,
  approveInstituicao,
  rejectInstituicao,
  suspendInstituicao,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getNotifications,
  markAllNotificationsRead,
} from "../../services/adminService.js";
import api from "../../api/api.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
  const navigate = useNavigate();

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
  const [showUserForm, setShowUserForm] = useState(false);

  // ========== Courses State ==========
  const [cursos, setCursos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [cursoForm, setCursoForm] = useState({
    nome: "",
    descricao: "",
    duracao_anos: "",
    departamento_id: "",
  });
  const [editingCurso, setEditingCurso] = useState(null);
  const [editCursoData, setEditCursoData] = useState({
    nome: "",
    descricao: "",
    duracao_anos: "",
    departamento_id: "",
  });
  const [showCursoForm, setShowCursoForm] = useState(false);

  // ========== Departamentos State ==========
  const [departamentoForm, setDepartamentoForm] = useState({
    nome: "",
    descricao: "",
  });
  const [editingDepartamento, setEditingDepartamento] = useState(null);
  const [editDepartamentoData, setEditDepartamentoData] = useState({
    nome: "",
    descricao: "",
  });
  const [showDepartamentoForm, setShowDepartamentoForm] = useState(false);

  // ========== Instituições State ==========
  const [instituicoes, setInstituicoes] = useState([]);
  const [instituicaoForm, setInstituicaoForm] = useState({
    nome: "",
    nuit: "",
    endereco: "",
    telefone: "",
    email: "",
    ponto_focal_nome: "",
    ponto_focal_contacto: "",
    status: "pendente",
    validade_parceria: "",
  });
  const [editingInstituicao, setEditingInstituicao] = useState(null);
  const [editInstituicaoData, setEditInstituicaoData] = useState({});
  const [showInstituicaoForm, setShowInstituicaoForm] = useState(false);

  // ========== Roles State ==========
  const [roles, setRoles] = useState([]);
  const [roleForm, setRoleForm] = useState({ name: "", guard_name: "web" });
  const [editingRole, setEditingRole] = useState(null);
  const [editRoleData, setEditRoleData] = useState({ name: "", guard_name: "web" });
  const [showRoleForm, setShowRoleForm] = useState(false);

  // ========== Notifications State ==========
  const [notifications, setNotifications] = useState([]);

  // ========== Logs State ==========
  const [logs, setLogs] = useState([]);

  // ========== Active Sessions State ==========
  const [activeUsers, setActiveUsers] = useState([]);

  // ========== UI Helpers ==========
  const [searchTerm, setSearchTerm] = useState("");

  // ========== Data Fetching (normalizados para array) ==========
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      const data = res.data?.data ?? res.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Erro ao carregar utilizadores");
      setUsers([]);
    }
  };

  const fetchCursos = async () => {
    try {
      const res = await getCursos();
      const data = res.data?.data ?? res.data;
      setCursos(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Erro ao carregar cursos");
      setCursos([]);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const res = await getDepartamentos();
      const data = res.data?.data ?? res.data;
      setDepartamentos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Departamentos indisponíveis");
      setDepartamentos([]);
    }
  };

  const fetchInstituicoes = async () => {
    try {
      const res = await getInstituicoes();
      const data = res.data?.data ?? res.data;
      setInstituicoes(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Erro ao carregar instituições");
      setInstituicoes([]);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      const data = res.data?.data ?? res.data;
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Erro ao carregar papéis");
      setRoles([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      const data = res.data?.data ?? res.data;
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Erro ao carregar notificações");
      setNotifications([]);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await getLogs();
      const data = res.data?.data ?? res.data;
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Erro ao carregar logs");
      setLogs([]);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const res = await getActiveUsers();
      const data = res.data?.data ?? res.data;
      setActiveUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Erro ao carregar sessões ativas");
      setActiveUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartamentos();
  }, []);

  useEffect(() => {
    if (activeMenu === "cursos") fetchCursos();
    if (activeMenu === "departamentos") fetchDepartamentos();
    if (activeMenu === "instituicoes") fetchInstituicoes();
    if (activeMenu === "roles") fetchRoles();
    if (activeMenu === "notifications") fetchNotifications();
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
        role: "chefe_repartição",
      });
      toast.success("Chefe de repartição registado com sucesso!");
      await fetchUsers();
      setNomeChefe("");
      setEmailChefe("");
      setPasswordChefe("");
      setConfirmarPassword("");
      setShowUserForm(false);
    } catch (err) {
      toast.error("Erro ao registar chefe de repartição");
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

  // ========== Course Operations ==========
  const handleCreateCurso = async (e) => {
    e.preventDefault();
    try {
      await createCurso(cursoForm);
      toast.success("Curso criado com sucesso!");
      setCursoForm({ nome: "", descricao: "", duracao_anos: "", departamento_id: "" });
      setShowCursoForm(false);
      await fetchCursos();
    } catch (err) {
      toast.error("Erro ao criar curso");
    }
  };

  const handleEditCurso = (curso) => {
    setEditingCurso(curso);
    setEditCursoData({
      nome: curso.nome,
      descricao: curso.descricao,
      duracao_anos: curso.duracao_anos,
      departamento_id: curso.departamento_id || "",
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

  // ========== Departamento Operations ==========
  const handleCreateDepartamento = async (e) => {
    e.preventDefault();
    try {
      await createDepartamento(departamentoForm);
      toast.success("Departamento criado!");
      setDepartamentoForm({ nome: "", descricao: "" });
      setShowDepartamentoForm(false);
      await fetchDepartamentos();
    } catch (err) {
      toast.error("Erro ao criar departamento");
    }
  };

  const handleEditDepartamento = (dep) => {
    setEditingDepartamento(dep);
    setEditDepartamentoData({ nome: dep.nome, descricao: dep.descricao });
  };

  const handleUpdateDepartamento = async (e) => {
    e.preventDefault();
    try {
      await updateDepartamento(editingDepartamento.id, editDepartamentoData);
      toast.success("Departamento actualizado");
      setEditingDepartamento(null);
      await fetchDepartamentos();
    } catch (err) {
      toast.error("Erro ao actualizar departamento");
    }
  };

  const handleDeleteDepartamento = async (id) => {
    if (!window.confirm("Eliminar departamento?")) return;
    try {
      await deleteDepartamento(id);
      toast.success("Departamento eliminado");
      await fetchDepartamentos();
    } catch (err) {
      toast.error("Erro ao eliminar departamento");
    }
  };

  // ========== Instituição Operations ==========
  const handleCreateInstituicao = async (e) => {
    e.preventDefault();
    try {
      await createInstituicao(instituicaoForm);
      toast.success("Instituição criada!");
      setInstituicaoForm({
        nome: "", nuit: "", endereco: "", telefone: "", email: "",
        ponto_focal_nome: "", ponto_focal_contacto: "",
        status: "pendente", validade_parceria: "",
      });
      setShowInstituicaoForm(false);
      await fetchInstituicoes();
    } catch (err) {
      toast.error("Erro ao criar instituição");
    }
  };

  const handleEditInstituicao = (inst) => {
    setEditingInstituicao(inst);
    setEditInstituicaoData({ ...inst });
  };

  const handleUpdateInstituicao = async (e) => {
    e.preventDefault();
    try {
      await updateInstituicao(editingInstituicao.id, editInstituicaoData);
      toast.success("Instituição actualizada");
      setEditingInstituicao(null);
      await fetchInstituicoes();
    } catch (err) {
      toast.error("Erro ao actualizar instituição");
    }
  };

  const handleApproveInstituicao = async (id) => {
    try {
      await approveInstituicao(id);
      toast.success("Instituição aprovada");
      await fetchInstituicoes();
    } catch (err) {
      toast.error("Erro ao aprovar");
    }
  };
  const handleRejectInstituicao = async (id) => {
    try {
      await rejectInstituicao(id);
      toast.info("Instituição rejeitada");
      await fetchInstituicoes();
    } catch (err) {
      toast.error("Erro ao rejeitar");
    }
  };
  const handleSuspendInstituicao = async (id) => {
    try {
      await suspendInstituicao(id);
      toast.info("Instituição suspensa");
      await fetchInstituicoes();
    } catch (err) {
      toast.error("Erro ao suspender");
    }
  };

  // ========== Role Operations ==========
  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      await createRole(roleForm);
      toast.success("Papel criado");
      setRoleForm({ name: "", guard_name: "web" });
      setShowRoleForm(false);
      await fetchRoles();
    } catch (err) {
      toast.error("Erro ao criar papel");
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setEditRoleData({ name: role.name, guard_name: role.guard_name });
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    try {
      await updateRole(editingRole.id, editRoleData);
      toast.success("Papel actualizado");
      setEditingRole(null);
      await fetchRoles();
    } catch (err) {
      toast.error("Erro ao actualizar papel");
    }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm("Eliminar este papel?")) return;
    try {
      await deleteRole(id);
      toast.success("Papel eliminado");
      await fetchRoles();
    } catch (err) {
      toast.error("Erro ao eliminar papel");
    }
  };

  // ========== Notification Operations ==========
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      toast.success("Todas as notificações marcadas como lidas");
      await fetchNotifications();
    } catch (err) {
      toast.error("Erro ao marcar notificações");
    }
  };

  // ========== Filter Helpers ==========
  const term = (searchTerm || "").trim().toLowerCase();

  const filteredUsers = users.filter((u) =>
    `${u.name || ""} ${u.email || ""}`.toLowerCase().includes(term)
  );
  const filteredCursos = cursos.filter((c) =>
    `${c.nome || ""} ${c.descricao || ""}`.toLowerCase().includes(term)
  );
  const filteredDepartamentos = departamentos.filter((d) =>
    (d.nome || "").toLowerCase().includes(term)
  );
  const filteredInstituicoes = instituicoes.filter((i) =>
    `${i.nome || ""} ${i.email || ""}`.toLowerCase().includes(term)
  );
  const filteredRoles = roles.filter((r) =>
    (r.name || "").toLowerCase().includes(term)
  );
  const filteredNotifications = notifications.filter((n) =>
    `${n.titulo || n.data?.titulo || ""} ${n.mensagem || n.data?.mensagem || ""}`
      .toLowerCase()
      .includes(term)
  );
  const filteredLogs = logs.filter((log) =>
    JSON.stringify(log).toLowerCase().includes(term)
  );
  const filteredActiveUsers = activeUsers.filter((u) =>
    `${u.name || ""} ${u.email || ""}`.toLowerCase().includes(term)
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

  // --- USERS ---
  const renderUsersSection = () => (
    <>
      <div className={styles.welcomeSection}>
        <div>
          <h2 className={styles.pageTitle}>Gestão de Utilizadores</h2>
          <p className={styles.pageSubtitle}>Gerir chefs de repartição e outros utilizadores.</p>
        </div>
        <button className={styles.newUserBtn} onClick={() => setShowUserForm(true)}>
          <span className="material-symbols-outlined">person_add</span> Novo Chefe
        </button>
      </div>

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
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center" }}>Nenhum utilizador encontrado</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.userInitials}>{user.name?.charAt(0).toUpperCase()}</div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      {user.roles?.length > 0
                        ? user.roles[0].name === "chefe_repartição" ? "Chefe de Repartição" : user.roles[0].name
                        : "—"}
                    </td>
                    <td>
                      {user.ativo ? (
                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>Ativo</span>
                      ) : (
                        <span className={`${styles.statusBadge} ${styles.statusInactive}`}>Suspenso</span>
                      )}
                    </td>
                    <td className={styles.textRight}>
                      <div className={styles.actionButtons}>
                        <button className={styles.iconBtn} onClick={() => handleEditUser(user)} title="Editar">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        {user.ativo ? (
                          <button className={styles.iconBtn} onClick={() => handleDesativarUser(user.id)} title="Suspender">
                            <span className="material-symbols-outlined">block</span>
                          </button>
                        ) : (
                          <button className={styles.iconBtn} onClick={() => handleAtivarUser(user.id)} title="Reativar">
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>Mostrando {filteredUsers.length} de {users.length} registos</span>
          </div>
        </div>
      </div>

      {/* Modal Criar Chefe */}
      {showUserForm && (
        <div className={styles.modalOverlay} onClick={() => setShowUserForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Registar Chefe de Repartição</h3>
            <form onSubmit={handleCreateChefe}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome Completo</label>
                <input type="text" className={styles.formInput} value={nomeChefe} onChange={(e) => setNomeChefe(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Institucional</label>
                <input type="email" className={styles.formInput} value={emailChefe} onChange={(e) => setEmailChefe(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Palavra-passe</label>
                <input type="password" className={styles.formInput} value={passwordChefe} onChange={(e) => setPasswordChefe(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Confirmar Palavra-passe</label>
                <input type="password" className={styles.formInput} value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} required />
              </div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setShowUserForm(false)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>Registar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar User */}
      {editingUser && (
        <div className={styles.modalOverlay} onClick={() => setEditingUser(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Editar Utilizador</h3>
            <form onSubmit={handleUpdateUser}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome</label>
                <input type="text" className={styles.formInput} value={editUserData.name} onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input type="email" className={styles.formInput} value={editUserData.email} onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })} required />
              </div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setEditingUser(null)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  // --- CURSOS ---
  const renderCoursesSection = () => (
    <>
      <div className={styles.welcomeSection}>
        <div>
          <h2 className={styles.pageTitle}>Gestão de Cursos</h2>
          <p className={styles.pageSubtitle}>Criar, editar, activar e desactivar planos de estágio.</p>
        </div>
        <button className={styles.newUserBtn} onClick={() => setShowCursoForm(true)}>
          <span className="material-symbols-outlined">add</span> Novo Curso
        </button>
      </div>

      <div className={styles.tableColumn}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Lista de Cursos</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Departamento</th>
                <th>Duração (anos)</th>
                <th>Status</th>
                <th className={styles.textRight}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCursos.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center" }}>Nenhum curso encontrado</td></tr>
              ) : (
                filteredCursos.map((curso) => (
                  <tr key={curso.id}>
                    <td>{curso.nome}</td>
                    <td>{curso.departamento?.nome || "—"}</td>
                    <td>{curso.duracao_anos ?? "—"}</td>
                    <td>
                      {curso.ativo ? (
                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>Ativo</span>
                      ) : (
                        <span className={`${styles.statusBadge} ${styles.statusInactive}`}>Inativo</span>
                      )}
                    </td>
                    <td className={styles.textRight}>
                      <div className={styles.actionButtons}>
                        <button className={styles.iconBtn} onClick={() => handleEditCurso(curso)} title="Editar">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className={styles.iconBtn} onClick={() => handleDeleteCurso(curso.id)} title="Eliminar">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                        {curso.ativo ? (
                          <button className={styles.iconBtn} onClick={() => handleDesativarCurso(curso.id)} title="Desactivar">
                            <span className="material-symbols-outlined">block</span>
                          </button>
                        ) : (
                          <button className={styles.iconBtn} onClick={() => handleAtivarCurso(curso.id)} title="Activar">
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>Mostrando {filteredCursos.length} de {cursos.length} cursos</span>
          </div>
        </div>
      </div>

      {/* Modal Criar Curso */}
      {showCursoForm && (
        <div className={styles.modalOverlay} onClick={() => setShowCursoForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Criar Novo Curso</h3>
            <form onSubmit={handleCreateCurso}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome</label>
                <input type="text" className={styles.formInput} value={cursoForm.nome} onChange={(e) => setCursoForm({ ...cursoForm, nome: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Departamento</label>
                <select className={styles.formInput} value={cursoForm.departamento_id} onChange={(e) => setCursoForm({ ...cursoForm, departamento_id: e.target.value })} required>
                  <option value="">Seleccione...</option>
                  {departamentos.map((d) => (<option key={d.id} value={d.id}>{d.nome}</option>))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Duração (anos)</label>
                <input type="number" className={styles.formInput} value={cursoForm.duracao_anos} onChange={(e) => setCursoForm({ ...cursoForm, duracao_anos: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Descrição</label>
                <textarea className={styles.formInput} rows="3" value={cursoForm.descricao} onChange={(e) => setCursoForm({ ...cursoForm, descricao: e.target.value })} required />
              </div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setShowCursoForm(false)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Curso */}
      {editingCurso && (
        <div className={styles.modalOverlay} onClick={() => setEditingCurso(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Editar Curso</h3>
            <form onSubmit={handleUpdateCurso}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome</label>
                <input type="text" className={styles.formInput} value={editCursoData.nome} onChange={(e) => setEditCursoData({ ...editCursoData, nome: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Departamento</label>
                <select className={styles.formInput} value={editCursoData.departamento_id} onChange={(e) => setEditCursoData({ ...editCursoData, departamento_id: e.target.value })} required>
                  <option value="">Seleccione...</option>
                  {departamentos.map((d) => (<option key={d.id} value={d.id}>{d.nome}</option>))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Duração (anos)</label>
                <input type="number" className={styles.formInput} value={editCursoData.duracao_anos} onChange={(e) => setEditCursoData({ ...editCursoData, duracao_anos: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Descrição</label>
                <textarea className={styles.formInput} rows="3" value={editCursoData.descricao} onChange={(e) => setEditCursoData({ ...editCursoData, descricao: e.target.value })} required />
              </div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setEditingCurso(null)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  // --- DEPARTAMENTOS ---
  const renderDepartamentosSection = () => (
    <>
      <div className={styles.welcomeSection}>
        <div>
          <h2 className={styles.pageTitle}>Gestão de Departamentos</h2>
          <p className={styles.pageSubtitle}>Criar e gerir os departamentos académicos.</p>
        </div>
        <button className={styles.newUserBtn} onClick={() => setShowDepartamentoForm(true)}>
          <span className="material-symbols-outlined">add</span> Novo Departamento
        </button>
      </div>

      <div className={styles.tableColumn}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Lista de Departamentos</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th className={styles.textRight}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartamentos.map((dep) => (
                <tr key={dep.id}>
                  <td>{dep.nome}</td>
                  <td>{dep.descricao}</td>
                  <td className={styles.textRight}>
                    <div className={styles.actionButtons}>
                      <button className={styles.iconBtn} onClick={() => handleEditDepartamento(dep)} title="Editar">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className={styles.iconBtn} onClick={() => handleDeleteDepartamento(dep.id)} title="Eliminar">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>Mostrando {filteredDepartamentos.length} de {departamentos.length} registos</span>
          </div>
        </div>
      </div>

      {/* Modal Criar Departamento */}
      {showDepartamentoForm && (
        <div className={styles.modalOverlay} onClick={() => setShowDepartamentoForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Criar Departamento</h3>
            <form onSubmit={handleCreateDepartamento}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome</label>
                <input type="text" className={styles.formInput} value={departamentoForm.nome} onChange={(e) => setDepartamentoForm({ ...departamentoForm, nome: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Descrição</label>
                <textarea className={styles.formInput} rows="3" value={departamentoForm.descricao} onChange={(e) => setDepartamentoForm({ ...departamentoForm, descricao: e.target.value })} />
              </div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setShowDepartamentoForm(false)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Departamento */}
      {editingDepartamento && (
        <div className={styles.modalOverlay} onClick={() => setEditingDepartamento(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Editar Departamento</h3>
            <form onSubmit={handleUpdateDepartamento}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome</label>
                <input type="text" className={styles.formInput} value={editDepartamentoData.nome} onChange={(e) => setEditDepartamentoData({ ...editDepartamentoData, nome: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Descrição</label>
                <textarea className={styles.formInput} rows="3" value={editDepartamentoData.descricao} onChange={(e) => setEditDepartamentoData({ ...editDepartamentoData, descricao: e.target.value })} />
              </div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setEditingDepartamento(null)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  // --- INSTITUIÇÕES ---
  const renderInstituicoesSection = () => (
    <>
      <div className={styles.welcomeSection}>
        <div>
          <h2 className={styles.pageTitle}>Gestão de Instituições</h2>
          <p className={styles.pageSubtitle}>Empresas parceiras para estágios.</p>
        </div>
        <button className={styles.newUserBtn} onClick={() => setShowInstituicaoForm(true)}>
          <span className="material-symbols-outlined">add</span> Nova Instituição
        </button>
      </div>

      <div className={styles.tableColumn}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Lista de Instituições</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Status</th>
                <th className={styles.textRight}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstituicoes.map((inst) => (
                <tr key={inst.id}>
                  <td>{inst.nome}</td>
                  <td>{inst.email}</td>
                  <td>{inst.telefone}</td>
                  <td>
                    {inst.status === "aprovada" ? (
                      <span className={`${styles.statusBadge} ${styles.statusActive}`}>Aprovada</span>
                    ) : inst.status === "rejeitada" ? (
                      <span className={`${styles.statusBadge} ${styles.statusInactive}`}>Rejeitada</span>
                    ) : inst.status === "suspensa" ? (
                      <span className={`${styles.statusBadge} ${styles.statusInactive}`}>Suspensa</span>
                    ) : (
                      <span className={`${styles.statusBadge}`}>Pendente</span>
                    )}
                  </td>
                  <td className={styles.textRight}>
                    <div className={styles.actionButtons}>
                      <button className={styles.iconBtn} onClick={() => handleEditInstituicao(inst)} title="Editar">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      {inst.status !== "aprovada" && (
                        <button className={styles.iconBtn} onClick={() => handleApproveInstituicao(inst.id)} title="Aprovar">
                          <span className="material-symbols-outlined">check_circle</span>
                        </button>
                      )}
                      {inst.status !== "rejeitada" && (
                        <button className={styles.iconBtn} onClick={() => handleRejectInstituicao(inst.id)} title="Rejeitar">
                          <span className="material-symbols-outlined">cancel</span>
                        </button>
                      )}
                      {inst.status !== "suspensa" && (
                        <button className={styles.iconBtn} onClick={() => handleSuspendInstituicao(inst.id)} title="Suspender">
                          <span className="material-symbols-outlined">block</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>Mostrando {filteredInstituicoes.length} de {instituicoes.length} instituições</span>
          </div>
        </div>
      </div>

      {/* Modal Criar Instituição */}
      {showInstituicaoForm && (
        <div className={styles.modalOverlay} onClick={() => setShowInstituicaoForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Nova Instituição</h3>
            <form onSubmit={handleCreateInstituicao}>
              <div className={styles.formGroup}><label className={styles.formLabel}>Nome</label><input type="text" className={styles.formInput} value={instituicaoForm.nome} onChange={(e) => setInstituicaoForm({ ...instituicaoForm, nome: e.target.value })} required /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>NUIT</label><input type="text" className={styles.formInput} value={instituicaoForm.nuit} onChange={(e) => setInstituicaoForm({ ...instituicaoForm, nuit: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Endereço</label><input type="text" className={styles.formInput} value={instituicaoForm.endereco} onChange={(e) => setInstituicaoForm({ ...instituicaoForm, endereco: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Telefone</label><input type="text" className={styles.formInput} value={instituicaoForm.telefone} onChange={(e) => setInstituicaoForm({ ...instituicaoForm, telefone: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Email</label><input type="email" className={styles.formInput} value={instituicaoForm.email} onChange={(e) => setInstituicaoForm({ ...instituicaoForm, email: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Ponto Focal (nome)</label><input type="text" className={styles.formInput} value={instituicaoForm.ponto_focal_nome} onChange={(e) => setInstituicaoForm({ ...instituicaoForm, ponto_focal_nome: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Ponto Focal (contacto)</label><input type="text" className={styles.formInput} value={instituicaoForm.ponto_focal_contacto} onChange={(e) => setInstituicaoForm({ ...instituicaoForm, ponto_focal_contacto: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Validade da Parceria</label><input type="date" className={styles.formInput} value={instituicaoForm.validade_parceria} onChange={(e) => setInstituicaoForm({ ...instituicaoForm, validade_parceria: e.target.value })} /></div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setShowInstituicaoForm(false)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Instituição */}
      {editingInstituicao && (
        <div className={styles.modalOverlay} onClick={() => setEditingInstituicao(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Editar Instituição</h3>
            <form onSubmit={handleUpdateInstituicao}>
              <div className={styles.formGroup}><label className={styles.formLabel}>Nome</label><input type="text" className={styles.formInput} value={editInstituicaoData.nome || ""} onChange={(e) => setEditInstituicaoData({ ...editInstituicaoData, nome: e.target.value })} required /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>NUIT</label><input type="text" className={styles.formInput} value={editInstituicaoData.nuit || ""} onChange={(e) => setEditInstituicaoData({ ...editInstituicaoData, nuit: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Endereço</label><input type="text" className={styles.formInput} value={editInstituicaoData.endereco || ""} onChange={(e) => setEditInstituicaoData({ ...editInstituicaoData, endereco: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Telefone</label><input type="text" className={styles.formInput} value={editInstituicaoData.telefone || ""} onChange={(e) => setEditInstituicaoData({ ...editInstituicaoData, telefone: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Email</label><input type="email" className={styles.formInput} value={editInstituicaoData.email || ""} onChange={(e) => setEditInstituicaoData({ ...editInstituicaoData, email: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Ponto Focal (nome)</label><input type="text" className={styles.formInput} value={editInstituicaoData.ponto_focal_nome || ""} onChange={(e) => setEditInstituicaoData({ ...editInstituicaoData, ponto_focal_nome: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Ponto Focal (contacto)</label><input type="text" className={styles.formInput} value={editInstituicaoData.ponto_focal_contacto || ""} onChange={(e) => setEditInstituicaoData({ ...editInstituicaoData, ponto_focal_contacto: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Validade da Parceria</label><input type="date" className={styles.formInput} value={editInstituicaoData.validade_parceria || ""} onChange={(e) => setEditInstituicaoData({ ...editInstituicaoData, validade_parceria: e.target.value })} /></div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setEditingInstituicao(null)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  // --- ROLES ---
  const renderRolesSection = () => (
    <>
      <div className={styles.welcomeSection}>
        <div>
          <h2 className={styles.pageTitle}>Gestão de Papéis (Roles)</h2>
          <p className={styles.pageSubtitle}>Definir funções e permissões do sistema.</p>
        </div>
        <button className={styles.newUserBtn} onClick={() => setShowRoleForm(true)}>
          <span className="material-symbols-outlined">add</span> Novo Papel
        </button>
      </div>

      <div className={styles.tableColumn}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Lista de Papéis</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Guard</th>
                <th className={styles.textRight}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>{role.guard_name}</td>
                  <td className={styles.textRight}>
                    <div className={styles.actionButtons}>
                      <button className={styles.iconBtn} onClick={() => handleEditRole(role)} title="Editar">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className={styles.iconBtn} onClick={() => handleDeleteRole(role.id)} title="Eliminar">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>Mostrando {filteredRoles.length} de {roles.length} papéis</span>
          </div>
        </div>
      </div>

      {/* Modal Criar Role */}
      {showRoleForm && (
        <div className={styles.modalOverlay} onClick={() => setShowRoleForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Criar Papel</h3>
            <form onSubmit={handleCreateRole}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome</label>
                <input type="text" className={styles.formInput} value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Guard</label>
                <input type="text" className={styles.formInput} value={roleForm.guard_name} onChange={(e) => setRoleForm({ ...roleForm, guard_name: e.target.value })} />
              </div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setShowRoleForm(false)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Role */}
      {editingRole && (
        <div className={styles.modalOverlay} onClick={() => setEditingRole(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Editar Papel</h3>
            <form onSubmit={handleUpdateRole}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome</label>
                <input type="text" className={styles.formInput} value={editRoleData.name} onChange={(e) => setEditRoleData({ ...editRoleData, name: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Guard</label>
                <input type="text" className={styles.formInput} value={editRoleData.guard_name} onChange={(e) => setEditRoleData({ ...editRoleData, guard_name: e.target.value })} />
              </div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setEditingRole(null)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  // --- NOTIFICAÇÕES ---
  const renderNotificationsSection = () => (
    <>
      <div className={styles.welcomeSection}>
        <div>
          <h2 className={styles.pageTitle}>Notificações</h2>
          <p className={styles.pageSubtitle}>Mensagens enviadas pelo sistema.</p>
        </div>
        <button className={styles.exportBtn} onClick={handleMarkAllRead}>
          <span className="material-symbols-outlined">done_all</span> Marcar todas como lidas
        </button>
      </div>
      <div className={styles.tableColumn}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Mensagem</th>
                <th>Data</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((n) => (
                <tr key={n.id}>
                  <td>{n.titulo || n.data?.titulo || "—"}</td>
                  <td>{n.mensagem || n.data?.mensagem || "—"}</td>
                  <td>{new Date(n.created_at).toLocaleString()}</td>
                  <td>{n.lida ? "Lida" : "Não lida"}</td>
                </tr>
              ))}
              {filteredNotifications.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: "center" }}>Nenhuma notificação</td></tr>
              )}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>Mostrando {filteredNotifications.length} de {notifications.length} notificações</span>
          </div>
        </div>
      </div>
    </>
  );

  // Logs e Active Sessions
  const renderLogsSection = () => (
    <>
      <div className={styles.welcomeSection}>
        <div>
          <h2 className={styles.pageTitle}>Logs de Actividade</h2>
          <p className={styles.pageSubtitle}>Histórico de acções no sistema.</p>
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
                <tr><td colSpan="4" style={{ textAlign: "center" }}>Nenhum log encontrado</td></tr>
              )}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>Mostrando {filteredLogs.length} de {logs.length} logs</span>
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
          <p className={styles.pageSubtitle}>Utilizadores actualmente online e últimos acessos.</p>
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
                  <td>{user.failed_attempts > 3 ? <span className={styles.abuseWarning}>Possível tentativa de abuso</span> : "Normal"}</td>
                </tr>
              ))}
              {filteredActiveUsers.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: "center" }}>Nenhuma sessão activa</td></tr>
              )}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>Mostrando {filteredActiveUsers.length} de {activeUsers.length} sessões</span>
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
        {/* ========== SIDEBAR ========== */}
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
            <a href="#" className={`${styles.navLink} ${activeMenu === "users" ? styles.navLinkActive : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu("users"); }}>
              <span className="material-symbols-outlined">group</span><span>Utilizadores</span>
            </a>
            <a href="#" className={`${styles.navLink} ${activeMenu === "roles" ? styles.navLinkActive : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu("roles"); }}>
              <span className="material-symbols-outlined">admin_panel_settings</span><span>Papéis</span>
            </a>
            <a href="#" className={`${styles.navLink} ${activeMenu === "departamentos" ? styles.navLinkActive : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu("departamentos"); }}>
              <span className="material-symbols-outlined">account_balance</span><span>Departamentos</span>
            </a>
            <a href="#" className={`${styles.navLink} ${activeMenu === "cursos" ? styles.navLinkActive : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu("cursos"); }}>
              <span className="material-symbols-outlined">class</span><span>Cursos</span>
            </a>
            <a href="#" className={`${styles.navLink} ${activeMenu === "instituicoes" ? styles.navLinkActive : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu("instituicoes"); }}>
              <span className="material-symbols-outlined">business</span><span>Instituições</span>
            </a>
            <a href="#" className={`${styles.navLink} ${activeMenu === "notifications" ? styles.navLinkActive : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu("notifications"); }}>
              <span className="material-symbols-outlined">notifications</span><span>Notificações</span>
            </a>
            <a href="#" className={`${styles.navLink} ${activeMenu === "logs" ? styles.navLinkActive : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu("logs"); }}>
              <span className="material-symbols-outlined">history_edu</span><span>Logs</span>
            </a>
            <a href="#" className={`${styles.navLink} ${activeMenu === "activeSessions" ? styles.navLinkActive : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu("activeSessions"); }}>
              <span className="material-symbols-outlined">devices</span><span>Sessões</span>
            </a>
          </nav>

          <div className={styles.systemStatus}>
            <p className={styles.statusTitle}>Status do Sistema</p>
            <div className={styles.statusIndicator}>
              <span className={styles.statusDot}></span>
              <p className={styles.statusText}>Ambiente Online</p>
            </div>
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span><span>Sair</span>
          </button>
        </aside>

        {/* ========== MAIN CONTENT ========== */}
        <div className={styles.mainContent}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.searchWrapper}>
                <span className="material-symbols-outlined">search</span>
                <input type="text" placeholder="Pesquisar..." className={styles.searchInput}
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw2sg3X6j2RP2zeyQnj4NzkQHF0aiIWxGfo1bK44nIIdqBIITiXnQohHcGRzHZjI72VTWQCtZfFyt5CYGg54FIctgJUmAbNIyfU3APPCa10WHca0QUjklD5S01DCWmuh_AGVw7Hot6WJ1gYLIbGefUi6wAmQ8Bx4elYw3CrsFTr50bgm-wAQ3-0x0LhGOtM5x_nFzYZ79xXylIAk5z2YgWpzK0i6eN0qd3oO28IidT4_Hvr3uGOkD00kJRaOzU9PQAz-RWaCUH5HU" alt="Avatar" />
                </div>
              </div>
            </div>
          </header>

          <main className={styles.content}>
            {activeMenu === "users" && renderUsersSection()}
            {activeMenu === "roles" && renderRolesSection()}
            {activeMenu === "departamentos" && renderDepartamentosSection()}
            {activeMenu === "cursos" && renderCoursesSection()}
            {activeMenu === "instituicoes" && renderInstituicoesSection()}
            {activeMenu === "notifications" && renderNotificationsSection()}
            {activeMenu === "logs" && renderLogsSection()}
            {activeMenu === "activeSessions" && renderActiveSessionsSection()}
          </main>

          <footer className={styles.footer}>
            <p>PEP - Sistema de Gestão de Estágios Profissionalizantes © 2023</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;