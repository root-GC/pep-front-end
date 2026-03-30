import React, { useState, useEffect, useCallback } from 'react';
import styles from './css/DashboardChefe.module.css';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getInstituicoes,
  createInstituicao,
  updateInstituicao,
  deleteInstituicao,
  getEstagios,
} from '../../services/chefeService';
import { useNavigate } from 'react-router-dom';

// ===== Helpers =====
const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

const EMPTY_USER = {
  name: '',
  email: '',
  password: '',
  role: 'COORDENADOR',
  instituicao_id: '',
};

const EMPTY_INST = {
  nome: '',
  nuit: '',
  endereco: '',
  telefone: '',
  email: '',
  ponto_focal_nome: '',
  ponto_focal_contacto: '',
};

const ROLE_LABELS = {
  COORDENADOR: 'Coordenador',
  ESTAGIARIO: 'Estagiário',
  SUPERVISOR: 'Supervisor',
  TUTOR: 'Tutor',
};

// ===== Modal Component (inline styles) =====
const modalStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  box: {
    background: '#fff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #e5e7eb',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
    color: '#111827',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    borderRadius: '6px',
    lineHeight: 1,
  },
  body: {
    padding: '1.25rem',
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.1rem',
  },
  footer: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    padding: '1rem 1.25rem',
    borderTop: '1px solid #e5e7eb',
  },
  cancelBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    background: '#f9fafb',
    color: '#374151',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontWeight: 500,
  },
  saveBtn: {
    padding: '0.5rem 1.25rem',
    borderRadius: '8px',
    border: 'none',
    background: '#4f46e5',
    color: '#fff',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontWeight: 500,
    opacity: 1,
  },
  saveBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '0.25rem',
    marginTop: '0.65rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    background: '#f9fafb',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    background: '#f9fafb',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
    marginTop: '0.1rem',
  },
};

const FormField = ({ label, children }) => (
  <div>
    <label style={modalStyles.label}>{label}</label>
    {children}
  </div>
);

const FormInput = (props) => <input style={modalStyles.input} {...props} />;

const FormSelect = ({ children, ...props }) => (
  <select style={modalStyles.select} {...props}>
    {children}
  </select>
);

