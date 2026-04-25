import React, { useState, useEffect } from 'react';
import styles from './css/DashboardTutor.module.css';
import api from '../../api/api.js';                     // mesma instância axios
import { useNavigate } from 'react-router-dom';

// Serviços (caso prefiras ter num ficheiro à parte)
const getMeusEstagios = () => api.get('/tutor/meus-estagios');
const createAvaliacao = (data) => api.post('/tutor/avaliacoes', data);

const MENUS = {
  ESTAGIARIOS: 'estagiarios',
  AVALIACOES: 'avaliacoes',
  CRONOGRAMA: 'cronograma',
  DOCUMENTOS: 'documentos',
};

const DashboardTutor = () => {
  const navigate = useNavigate();

  // --- Navegação ---
  const [activeMenu, setActiveMenu] = useState(MENUS.ESTAGIARIOS);

  // --- Dados ---
  const [estagios, setEstagios] = useState([]);
  const [loadingEstagios, setLoadingEstagios] = useState(false);
  const [errorEstagios, setErrorEstagios] = useState(null);

  // --- Formulário de Avaliação ---
  const [selectedEstagioId, setSelectedEstagioId] = useState('');
  const [periodoInicio, setPeriodoInicio] = useState('');
  const [periodoFim, setPeriodoFim] = useState('');
  const [pontualidade, setPontualidade] = useState('excelente');
  const [competencias, setCompetencias] = useState('atende');
  const [postura, setPostura] = useState('exemplar');
  const [observacoes, setObservacoes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [avaliacaoSucesso, setAvaliacaoSucesso] = useState(false);

  // --- Estatísticas (derivadas) ---
  const totalEstagios = estagios.length;
  const avaliacoesPendentes = 4; // placeholder, se houver endpoint real podemos calcular
  const desempenhoGeral = 88;    // placeholder

  // ==================== FUNÇÕES ====================

  const fetchEstagios = async () => {
    setLoadingEstagios(true);
    setErrorEstagios(null);
    try {
      const { data } = await getMeusEstagios();
      setEstagios(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setErrorEstagios(err.response?.data?.message || 'Erro ao carregar estágios.');
    } finally {
      setLoadingEstagios(false);
    }
  };

  const handleSubmitAvaliacao = async (e) => {
    e.preventDefault();
    if (!selectedEstagioId) {
      alert('Selecione um estagiário.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        estagio_id: selectedEstagioId,
        pontualidade,
        competencias_tecnicas: competencias,
        postura_profissional: postura,
        observacoes,
      };
      await createAvaliacao(payload);
      setAvaliacaoSucesso(true);
      setTimeout(() => setAvaliacaoSucesso(false), 3000);
      // limpar formulário
      setSelectedEstagioId('');
      setPeriodoInicio('');
      setPeriodoFim('');
      setObservacoes('');
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao submeter avaliação.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchEstagios();
  }, []);

  // ==================== LOGOUT ====================
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

  // ==================== RENDER SECÇÕES ====================

  const renderEstagiarios = () => (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Estagiários sob Tutela</h2>
          <p className={styles.pageSubtitle}>
            Gerencie o progresso acadêmico e avalie o desempenho dos seus estudantes em estágio.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>
            <span className="material-symbols-outlined">file_export</span>
            Exportar Lista
          </button>
          <button
            className={styles.newEvaluationBtn}
            onClick={() => setActiveMenu(MENUS.AVALIACOES)}
          >
            <span className="material-symbols-outlined">add</span>
            Nova Avaliação
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Estagiários Vinculados</span>
            <span className="material-symbols-outlined">groups</span>
          </div>
          <p className={styles.statValue}>{loadingEstagios ? '…' : totalEstagios}</p>
          <p className={styles.statTrend}>Estudantes Ativos</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Avaliações Pendentes</span>
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
          <p className={styles.statValue}>{avaliacoesPendentes}</p>
          <p className={`${styles.statTrend} ${styles.urgent}`}>Ação Necessária</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Desempenho Geral</span>
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <p className={styles.statValue}>{desempenhoGeral}%</p>
          <p className={styles.statTrend}>Média da Turma</p>
        </div>
      </div>

      {/* Tabela de Estagiários */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Lista de Estudantes em Estágio</h3>
          <div>
            <select className={styles.filterSelect}>
              <option>Filtrar por Curso</option>
              <option>Engenharia</option>
              <option>Administração</option>
              <option>Informática</option>
            </select>
          </div>
        </div>

        {errorEstagios && (
          <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{errorEstagios}</div>
        )}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome do Estagiário</th>
                <th>Curso / Semestre</th>
                <th>Início do Estágio</th>
                <th>Carga Horária</th>
                <th className={styles.textRight}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loadingEstagios && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>A carregar…</td>
                </tr>
              )}
              {!loadingEstagios && estagios.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>Nenhum estágio atribuído.</td>
                </tr>
              )}
              {estagios.map((estagio) => (
                <tr key={estagio.id}>
                  <td className={styles.studentName}>
                    {estagio.estagiario?.name || estagio.user?.name || '—'}
                  </td>
                  <td>
                    {estagio.curso?.titulo || estagio.curso || '—'} / {estagio.semestre ? `${estagio.semestre}º Sem` : '—'}
                  </td>
                  <td>
                    {estagio.data_inicio
                      ? new Date(estagio.data_inicio).toLocaleDateString('pt-PT')
                      : '—'}
                  </td>
                  <td>
                    <div className={styles.progressBarContainer}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${estagio.progresso || 0}%` }}
                        ></div>
                      </div>
                      <span className={styles.progressText}>{estagio.progresso || 0}%</span>
                    </div>
                  </td>
                  <td className={styles.textRight}>
                    <button className={styles.detailsBtn}>Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderAvaliacoes = () => (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Nova Avaliação de Estágio</h2>
          <p className={styles.pageSubtitle}>
            Submeta o relatório de desempenho do estagiário seleccionado.
          </p>
        </div>
      </div>

      {avaliacaoSucesso && (
        <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          Avaliação submetida com sucesso!
        </div>
      )}

      <div className={styles.formCard}>
        <div className={styles.formCardHeader}>
          <h3 className={styles.formCardTitle}>
            <span className="material-symbols-outlined">rate_review</span>
            Criar Nova Avaliação de Estágio
          </h3>
          <p className={styles.formCardSubtitle}>
            Preencha os critérios abaixo para registrar o desempenho profissional do estudante.
          </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmitAvaliacao}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Estagiário Selecionado</label>
              <select
                className={styles.formSelect}
                value={selectedEstagioId}
                onChange={(e) => setSelectedEstagioId(e.target.value)}
                required
              >
                <option value="">Selecione um estudante...</option>
                {estagios.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.estagiario?.name || est.user?.name || `Estágio #${est.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Período de Referência</label>
              <div className={styles.dateRange}>
                <input
                  type="date"
                  className={styles.formInput}
                  value={periodoInicio}
                  onChange={(e) => setPeriodoInicio(e.target.value)}
                />
                <input
                  type="date"
                  className={styles.formInput}
                  value={periodoFim}
                  onChange={(e) => setPeriodoFim(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.ratingGrid}>
            <div className={styles.ratingGroup}>
              <p className={styles.ratingLabel}>Pontualidade e Assiduidade</p>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="pont" value="regular" className={styles.radio}
                    checked={pontualidade === 'regular'} onChange={() => setPontualidade('regular')} />
                  <span>Regular</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="pont" value="bom" className={styles.radio}
                    checked={pontualidade === 'bom'} onChange={() => setPontualidade('bom')} />
                  <span>Bom</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="pont" value="excelente" className={styles.radio}
                    checked={pontualidade === 'excelente'} onChange={() => setPontualidade('excelente')} />
                  <span>Excelente</span>
                </label>
              </div>
            </div>
            <div className={styles.ratingGroup}>
              <p className={styles.ratingLabel}>Competências Técnicas</p>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="comp" value="em_desenvolvimento" className={styles.radio}
                    checked={competencias === 'em_desenvolvimento'} onChange={() => setCompetencias('em_desenvolvimento')} />
                  <span>Em Desenvolvimento</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="comp" value="atende" className={styles.radio}
                    checked={competencias === 'atende'} onChange={() => setCompetencias('atende')} />
                  <span>Atende as expectativas</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="comp" value="supera" className={styles.radio}
                    checked={competencias === 'supera'} onChange={() => setCompetencias('supera')} />
                  <span>Supera as expectativas</span>
                </label>
              </div>
            </div>
            <div className={styles.ratingGroup}>
              <p className={styles.ratingLabel}>Postura Profissional</p>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="post" value="satisfatorio" className={styles.radio}
                    checked={postura === 'satisfatorio'} onChange={() => setPostura('satisfatorio')} />
                  <span>Satisfatório</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="post" value="exemplar" className={styles.radio}
                    checked={postura === 'exemplar'} onChange={() => setPostura('exemplar')} />
                  <span>Exemplar</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Observações sobre o Desenvolvimento Acadêmico-Profissional</label>
            <textarea
              className={styles.formTextarea}
              placeholder="Descreva os pontos fortes e sugestões de melhoria para a carreira do estagiário..."
              rows="4"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            ></textarea>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setActiveMenu(MENUS.ESTAGIARIOS)}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={submitting}>
              {submitting ? 'A submeter…' : 'Finalizar e Salvar Avaliação'}
            </button>
          </div>
        </form>
      </div>
    </>
  );

  const renderPlaceholder = (titulo) => (
    <div className={styles.pageHeader}>
      <div>
        <h2 className={styles.pageTitle}>{titulo}</h2>
        <p className={styles.pageSubtitle}>Funcionalidade em desenvolvimento.</p>
      </div>
    </div>
  );

  // ==================== RENDER PRINCIPAL ====================
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
            <p className={styles.logoSubtitle}>Dashboard Tutor</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <p className={styles.navLabel}>Navegação Principal</p>
          <a
            href="#"
            className={`${styles.navLink} ${activeMenu === MENUS.ESTAGIARIOS ? styles.navLinkActive : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.ESTAGIARIOS); }}
          >
            <span className="material-symbols-outlined">group</span>
            <span>Estagiários</span>
          </a>
          <a
            href="#"
            className={`${styles.navLink} ${activeMenu === MENUS.AVALIACOES ? styles.navLinkActive : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.AVALIACOES); }}
          >
            <span className="material-symbols-outlined">assignment_turned_in</span>
            <span>Avaliações</span>
          </a>
          <a
            href="#"
            className={`${styles.navLink} ${activeMenu === MENUS.CRONOGRAMA ? styles.navLinkActive : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.CRONOGRAMA); }}
          >
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Cronograma</span>
          </a>
          <a
            href="#"
            className={`${styles.navLink} ${activeMenu === MENUS.DOCUMENTOS ? styles.navLinkActive : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.DOCUMENTOS); }}
          >
            <span className="material-symbols-outlined">description</span>
            <span>Documentos</span>
          </a>
        </nav>

        <div className={styles.supportBox}>
          <div className={styles.supportContent}>
            <p className={styles.supportTitle}>Suporte ao Tutor</p>
            <p className={styles.supportText}>
              Precisa de ajuda com o sistema de notas? Consulte nosso guia.
            </p>
            <button className={styles.supportBtn}>Ver Manual</button>
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
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.searchContainer}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input
              type="text"
              placeholder="Buscar estagiário..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.userArea}>
            <button className={styles.notificationBtn}>
              <span className="material-symbols-outlined">notifications</span>
              <span className={styles.notificationBadge}></span>
            </button>
            <div className={styles.divider}></div>
            <div className={styles.userInfo}>
              <div className={styles.userText}>
                <p className={styles.userName}>Tutor Administrativo</p>
                <p className={styles.userRole}>Gestão de Estágios</p>
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
          {activeMenu === MENUS.ESTAGIARIOS && renderEstagiarios()}
          {activeMenu === MENUS.AVALIACOES && renderAvaliacoes()}
          {activeMenu === MENUS.CRONOGRAMA && renderPlaceholder('Cronograma')}
          {activeMenu === MENUS.DOCUMENTOS && renderPlaceholder('Documentos')}
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>PEP - Sistema de Gestão de Estágios Profissionalizantes © 2023</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardTutor;