import React, { useState, useEffect } from 'react';
import styles from './css/DashboardSupervisor.module.css';
import api from '../../api/api.js';                     // instância axios
import { useNavigate } from 'react-router-dom';

// ==================== MENUS ====================
const MENUS = {
  DASHBOARD: 'dashboard',
  ESTAGIOS: 'estagios',
  AVALIACOES: 'avaliacoes',
  HISTORICO: 'historico',
  ESTATISTICAS: 'estatisticas',
};

const DashboardSupervisor = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(MENUS.DASHBOARD);

  // --- Dados ---
  const [estagios, setEstagios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Estados para operações ---
  const [processandoDoc, setProcessandoDoc] = useState(null); // id do estágio
  const [salvandoNota, setSalvandoNota] = useState(null);      // id do estágio

  // --- Logout ---
  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.warn('Falha ao comunicar logout com servidor', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // ==================== API ====================
  const fetchMeusEstagios = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/supervisor/meus-estagios');
      setEstagios(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar estágios.');
    } finally {
      setLoading(false);
    }
  };

  // Aprovar documento
  const handleAprovar = async (estagioId, documentoId) => {
    if (!documentoId) return alert('Nenhum documento associado.');
    setProcessandoDoc(estagioId);
    try {
      await api.put(`/supervisor/documentos/${documentoId}/aprovar`);
      alert('Documento aprovado com sucesso.');
      fetchMeusEstagios();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao aprovar documento.');
    } finally {
      setProcessandoDoc(null);
    }
  };

  // Rejeitar documento
  const handleRejeitar = async (estagioId, documentoId) => {
    if (!documentoId) return alert('Nenhum documento associado.');
    setProcessandoDoc(estagioId);
    try {
      await api.put(`/supervisor/documentos/${documentoId}/rejeitar`);
      alert('Documento rejeitado.');
      fetchMeusEstagios();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao rejeitar documento.');
    } finally {
      setProcessandoDoc(null);
    }
  };

  // Registar nota final
  const handleSalvarNota = async (estagioId) => {
    const input = document.getElementById(`nota-${estagioId}`);
    const nota = parseFloat(input?.value);
    if (isNaN(nota) || nota < 0 || nota > 20) {
      return alert('Insira uma nota válida entre 0 e 20.');
    }
    setSalvandoNota(estagioId);
    try {
      await api.post(`/supervisor/estagios/${estagioId}/nota-final`, { nota_final: nota });
      alert('Nota final registada com sucesso!');
      fetchMeusEstagios();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao registar nota.');
    } finally {
      setSalvandoNota(null);
    }
  };

  useEffect(() => { fetchMeusEstagios(); }, []);

  // ==================== DERIVED STATS ====================
  const totalEstagios = estagios.length;
  const pendentes = estagios.filter(e => e.documento?.status === 'pendente').length; // ajuste conforme a resposta real
  const notasLancadas = estagios.filter(e => e.nota_final !== null && e.nota_final !== undefined).length;

  // ==================== RENDER ====================
  const renderPlaceholder = (titulo) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{titulo}</h2>
      <p style={{ color: 'var(--slate-500)' }}>Funcionalidade em desenvolvimento.</p>
    </div>
  );

  const renderDashboard = () => (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <p className={styles.statLabel}>Estágios Ativos</p>
            <p className={styles.statValue}>{totalEstagios}</p>
          </div>
          <div className={styles.statIcon}><span className="material-symbols-outlined">groups</span></div>
        </div>
        <div className={styles.statCard}>
          <div>
            <p className={styles.statLabel}>Pendências</p>
            <p className={styles.statValue}>{pendentes}</p>
          </div>
          <div className={styles.statIcon}><span className="material-symbols-outlined">pending_actions</span></div>
        </div>
        <div className={styles.statCard}>
          <div>
            <p className={styles.statLabel}>Notas Lançadas</p>
            <p className={styles.statValue}>{notasLancadas}</p>
          </div>
          <div className={styles.statIcon}><span className="material-symbols-outlined">fact_check</span></div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Gestão de Estágios e Documentação</h2>
          <div className={styles.tableActions}>
            <button className={styles.exportBtn}>
              <span className="material-symbols-outlined">download</span>
              Exportar
            </button>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Estudante</th>
                <th>Instituição</th>
                <th>Documento</th>
                <th className={styles.textCenter}>Ações do Documento</th>
                <th className={styles.textRight}>Nota Final</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>A carregar…</td></tr>
              )}
              {!loading && estagios.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhum estágio atribuído.</td></tr>
              )}
              {estagios.map((est) => {
                const doc = est.documento; // assumindo que cada estágio tem um objeto 'documento'
                const docId = doc?.id;
                const docTipo = doc?.tipo?.toLowerCase(); // 'termo', 'relatorio', 'plano', etc.
                const docStatus = doc?.status?.toLowerCase();
                const docClasse = docTipo === 'termo' ? styles.docTermo
                  : docTipo === 'relatorio' ? styles.docRelatorio
                  : docTipo === 'plano' ? styles.docPlano
                  : styles.docRelatorio;

                return (
                  <tr key={est.id}>
                    <td>
                      <p className={styles.studentName}>{est.estagiario?.name || est.user?.name || '—'}</p>
                      <p className={styles.studentMat}>Mat: {est.estagiario?.matricula || '—'}</p>
                    </td>
                    <td><p className={styles.institution}>{est.instituicao?.nome || est.instituicao?.name || '—'}</p></td>
                    <td>
                      <span className={`${styles.docBadge} ${docClasse}`}>
                        {doc?.tipo || 'Documento'}
                      </span>
                    </td>
                    <td className={styles.textCenter}>
                      {doc ? (
                        <div className={styles.actionButtons}>
                          <button
                            className={`${styles.actionBtn} ${styles.approveBtn}`}
                            onClick={() => handleAprovar(est.id, docId)}
                            disabled={processandoDoc === est.id}
                          >
                            <span className="material-symbols-outlined">check_circle</span>
                            {processandoDoc === est.id ? '…' : 'Aprovar'}
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.rejectBtn}`}
                            onClick={() => handleRejeitar(est.id, docId)}
                            disabled={processandoDoc === est.id}
                          >
                            <span className="material-symbols-outlined">cancel</span>
                            {processandoDoc === est.id ? '…' : 'Rejeitar'}
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Nenhum documento</span>
                      )}
                    </td>
                    <td className={styles.textRight}>
                      <div className={styles.gradeInputWrapper}>
                        <input
                          id={`nota-${est.id}`}
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          className={styles.gradeInput}
                          defaultValue={est.nota_final ?? ''}
                          readOnly={est.nota_final !== null && est.nota_final !== undefined}
                          placeholder="--"
                        />
                        {(!est.nota_final) && (
                          <button
                            className={styles.saveGradeBtn}
                            onClick={() => handleSalvarNota(est.id)}
                            disabled={salvandoNota === est.id}
                            style={{ marginLeft: '0.5rem' }}
                          >
                            {salvandoNota === est.id ? '…' : 'Guardar'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={styles.tableFooter}>
          <p className={styles.footerInfo}>
            Mostrando {estagios.length} estágio(s) sob sua supervisão
          </p>
          <div className={styles.pagination}>
            <button className={styles.paginationBtn} disabled>1 de 1</button>
          </div>
        </div>
      </div>

      {/* Resumos */}
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <span className="material-symbols-outlined text-primary">event_note</span>
            <h3 className={styles.summaryCardTitle}>Próximos Passos</h3>
          </div>
          <ul className={styles.summaryList}>
            <li className={styles.summaryItem}>
              <span className={styles.summaryItemText}>Documentos pendentes</span>
              <span className={`${styles.summaryItemBadge} ${styles.badgeToday}`}>{pendentes}</span>
            </li>
            <li className={styles.summaryItem}>
              <span className={styles.summaryItemText}>Notas por lançar</span>
              <span className={`${styles.summaryItemBadge} ${styles.badgeDays}`}>{totalEstagios - notasLancadas}</span>
            </li>
          </ul>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <span className="material-symbols-outlined text-primary">trending_up</span>
            <h3 className={styles.summaryCardTitle}>Média da Turma</h3>
          </div>
          <div className={styles.averageContainer}>
            <p className={styles.averageValue}>
              {notasLancadas > 0
                ? (estagios.reduce((sum, e) => sum + (parseFloat(e.nota_final) || 0), 0) / notasLancadas).toFixed(1)
                : '—'}
            </p>
            <span className={styles.averageTrend}>notas registadas</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(notasLancadas / Math.max(1, totalEstagios)) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <span className="material-symbols-outlined">school</span>
          </div>
          <h1 className={styles.headerTitle}>Sistema PEP</h1>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchBar}>
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Buscar aluno ou empresa..." className={styles.searchInput} />
          </div>
          <div className={styles.userActions}>
            <button className={styles.notificationBtn}>
              <span className="material-symbols-outlined">notifications</span>
              <span className={styles.notificationBadge}></span>
            </button>
            <div className={styles.userInfo}>
              <div className={styles.userText}>
                <p className={styles.userName}>Ricardo Souza</p>
                <p className={styles.userRole}>Supervisor de Estágio</p>
              </div>
              <div className={styles.avatar}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxyX2zTVOoAhBZ4p_50WM6YuM7v3nSJwELzQTkzHAKOd9avrFaHOJbI8Mu6dr5qBkZJLgg6prqSJjV42TtgssA-xPu4OE8Vz8gJTyz7eb_wYM-jxM9D9eubi-BAUUenDG1HnyHrtJ2Gz1bVz6z-mGTu9DOpjBbmcBToDe5gjGbLr8Z3lAyVI29Ohpt6M3f45uThBBMSb24BAXUGghajmAS_Qm9EyIxBCKy2iBKB2aR0TQ894sttEYcdtksxPScBNBmt-FsPWIunns" alt="Foto do supervisor" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <p className={styles.sidebarSectionTitle}>Menu Principal</p>
            <nav className={styles.sidebarNav}>
              <a href="#" className={`${styles.navLink} ${activeMenu === MENUS.DASHBOARD ? styles.navLinkActive : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.DASHBOARD); }}>
                <span className="material-symbols-outlined">dashboard</span>
                Painel de Controle
              </a>
              <a href="#" className={`${styles.navLink} ${activeMenu === MENUS.ESTAGIOS ? styles.navLinkActive : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.ESTAGIOS); }}>
                <span className="material-symbols-outlined">assignment_ind</span>
                Estágios Supervisionados
              </a>
              <a href="#" className={`${styles.navLink} ${activeMenu === MENUS.AVALIACOES ? styles.navLinkActive : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.AVALIACOES); }}>
                <span className="material-symbols-outlined">star</span>
                Avaliações
              </a>
            </nav>
          </div>

          <div className={styles.sidebarSection}>
            <p className={styles.sidebarSectionTitle}>Relatórios</p>
            <nav className={styles.sidebarNav}>
              <a href="#" className={`${styles.navLink} ${activeMenu === MENUS.HISTORICO ? styles.navLinkActive : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.HISTORICO); }}>
                <span className="material-symbols-outlined">history</span>
                Histórico de Alunos
              </a>
              <a href="#" className={`${styles.navLink} ${activeMenu === MENUS.ESTATISTICAS ? styles.navLinkActive : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.ESTATISTICAS); }}>
                <span className="material-symbols-outlined">analytics</span>
                Estatísticas
              </a>
            </nav>
          </div>

          <div className={styles.supportCard}>
            <div className={styles.supportHeader}>
              <span className="material-symbols-outlined">help</span>
              <p className={styles.supportTitle}>Precisa de ajuda?</p>
            </div>
            <p className={styles.supportText}>Consulte o manual do supervisor ou contate o suporte.</p>
            <button className={styles.supportBtn}>Suporte PEP</button>
          </div>

          {/* Botão Sair */}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            <span>Sair</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {activeMenu === MENUS.DASHBOARD && renderDashboard()}
          {activeMenu === MENUS.ESTAGIOS && renderDashboard()} {/* Pode redirecionar para mesma view */}
          {activeMenu === MENUS.AVALIACOES && renderPlaceholder('Avaliações')}
          {activeMenu === MENUS.HISTORICO && renderPlaceholder('Histórico de Alunos')}
          {activeMenu === MENUS.ESTATISTICAS && renderPlaceholder('Estatísticas')}
        </main>
      </div>
    </div>
  );
};

export default DashboardSupervisor;