const Modal = ({ title, onClose, onSubmit, submitting, children }) => (
  <div style={modalStyles.overlay}>
    <div style={modalStyles.box}>
      <div style={modalStyles.header}>
        <h3 style={modalStyles.headerTitle}>{title}</h3>
        <button style={modalStyles.closeBtn} onClick={onClose} type="button">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div style={modalStyles.body}>{children}</div>
        <div style={modalStyles.footer}>
          <button style={modalStyles.cancelBtn} type="button" onClick={onClose}>
            Cancelar
          </button>
          <button
            style={{
              ...modalStyles.saveBtn,
              ...(submitting ? modalStyles.saveBtnDisabled : {}),
            }}
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'A guardar…' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

// ===== Main Component =====
const DashboardChefe = () => {
  const navigate = useNavigate();

  // Data states
  const [users, setUsers] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [estagios, setEstagios] = useState([]);

  // UI state
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState({ users: false, instituicoes: false, estagios: false });
  const [error, setError] = useState({ users: null, instituicoes: null, estagios: null });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modals
  const [userModal, setUserModal] = useState(null);
  const [instModal, setInstModal] = useState(null);
  const [userForm, setUserForm] = useState(EMPTY_USER);
  const [instForm, setInstForm] = useState(EMPTY_INST);
  const [submitting, setSubmitting] = useState(false);

  const authUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch functions
  const fetchUsers = useCallback(async () => {
    setLoading((l) => ({ ...l, users: true }));
    setError((e) => ({ ...e, users: null }));
    try {
      const { data } = await getUsers();
      setUsers(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setError((e) => ({
        ...e,
        users: err.response?.data?.message ?? 'Erro ao carregar utilizadores.',
      }));
    } finally {
      setLoading((l) => ({ ...l, users: false }));
    }
  }, []);

  const fetchInstituicoes = useCallback(async () => {
    setLoading((l) => ({ ...l, instituicoes: true }));
    setError((e) => ({ ...e, instituicoes: null }));
    try {
      const { data } = await getInstituicoes();
      setInstituicoes(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setError((e) => ({
        ...e,
        instituicoes: err.response?.data?.message ?? 'Erro ao carregar instituições.',
      }));
    } finally {
      setLoading((l) => ({ ...l, instituicoes: false }));
    }
  }, []);

  const fetchEstagios = useCallback(async () => {
    setLoading((l) => ({ ...l, estagios: true }));
    setError((e) => ({ ...e, estagios: null }));
    try {
      const { data } = await getEstagios();
      setEstagios(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setError((e) => ({
        ...e,
        estagios: err.response?.data?.message ?? 'Erro ao carregar estágios.',
      }));
    } finally {
      setLoading((l) => ({ ...l, estagios: false }));
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchInstituicoes();
    fetchEstagios();
  }, [fetchUsers, fetchInstituicoes, fetchEstagios]);

  // Derived stats
  const activeEstagios = estagios.filter(
    (e) => (e.status ?? e.estado ?? '').toUpperCase() === 'ATIVO'
  );
  const pendingEstagios = estagios.filter((e) =>
    ['PENDENTE', 'PENDING'].includes((e.status ?? e.estado ?? '').toUpperCase())
  );

  // User CRUD
  const openCreateUser = () => {
    setUserForm(EMPTY_USER);
    setUserModal('create');
  };

  const openEditUser = (user) => {
    setUserForm({
      name: user.name ?? '',
      email: user.email ?? '',
      password: '',
      role: user.role ?? user.perfil ?? 'COORDENADOR',
      instituicao_id: user.instituicao_id ?? '',
    });
    setUserModal(user);
  };

  const handleSaveUser = async () => {
    setSubmitting(true);
    try {
      const payload = { ...userForm };
      if (!payload.password) delete payload.password;
      if (userModal === 'create') {
        await createUser(payload);
      } else {
        await updateUser(userModal.id, payload);
      }
      setUserModal(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message ?? 'Erro ao guardar utilizador.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este utilizador?')) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message ?? 'Erro ao remover utilizador.');
    }
  };

  // Institution CRUD
  const openCreateInst = () => {
    setInstForm(EMPTY_INST);
    setInstModal('create');
  };

  const openEditInst = (inst) => {
    setInstForm({
      nome: inst.nome ?? inst.name ?? '',
      nuit: inst.nuit ?? '',
      endereco: inst.endereco ?? '',
      email: inst.email ?? '',
      telefone: inst.telefone ?? '',
      ponto_focal_nome: inst.ponto_focal_nome ?? '',
      ponto_focal_contacto: inst.ponto_focal_contacto ?? '',
    });
    setInstModal(inst);
  };

  const handleSaveInst = async () => {
    setSubmitting(true);
    try {
      if (instModal === 'create') {
        await createInstituicao(instForm);
      } else {
        await updateInstituicao(instModal.id, instForm);
      }
      setInstModal(null);
      fetchInstituicoes();
    } catch (err) {
      alert(err.response?.data?.message ?? 'Erro ao guardar instituição.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInst = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover esta instituição?')) return;
    try {
      await deleteInstituicao(id);
      fetchInstituicoes();
    } catch (err) {
      alert(err.response?.data?.message ?? 'Erro ao remover instituição.');
    }
  };

  // Filters
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || (u.role ?? u.perfil ?? '') === roleFilter;
    return matchSearch && matchRole;
  });

  const filteredInst = instituicoes.filter((i) =>
    !search ||
    (i.nome ?? i.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredEstagios = estagios.filter((e) =>
    !search ||
    (e.titulo ?? e.title ?? e.descricao ?? '').toLowerCase().includes(search.toLowerCase())
  );

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <h1 className={styles.logoTitle}>Sistema PEP</h1>
            <p className={styles.logoSubtitle}>Repartição</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <a
            href="#"
            className={`${styles.navLink} ${currentView === 'dashboard' ? styles.navLinkActive : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className={`${styles.navLink} ${currentView === 'users' ? styles.navLinkActive : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentView('users'); }}
          >
            <span className="material-symbols-outlined">group</span>
            <span>Gestão de Utilizadores</span>
          </a>
          <a
            href="#"
            className={`${styles.navLink} ${currentView === 'instituicoes' ? styles.navLinkActive : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentView('instituicoes'); }}
          >
            <span className="material-symbols-outlined">corporate_fare</span>
            <span>Gestão de Instituições</span>
          </a>
          <a
            href="#"
            className={`${styles.navLink} ${currentView === 'estagios' ? styles.navLinkActive : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentView('estagios'); }}
          >
            <span className="material-symbols-outlined">work</span>
            <span>Gestão de Estágios</span>
          </a>
        </nav>

        <div className={styles.supportBox}>
          <div className={styles.supportContent}>
            <p className={styles.supportTitle}>Suporte Técnico</p>
            <p className={styles.supportText}>Precisa de ajuda com o sistema? Contacte TI.</p>
          </div>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          <span>Sair</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.searchContainer}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input
              type="text"
              placeholder="Pesquisar por estagiário ou processo..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.userArea}>
            <button className={styles.notificationBtn}>
              <span className="material-symbols-outlined">notifications</span>
              {pendingEstagios.length > 0 && (
                <span className={styles.notificationBadge}>{pendingEstagios.length}</span>
              )}
            </button>
            <div className={styles.divider}></div>
            <div className={styles.userInfo}>
              <div className={styles.userText}>
                <p className={styles.userName}>{authUser.name ?? 'Chefe'}</p>
                <p className={styles.userRole}>Chefe de Repartição</p>
              </div>
              <div className={styles.avatar}>
                {authUser.avatar ? (
                  <img src={authUser.avatar} alt="Avatar" />
                ) : (
                  <span>{initials(authUser.name ?? 'CR')}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className={styles.content}>
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <>
              <div className={styles.pageHeader}>
                <div>
                  <h2 className={styles.pageTitle}>Dashboard de Gestão</h2>
                  <p className={styles.pageSubtitle}>
                    Bem-vindo ao Sistema de Estágios Profissionalizantes (PEP).
                  </p>
                </div>
                <div className={styles.headerActions}>
                  <button className={styles.exportBtn}>
                    <span className="material-symbols-outlined">file_export</span>
                    Exportar Relatório
                  </button>
                  <button className={styles.newUserBtn} onClick={openCreateUser}>
                    <span className="material-symbols-outlined">person_add</span>
                    Novo Utilizador
                  </button>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>Total Utilizadores</span>
                    <span className="material-symbols-outlined">group</span>
                  </div>
                  <p className={styles.statValue}>
                    {loading.users ? '…' : users.length.toLocaleString()}
                  </p>
                  <p className={styles.statTrend}>Utilizadores registados</p>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>Instituições Parceiras</span>
                    <span className="material-symbols-outlined">corporate_fare</span>
                  </div>
                  <p className={styles.statValue}>
                    {loading.instituicoes ? '…' : instituicoes.length}
                  </p>
                  <p className={styles.statTrend}>Estável</p>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>Estágios Ativos</span>
                    <span className="material-symbols-outlined">work</span>
                  </div>
                  <p className={styles.statValue}>
                    {loading.estagios ? '…' : activeEstagios.length}
                  </p>
                  <p className={styles.statTrend}>De {estagios.length} no total</p>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>Pendências</span>
                    <span className="material-symbols-outlined">pending_actions</span>
                  </div>
                  <p className={styles.statValue}>
                    {loading.estagios ? '…' : pendingEstagios.length}
                  </p>
                  <p
                    className={`${styles.statTrend} ${
                      pendingEstagios.length > 0 ? styles.urgent : ''
                    }`}
                  >
                    {pendingEstagios.length > 0 ? 'Ação Urgente' : 'Sem pendências'}
                  </p>
                </div>
              </div>

              <div className={styles.columns}>
                <div className={styles.leftColumn}>
                  <div className={styles.metricsCard}>
                    <h3 className={styles.metricsTitle}>
                      <span className="material-symbols-outlined">analytics</span>
                      Métricas Rápidas
                    </h3>
                    <div className={styles.metricsList}>
                      <div className={styles.metricItem}>
                        <span>Taxa de Ocupação</span>
                        <span className={styles.metricValue}>
                          {estagios.length > 0
                            ? `${Math.round((activeEstagios.length / estagios.length) * 100)}%`
                            : '—'}
                        </span>
                      </div>
                      <div className={styles.metricItem}>
                        <span>Estágios Pendentes</span>
                        <span
                          className={`${styles.metricValue} ${
                            pendingEstagios.length > 0 ? styles.critical : ''
                          }`}
                        >
                          {pendingEstagios.length}
                        </span>
                      </div>
                      <div className={styles.metricItem}>
                        <span>Total Instituições</span>
                        <span className={styles.metricValue}>{instituicoes.length}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span>Total Estágios</span>
                        <span className={styles.metricValue}>{estagios.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.rightColumn}>
                  <div className={styles.promoCard}>
                    <div className={styles.promoContent}>
                      <h3 className={styles.promoTitle}>Relatórios Mensais</h3>
                      <p className={styles.promoText}>
                        O relatório consolidado já está disponível para exportação.
                      </p>
                      <button className={styles.promoBtn}>Baixar Agora</button>
                    </div>
                    <div className={styles.promoGlow}></div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Users View */}
          {currentView === 'users' && (
            <div className={styles.tableColumn}>
              <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>
                  Lista de Utilizadores{' '}
                  {loading.users && (
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 400, marginLeft: '0.5rem' }}>
                      a carregar…
                    </span>
                  )}
                </h3>
                <div className={styles.headerActions}>
                  <select
                    className={styles.filterSelect}
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">Filtrar por Perfil</option>
                    {Object.entries(ROLE_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                  <button className={styles.newUserBtn} onClick={openCreateUser}>
                    <span className="material-symbols-outlined">person_add</span>
                    Novo Utilizador
                  </button>
                </div>
              </div>

              {error.users && (
                <p className={styles.errorMsg}>{error.users}</p>
              )}

              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Perfil</th>
                      <th>Status</th>
                      <th className={styles.textRight}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 && !loading.users ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem' }}>
                          Nenhum utilizador encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div className={styles.userCell}>
                              <div className={styles.userInitials}>
                                {initials(u.name)}
                              </div>
                              <span>{u.name}</span>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`${styles.badge} ${styles.badgeProfile}`}>
                              {ROLE_LABELS[u.role ?? u.perfil] ?? u.role ?? u.perfil}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`${styles.badge} ${
                                (u.status ?? u.estado ?? '').toUpperCase() === 'INATIVO'
                                  ? styles.badgeInactive
                                  : styles.badgeActive
                              }`}
                            >
                              {(u.status ?? u.estado ?? 'ATIVO').toUpperCase()}
                            </span>
                          </td>
                          <td className={styles.textRight}>
                            <button className={styles.editBtn} onClick={() => openEditUser(u)}>
                              Editar
                            </button>
                            <button
                              className={styles.editBtn}
                              style={{ marginLeft: 4, color: '#ef4444' }}
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <span className={styles.paginationInfo}>
                    A mostrar {filteredUsers.length} de {users.length} utilizadores
                  </span>
                  <div className={styles.paginationControls}>
                    <button className={styles.paginationBtn} onClick={fetchUsers}>
                      Atualizar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Institutions View */}
          {currentView === 'instituicoes' && (
            <div className={styles.tableColumn}>
              <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>
                  Lista de Instituições{' '}
                  {loading.instituicoes && (
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 400, marginLeft: '0.5rem' }}>
                      a carregar…
                    </span>
                  )}
                </h3>
                <button className={styles.newUserBtn} onClick={openCreateInst}>
                  + Nova Instituição
                </button>
              </div>

              {error.instituicoes && (
                <p className={styles.errorMsg}>{error.instituicoes}</p>
              )}

              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>NUIT</th>
                      <th>Email</th>
                      <th>Telefone</th>
                      <th>Ponto Focal (Nome)</th>
                      <th>Ponto Focal (Contacto)</th>
                      <th className={styles.textRight}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInst.length === 0 && !loading.instituicoes ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '1.5rem' }}>
                          Nenhuma instituição encontrada.
                        </td>
                      </tr>
                    ) : (
                      filteredInst.map((inst) => (
                        <tr key={inst.id}>
                          <td>{inst.nome ?? inst.name ?? '—'}</td>
                          <td>{inst.nuit ?? '—'}</td>
                          <td>{inst.email ?? '—'}</td>
                          <td>{inst.telefone ?? '—'}</td>
                          <td>{inst.ponto_focal_nome ?? '—'}</td>
                          <td>{inst.ponto_focal_contacto ?? '—'}</td>
                          <td className={styles.textRight}>
                            <button className={styles.editBtn} onClick={() => openEditInst(inst)}>
                              Editar
                            </button>
                            <button
                              className={styles.editBtn}
                              style={{ marginLeft: 4, color: '#ef4444' }}
                              onClick={() => handleDeleteInst(inst.id)}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <span className={styles.paginationInfo}>
                    A mostrar {filteredInst.length} de {instituicoes.length} instituições
                  </span>
                  <div className={styles.paginationControls}>
                    <button className={styles.paginationBtn} onClick={fetchInstituicoes}>
                      Atualizar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Internships View */}
          {currentView === 'estagios' && (
            <div className={styles.tableColumn}>
              <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>
                  Lista de Estágios{' '}
                  {loading.estagios && (
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 400, marginLeft: '0.5rem' }}>
                      a carregar…
                    </span>
                  )}
                </h3>
              </div>

              {error.estagios && (
                <p className={styles.errorMsg}>{error.estagios}</p>
              )}

              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Título / Descrição</th>
                      <th>Instituição</th>
                      <th>Estagiário</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEstagios.length === 0 && !loading.estagios ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '1.5rem' }}>
                          Nenhum estágio encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredEstagios.map((e) => (
                        <tr key={e.id}>
                          <td>{e.titulo ?? e.title ?? e.descricao ?? '—'}</td>
                          <td>
                            {e.instituicao?.nome ?? e.instituicao?.name ?? e.instituicao_id ?? '—'}
                          </td>
                          <td>
                            {e.estagiario?.name ?? e.user?.name ?? '—'}
                          </td>
                          <td>
                            <span
                              className={`${styles.badge} ${
                                (e.status ?? e.estado ?? '').toUpperCase() === 'ATIVO'
                                  ? styles.badgeActive
                                  : (e.status ?? e.estado ?? '').toUpperCase() === 'INATIVO'
                                  ? styles.badgeInactive
                                  : styles.badgeProfile
                              }`}
                            >
                              {(e.status ?? e.estado ?? 'PENDENTE').toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <span className={styles.paginationInfo}>
                    A mostrar {filteredEstagios.length} de {estagios.length} estágios
                  </span>
                  <div className={styles.paginationControls}>
                    <button className={styles.paginationBtn} onClick={fetchEstagios}>
                      Atualizar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className={styles.footer}>
          <p>PEP - Sistema de Gestão de Estágios Profissionalizantes © 2024</p>
        </footer>
      </div>

      {/* User Modal */}
      {userModal && (
        <Modal
          title={userModal === 'create' ? 'Novo Utilizador' : 'Editar Utilizador'}
          onClose={() => setUserModal(null)}
          onSubmit={handleSaveUser}
          submitting={submitting}
        >
          <FormField label="Nome completo">
            <FormInput
              value={userForm.name}
              onChange={(e) => setUserForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="Ex: João Mutola"
            />
          </FormField>
          <FormField label="Email">
            <FormInput
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
              required
              placeholder="utilizador@pep.gov.mz"
            />
          </FormField>
          <FormField label={userModal === 'create' ? 'Password' : 'Nova Password (deixe em branco para manter)'}>
            <FormInput
              type="password"
              value={userForm.password}
              onChange={(e) => setUserForm((f) => ({ ...f, password: e.target.value }))}
              required={userModal === 'create'}
              placeholder="••••••••"
            />
          </FormField>
          <FormField label="Perfil">
            <FormSelect
              value={userForm.role}
              onChange={(e) => setUserForm((f) => ({ ...f, role: e.target.value }))}
            >
              {Object.entries(ROLE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </FormSelect>
          </FormField>
          <FormField label="Instituição">
            <FormSelect
              value={userForm.instituicao_id}
              onChange={(e) => setUserForm((f) => ({ ...f, instituicao_id: e.target.value }))}
            >
              <option value="">— Selecione —</option>
              {instituicoes.map((i) => (
                <option key={i.id} value={i.id}>{i.nome ?? i.name}</option>
              ))}
            </FormSelect>
          </FormField>
        </Modal>
      )}

      {/* Institution Modal */}
      {instModal && (
        <Modal
          title={instModal === 'create' ? 'Nova Instituição' : 'Editar Instituição'}
          onClose={() => setInstModal(null)}
          onSubmit={handleSaveInst}
          submitting={submitting}
        >
          <FormField label="Nome">
            <FormInput
              value={instForm.nome}
              onChange={(e) => setInstForm((f) => ({ ...f, nome: e.target.value }))}
              required
              placeholder="Ex: Banco de Moçambique"
            />
          </FormField>
          <FormField label="NUIT">
            <FormInput
              value={instForm.nuit}
              onChange={(e) => setInstForm((f) => ({ ...f, nuit: e.target.value }))}
              placeholder="400123456"
            />
          </FormField>
          <FormField label="Endereço">
            <FormInput
              value={instForm.endereco}
              onChange={(e) => setInstForm((f) => ({ ...f, endereco: e.target.value }))}
              placeholder="Av. 25 de Setembro, Maputo"
            />
          </FormField>
          <FormField label="Email">
            <FormInput
              type="email"
              value={instForm.email}
              onChange={(e) => setInstForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="contacto@bm.co.mz"
            />
          </FormField>
          <FormField label="Telefone">
            <FormInput
              value={instForm.telefone}
              onChange={(e) => setInstForm((f) => ({ ...f, telefone: e.target.value }))}
              placeholder="841234567"
            />
          </FormField>
          <FormField label="Ponto Focal (Nome)">
            <FormInput
              value={instForm.ponto_focal_nome}
              onChange={(e) => setInstForm((f) => ({ ...f, ponto_focal_nome: e.target.value }))}
              placeholder="Carlos Matola"
            />
          </FormField>
          <FormField label="Ponto Focal (Contacto)">
            <FormInput
              value={instForm.ponto_focal_contacto}
              onChange={(e) => setInstForm((f) => ({ ...f, ponto_focal_contacto: e.target.value }))}
              placeholder="842111111"
            />
          </FormField>
        </Modal>
      )}
    </div>
  );
};

export default DashboardChefe;