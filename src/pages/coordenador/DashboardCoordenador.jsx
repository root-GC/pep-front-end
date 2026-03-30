import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './css/DashboardCoordenador.module.css';
import { useNavigate } from 'react-router-dom';
import {
  getTutores,
  createUser,
  updateUser,
  getEstagios,
  createEstagio,
  atribuirTutor,
  gerarCarta,
  baixarCarta,
  gerarPauta,
  exportarSigeup,
} from '../../services/coordenadorService';

// ─── Tooltip Component (no layout shift) ─────────────────────────────────────
const TOOLTIP_STYLE_ID = 'pep-tooltip-styles';
const injectTooltipStyles = () => {
  if (document.getElementById(TOOLTIP_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = TOOLTIP_STYLE_ID;
  style.textContent = `
    .pep-tooltip-wrap { position: relative; display: inline-flex; }
    .pep-tooltip-bubble { position: fixed; z-index: 9999; pointer-events: none; background: #1e293b; color: #f1f5f9; font-size: 0.72rem; font-weight: 500; line-height: 1.3; padding: 5px 10px; border-radius: 6px; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,.35); opacity: 0; transform: translateY(4px); transition: opacity .15s ease, transform .15s ease; }
    .pep-tooltip-bubble.pep-tip-visible { opacity: 1; transform: translateY(0); }
    .pep-tooltip-bubble::after { content: ''; position: absolute; left: 50%; transform: translateX(-50%); border: 5px solid transparent; }
    .pep-tooltip-bubble.pep-tip-top::after { top: 100%; border-top-color: #1e293b; }
    .pep-tooltip-bubble.pep-tip-bottom::after { bottom: 100%; border-bottom-color: #1e293b; }
  `;
  document.head.appendChild(style);
};

const Tooltip = ({ children, text, placement = 'top', disabled = false }) => {
  const wrapRef = useRef(null);
  const bubbleRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [side, setSide] = useState(placement);

  useEffect(() => { injectTooltipStyles(); }, []);

  const position = () => {
    if (!wrapRef.current || !bubbleRef.current) return;
    const anchor = wrapRef.current.getBoundingClientRect();
    const bubble = bubbleRef.current.getBoundingClientRect();
    const gap = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let usePlacement = placement;
    if (placement === 'top' && anchor.top - bubble.height - gap < 0) usePlacement = 'bottom';
    if (placement === 'bottom' && anchor.bottom + bubble.height + gap > vh) usePlacement = 'top';
    setSide(usePlacement);

    let top = usePlacement === 'top' ? anchor.top - bubble.height - gap : anchor.bottom + gap;
    let left = anchor.left + anchor.width / 2 - bubble.width / 2;
    if (left < 8) left = 8;
    if (left + bubble.width > vw - 8) left = vw - 8 - bubble.width;
    setCoords({ top, left });
  };

  const show = () => { if (!disabled && text) { setVisible(true); position(); } };
  const hide = () => setVisible(false);

  return (
    <span className="pep-tooltip-wrap" ref={wrapRef} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      <span ref={bubbleRef} role="tooltip" className={`pep-tooltip-bubble pep-tip-${side}${visible ? ' pep-tip-visible' : ''}`} style={{ top: coords.top, left: coords.left }}>
        {text}
      </span>
    </span>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

// ─── Modal: Nova Vaga ───────────────────────────────────────────────────────
const NovaVagaModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({ estudante: '', entidade: '', area: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createEstagio(form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar estágio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
        <h3 className={styles.editTitle}>
          <span className="material-symbols-outlined">add_circle</span>
          Nova Vaga de Estágio
        </h3>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <form className={styles.editForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nome do Estudante</label>
            <input name="estudante" type="text" className={styles.formInput} value={form.estudante} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Entidade Acolhedora</label>
            <input name="entidade" type="text" className={styles.formInput} value={form.entidade} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Área de Estágio</label>
            <input name="area" type="text" className={styles.formInput} value={form.area} onChange={handleChange} required />
          </div>
          <div className={styles.formActions}>
            <Tooltip text="Enviar nova vaga para o servidor">
              <button type="submit" className={styles.saveBtn} disabled={loading}>{loading ? 'A guardar…' : 'Criar Vaga'}</button>
            </Tooltip>
            <Tooltip text="Fechar sem guardar">
              <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            </Tooltip>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Modal: Criar Utilizador ────────────────────────────────────────────────
const CreateUserModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ESTUDANTE' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createUser(form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar utilizador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
        <h3 className={styles.editTitle}>
          <span className="material-symbols-outlined">person_add</span>
          Novo Utilizador
        </h3>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <form className={styles.editForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nome Completo</label>
            <input name="name" type="text" className={styles.formInput} value={form.name} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input name="email" type="email" className={styles.formInput} value={form.email} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password</label>
            <input name="password" type="password" className={styles.formInput} value={form.password} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Perfil</label>
            <select name="role" className={styles.formSelect} value={form.role} onChange={handleChange}>
              <option value="ESTUDANTE">Estudante</option>
              <option value="ENTIDADE">Entidade de Acolhimento</option>
              <option value="ORIENTADOR">Orientador Pedagógico</option>
              <option value="TUTOR">Tutor</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn} disabled={loading}>{loading ? 'A criar…' : 'Criar'}</button>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Modal: Gerar Carta ─────────────────────────────────────────────────────
const CartaModal = ({ onClose, onDownload, estagio }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGerar = async () => {
    setLoading(true);
    setError('');
    try {
      await gerarCarta(estagio.id);
      await onDownload(estagio.id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao gerar carta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
        <h3 className={styles.editTitle}>
          <span className="material-symbols-outlined">description</span>
          Carta de Estágio
        </h3>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <p className={styles.modalText}>Deseja gerar a carta de estágio para <strong>{estagio.estudante}</strong>?</p>
        <div className={styles.formActions}>
          <button className={styles.saveBtn} onClick={handleGerar} disabled={loading}>{loading ? 'A gerar…' : 'Gerar e Descarregar'}</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
const DashboardCoordenador = () => {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Navigation
  const [activeView, setActiveView] = useState('dashboard');

  // Data states
  const [estagios, setEstagios] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState({ estagios: false, tutores: false, pauta: false, sigeup: false });
  const [error, setError] = useState('');

  // UI states
  const [search, setSearch] = useState('');
  const [atribuindo, setAtribuindo] = useState(null);
  const [showNovaVaga, setShowNovaVaga] = useState(false);
  const [showCartaModal, setShowCartaModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [selectedEstagio, setSelectedEstagio] = useState(null);

  // User edit form
  const [editUser, setEditUser] = useState({ id: null, name: '', email: '', role: 'ESTUDANTE' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Summary metrics
  const [summary, setSummary] = useState({ novos: 0, ativos: 0, percentagem: 0 });

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fetch functions
  const fetchEstagios = useCallback(async () => {
    setLoading(prev => ({ ...prev, estagios: true }));
    setError('');
    try {
      const { data } = await getEstagios();
      setEstagios(data.candidaturas ?? data.estagios ?? []);
      setAvaliacoes(data.avaliacoes ?? []);
      setSummary({
        novos: data.novos ?? (data.candidaturas?.length ?? 0),
        ativos: data.ativos ?? 0,
        percentagem: data.percentagem ?? 0,
      });
      const primeiro = (data.candidaturas ?? data.estagios ?? [])[0];
      if (primeiro) {
        setEditUser({
          id: primeiro.user_id ?? primeiro.id ?? null,
          name: primeiro.estudante ?? primeiro.nome ?? '',
          email: primeiro.email ?? '',
          role: primeiro.perfil ?? primeiro.role ?? 'ESTUDANTE',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar estágios.');
    } finally {
      setLoading(prev => ({ ...prev, estagios: false }));
    }
  }, []);

  const fetchTutores = useCallback(async () => {
    setLoading(prev => ({ ...prev, tutores: true }));
    try {
      const { data } = await getTutores();
      setTutores(data.data ?? data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar tutores.');
    } finally {
      setLoading(prev => ({ ...prev, tutores: false }));
    }
  }, []);

  useEffect(() => {
    fetchEstagios();
    if (activeView === 'users') fetchTutores();
  }, [fetchEstagios, fetchTutores, activeView]);

  // Actions
  const handleAtribuir = async (id) => {
    setAtribuindo(id);
    try {
      await atribuirTutor(id);
      await fetchEstagios();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atribuir tutor.');
    } finally {
      setAtribuindo(null);
    }
  };

  const handleGerarCarta = (estagio) => {
    setSelectedEstagio(estagio);
    setShowCartaModal(true);
  };

  const handleBaixarCarta = async (id) => {
    try {
      const response = await baixarCarta(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = response.headers['content-disposition']?.match(/filename="?([^"]+)"?/)?.[1] || `carta_estagio_${id}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao descarregar carta.');
    }
  };

  const handleExportarPauta = async () => {
    setLoading(prev => ({ ...prev, pauta: true }));
    try {
      const response = await gerarPauta();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = response.headers['content-disposition']?.match(/filename="?([^"]+)"?/)?.[1] || 'pauta_estagios.xlsx';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao exportar pauta.');
    } finally {
      setLoading(prev => ({ ...prev, pauta: false }));
    }
  };

  const handleExportarSigeup = async () => {
    setLoading(prev => ({ ...prev, sigeup: true }));
    try {
      const response = await exportarSigeup();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = response.headers['content-disposition']?.match(/filename="?([^"]+)"?/)?.[1] || 'exportacao_sigeup.xlsx';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao exportar para SIGEUP.');
    } finally {
      setLoading(prev => ({ ...prev, sigeup: false }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser.id) return;
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');
    try {
      await updateUser(editUser.id, { name: editUser.name, email: editUser.email, role: editUser.role });
      setEditSuccess('Registo guardado com sucesso.');
      await fetchEstagios();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Erro ao guardar registo.');
    } finally {
      setEditLoading(false);
    }
  };

  // Filters
  const estagiosFiltrados = estagios.filter(e => {
    const q = search.toLowerCase();
    return (e.estudante ?? e.nome ?? '').toLowerCase().includes(q) || (e.entidade ?? '').toLowerCase().includes(q);
  });

  const tutoresFiltrados = tutores.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()));

  // ─── Render functions for each view ────────────────────────────────────────
  const renderDashboard = () => (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Dashboard de Coordenação</h2>
          <p className={styles.pageSubtitle}>Visão geral dos estágios e atividades.</p>
        </div>
        <div className={styles.headerActions}>
          <Tooltip text="Recarregar dados">
            <button className={styles.filterBtn} onClick={fetchEstagios}>
              <span className="material-symbols-outlined">refresh</span>
              Atualizar
            </button>
          </Tooltip>
          <Tooltip text="Criar uma nova vaga de estágio">
            <button className={styles.newVagaBtn} onClick={() => setShowNovaVaga(true)}>
              <span className="material-symbols-outlined">add</span>
              Nova Vaga
            </button>
          </Tooltip>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Novos Pedidos</span>
            <span className="material-symbols-outlined">mail</span>
          </div>
          <p className={styles.statValue}>{summary.novos}</p>
          <p className={styles.statTrend}>Pendentes de atribuição</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Estágios Ativos</span>
            <span className="material-symbols-outlined">work</span>
          </div>
          <p className={styles.statValue}>{summary.ativos}</p>
          <p className={styles.statTrend}>Em andamento</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Ocupação</span>
            <span className="material-symbols-outlined">analytics</span>
          </div>
          <p className={styles.statValue}>{summary.percentagem}%</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${summary.percentagem}%` }}></div>
          </div>
        </div>
      </div>

      <div className={styles.columns}>
        <div className={styles.leftColumn}>
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>
                <span className="material-symbols-outlined text-primary">list_alt</span>
                Candidaturas Pendentes
              </h3>
              {summary.novos > 0 && <span className={styles.badgeNew}>{summary.novos} NOVOS</span>}
            </div>
            <div className={styles.tableWrapper}>
              {loading.estagios ? (
                <p className={styles.loadingMsg}>A carregar…</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr><th>Estudante</th><th>Entidade Acolhedora</th><th>Área</th><th className={styles.textRight}>Ação</th> </tr>
                  </thead>
                  <tbody>
                    {estagiosFiltrados.length === 0 ? (
                      <tr><td colSpan={4} className={styles.emptyMsg}>Nenhuma candidatura pendente.</td></tr>
                    ) : (
                      estagiosFiltrados.map(e => (
                        <tr key={e.id} onClick={() => setEditUser({ id: e.user_id ?? e.id, name: e.estudante ?? e.nome, email: e.email ?? '', role: e.perfil ?? e.role ?? 'ESTUDANTE' })} className={styles.clickableRow}>
                          <td><div className={styles.userCell}><div className={styles.userInitials}>{getInitials(e.estudante ?? e.nome)}</div><span>{e.estudante ?? e.nome}</span></div></td>
                          <td>{e.entidade}</td>
                          <td><span className={styles.badgeArea}>{e.area}</span></td>
                          <td className={styles.textRight}>
                            <Tooltip text={atribuindo === e.id ? 'A processar…' : `Atribuir tutor a ${e.estudante ?? e.nome}`}>
                              <button className={styles.assignBtn} disabled={atribuindo === e.id} onClick={ev => { ev.stopPropagation(); handleAtribuir(e.id); }}>
                                {atribuindo === e.id ? '…' : 'Atribuir'}
                              </button>
                            </Tooltip>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.editCard}>
            <h3 className={styles.editTitle}>
              <span className="material-symbols-outlined">edit_note</span>
              Editar Registo {editUser.id && <span className={styles.editUserId}> — ID {editUser.id}</span>}
            </h3>
            {editError && <p className={styles.errorMsg}>{editError}</p>}
            {editSuccess && <p className={styles.successMsg}>{editSuccess}</p>}
            <form className={styles.editForm} onSubmit={handleEditSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome Completo</label>
                <input type="text" className={styles.formInput} value={editUser.name} onChange={e => setEditUser(prev => ({ ...prev, name: e.target.value }))} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Institucional</label>
                <input type="email" className={styles.formInput} value={editUser.email} onChange={e => setEditUser(prev => ({ ...prev, email: e.target.value }))} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Perfil de Acesso</label>
                <select className={styles.formSelect} value={editUser.role} onChange={e => setEditUser(prev => ({ ...prev, role: e.target.value }))}>
                  <option value="ESTUDANTE">Estudante</option>
                  <option value="ENTIDADE">Entidade de Acolhimento</option>
                  <option value="ORIENTADOR">Orientador Pedagógico</option>
                  <option value="TUTOR">Tutor</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <Tooltip text={!editUser.id ? 'Selecione um estudante na tabela' : 'Guardar alterações'}>
                  <button type="submit" className={styles.saveBtn} disabled={editLoading || !editUser.id}>{editLoading ? 'A guardar…' : 'Guardar'}</button>
                </Tooltip>
                <Tooltip text="Limpar formulário">
                  <button type="button" className={styles.cancelBtn} onClick={() => setEditUser({ id: null, name: '', email: '', role: 'ESTUDANTE' })}>Cancelar</button>
                </Tooltip>
              </div>
            </form>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryContent}>
              <h3 className={styles.summaryTitle}>Resumo Académico</h3>
              <div className={styles.summaryItems}>
                <div className={styles.summaryItem}><span>Novos Pedidos</span><span className={styles.summaryValue}>{summary.novos}</span></div>
                <div className={styles.summaryItem}><span>Estágios Ativos</span><span className={styles.summaryValue}>{summary.ativos}</span></div>
                <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${summary.percentagem}%` }}></div></div>
                <p className={styles.progressText}>{summary.percentagem}% das vagas preenchidas</p>
              </div>
            </div>
            <div className={styles.summaryGlow}></div>
          </div>
        </div>
      </div>
    </>
  );

  const renderUsers = () => (
    <div className={styles.tableColumn}>
      <div className={styles.tableHeader}>
        <h3 className={styles.tableTitle}>Lista de Tutores</h3>
        <Tooltip text="Criar novo utilizador">
          <button className={styles.newUserBtn} onClick={() => setShowCreateUserModal(true)}>+ Novo Utilizador</button>
        </Tooltip>
      </div>
      {loading.tutores ? (
        <p className={styles.loadingMsg}>A carregar tutores…</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead><tr><th>Nome</th><th>Email</th><th>Perfil</th></tr></thead>
            <tbody>
              {tutoresFiltrados.length === 0 ? (
                <tr><td colSpan={3} className={styles.emptyMsg}>Nenhum tutor encontrado.</td></tr>
              ) : (
                tutoresFiltrados.map(t => (
                  <tr key={t.id}>
                    <td><div className={styles.userCell}><div className={styles.userInitials}>{getInitials(t.name)}</div><span>{t.name}</span></div></td>
                    <td>{t.email}</td>
                    <td><span className={styles.badgeProfile}>Tutor</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderEstagios = () => (
    <div className={styles.tableColumn}>
      <div className={styles.tableHeader}>
        <h3 className={styles.tableTitle}>Lista de Estágios</h3>
        <Tooltip text="Criar nova vaga">
          <button className={styles.newUserBtn} onClick={() => setShowNovaVaga(true)}>+ Nova Vaga</button>
        </Tooltip>
      </div>
      {loading.estagios ? (
        <p className={styles.loadingMsg}>A carregar estágios…</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead><tr><th>Estudante</th><th>Entidade</th><th>Área</th><th>Tutor</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {estagiosFiltrados.length === 0 ? (
                <tr><td colSpan={6} className={styles.emptyMsg}>Nenhum estágio encontrado.</td></tr>
              ) : (
                estagiosFiltrados.map(e => (
                  <tr key={e.id}>
                    <td><div className={styles.userCell}><div className={styles.userInitials}>{getInitials(e.estudante ?? e.nome)}</div><span>{e.estudante ?? e.nome}</span></div></td>
                    <td>{e.entidade}</td>
                    <td><span className={styles.badgeArea}>{e.area}</span></td>
                    <td>{e.tutor?.name ?? '—'}</td>
                    <td><span className={`${styles.badge} ${e.status === 'ATIVO' ? styles.badgeActive : styles.badgeInactive}`}>{e.status ?? 'PENDENTE'}</span></td>
                    <td className={styles.textRight}>
                      <Tooltip text="Atribuir tutor">
                        <button className={styles.assignBtn} onClick={() => handleAtribuir(e.id)} disabled={atribuindo === e.id}>
                          {atribuindo === e.id ? '…' : 'Atribuir'}
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderCartas = () => (
    <div className={styles.tableColumn}>
      <div className={styles.tableHeader}>
        <h3 className={styles.tableTitle}>Gerar Cartas de Estágio</h3>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead><tr><th>Estudante</th><th>Entidade</th><th>Ações</th></tr></thead>
          <tbody>
            {estagiosFiltrados.length === 0 ? (
              <tr><td colSpan={3} className={styles.emptyMsg}>Nenhum estágio disponível.</td></tr>
            ) : (
              estagiosFiltrados.map(e => (
                <tr key={e.id}>
                  <td>{e.estudante ?? e.nome}</td>
                  <td>{e.entidade}</td>
                  <td><Tooltip text="Gerar carta de estágio"><button className={styles.assignBtn} onClick={() => handleGerarCarta(e)}>Gerar Carta</button></Tooltip></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPauta = () => (
    <div className={styles.pautaContainer}>
      <div className={styles.pautaCard}>
        <h3 className={styles.editTitle}>Pauta de Avaliação</h3>
        <p>Exporte a pauta geral dos estágios em formato Excel.</p>
        <div className={styles.formActions}>
          <Tooltip text="Descarregar pauta em Excel">
            <button className={styles.saveBtn} onClick={handleExportarPauta} disabled={loading.pauta}>
              {loading.pauta ? 'A exportar…' : 'Exportar Pauta'}
            </button>
          </Tooltip>
        </div>
      </div>
      <div className={styles.avaliacoesCard}>
        <h3 className={styles.editTitle}>Avaliações Registadas</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead><tr><th>Estudante</th><th>Classificação</th><th>Estado</th></tr></thead>
            <tbody>
              {avaliacoes.length === 0 ? (
                <tr><td colSpan={3} className={styles.emptyMsg}>Nenhuma avaliação registada.</td></tr>
              ) : (
                avaliacoes.map(av => (
                  <tr key={av.id ?? av.estudante}>
                    <td>{av.estudante ?? av.nome}</td>
                    <td className={styles.textCenter}>{av.classificacao ?? av.nota}</td>
                    <td className={styles.textCenter}>
                      <span className={(av.estado ?? '').toUpperCase() === 'REPROVADO' ? styles.badgeReprovado : styles.badgeApproved}>
                        {(av.estado ?? '').toUpperCase() || 'APROVADO'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSigeup = () => (
    <div className={styles.pautaContainer}>
      <div className={styles.pautaCard}>
        <h3 className={styles.editTitle}>Exportar para SIGEUP</h3>
        <p>Gere o ficheiro compatível com o sistema SIGEUP.</p>
        <div className={styles.formActions}>
          <Tooltip text="Exportar dados para SIGEUP">
            <button className={styles.saveBtn} onClick={handleExportarSigeup} disabled={loading.sigeup}>
              {loading.sigeup ? 'A exportar…' : 'Exportar SIGEUP'}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboard}>
      {/* Modals */}
      {showNovaVaga && <NovaVagaModal onClose={() => setShowNovaVaga(false)} onSaved={fetchEstagios} />}
      {showCartaModal && selectedEstagio && (
        <CartaModal estagio={selectedEstagio} onClose={() => setShowCartaModal(false)} onDownload={handleBaixarCarta} />
      )}
      {showCreateUserModal && <CreateUserModal onClose={() => setShowCreateUserModal(false)} onSaved={fetchTutores} />}

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}><span className="material-symbols-outlined">school</span></div>
          <div><h1 className={styles.logoTitle}>Sistema PEP</h1><p className={styles.logoSubtitle}>Coordenação</p></div>
        </div>

        <nav className={styles.nav}>
          {['dashboard', 'users', 'estagios', 'cartas', 'pauta', 'sigeup'].map(view => (
            <a
              key={view}
              href="#"
              className={`${styles.navLink} ${activeView === view ? styles.navLinkActive : ''}`}
              onClick={e => { e.preventDefault(); setActiveView(view); }}
            >
              <span className="material-symbols-outlined">
                {view === 'dashboard' && 'dashboard'}
                {view === 'users' && 'group'}
                {view === 'estagios' && 'work'}
                {view === 'cartas' && 'description'}
                {view === 'pauta' && 'grade'}
                {view === 'sigeup' && 'upload'}
              </span>
              <span>
                {view === 'dashboard' && 'Dashboard'}
                {view === 'users' && 'Utilizadores'}
                {view === 'estagios' && 'Estágios'}
                {view === 'cartas' && 'Cartas'}
                {view === 'pauta' && 'Pauta'}
                {view === 'sigeup' && 'SIGEUP'}
              </span>
            </a>
          ))}
        </nav>

        <div className={styles.supportBox}>
          <div className={styles.supportContent}>
            <p className={styles.supportTitle}>Suporte</p>
            <p className={styles.supportText}>Dúvidas sobre a distribuição? Consulte o manual pedagógico.</p>
          </div>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          <span>Sair</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.searchContainer}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input
              type="text"
              placeholder="Pesquisar alunos ou entidades..."
              className={styles.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.userArea}>
            <Tooltip text="Ver notificações">
              <button className={styles.notificationBtn}>
                <span className="material-symbols-outlined">notifications</span>
                <span className={styles.notificationBadge}></span>
              </button>
            </Tooltip>
            <div className={styles.divider}></div>
            <div className={styles.userInfo}>
              <div className={styles.userText}>
                <p className={styles.userName}>{authUser.name ?? 'Coordenador'}</p>
                <p className={styles.userRole}>Coordenador de Estágios</p>
              </div>
              <div className={styles.avatar}>
                {authUser.avatar ? (
                  <img src={authUser.avatar} alt="Avatar" />
                ) : (
                  <span>{getInitials(authUser.name ?? 'CR')}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className={styles.content}>
          {error && <p className={styles.errorMsg}>{error}</p>}
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'users' && renderUsers()}
          {activeView === 'estagios' && renderEstagios()}
          {activeView === 'cartas' && renderCartas()}
          {activeView === 'pauta' && renderPauta()}
          {activeView === 'sigeup' && renderSigeup()}
        </main>

        <footer className={styles.footer}>
          <p>PEP - Sistema de Gestão de Estágios Profissionalizantes © 2024</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardCoordenador;