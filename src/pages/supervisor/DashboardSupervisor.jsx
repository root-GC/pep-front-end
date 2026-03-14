import React from 'react';
import styles from './css/DashboardSupervisor.module.css';

const DashboardSupervisor = () => {
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
            <input
              type="text"
              placeholder="Buscar aluno ou empresa..."
              className={styles.searchInput}
            />
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
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxyX2zTVOoAhBZ4p_50WM6YuM7v3nSJwELzQTkzHAKOd9avrFaHOJbI8Mu6dr5qBkZJLgg6prqSJjV42TtgssA-xPu4OE8Vz8gJTyz7eb_wYM-jxM9D9eubi-BAUUenDG1HnyHrtJ2Gz1bVz6z-mGTu9DOpjBbmcBToDe5gjGbLr8Z3lAyVI29Ohpt6M3f45uThBBMSb24BAXUGghajmAS_Qm9EyIxBCKy2iBKB2aR0TQ894sttEYcdtksxPScBNBmt-FsPWIunns"
                  alt="Foto do supervisor de estágio"
                />
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
              <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>
                <span className="material-symbols-outlined">dashboard</span>
                Painel de Controle
              </a>
              <a href="#" className={styles.navLink}>
                <span className="material-symbols-outlined">assignment_ind</span>
                Estágios Supervisionados
              </a>
              <a href="#" className={styles.navLink}>
                <span className="material-symbols-outlined">star</span>
                Avaliações
              </a>
            </nav>
          </div>

          <div className={styles.sidebarSection}>
            <p className={styles.sidebarSectionTitle}>Relatórios</p>
            <nav className={styles.sidebarNav}>
              <a href="#" className={styles.navLink}>
                <span className="material-symbols-outlined">history</span>
                Histórico de Alunos
              </a>
              <a href="#" className={styles.navLink}>
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
            <p className={styles.supportText}>
              Consulte o manual do supervisor ou contate o suporte.
            </p>
            <button className={styles.supportBtn}>Suporte PEP</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Highlight Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div>
                <p className={styles.statLabel}>Estágios Ativos</p>
                <p className={styles.statValue}>12</p>
              </div>
              <div className={styles.statIcon}>
                <span className="material-symbols-outlined">groups</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div>
                <p className={styles.statLabel}>Pendências</p>
                <p className={styles.statValue}>45</p>
              </div>
              <div className={styles.statIcon}>
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div>
                <p className={styles.statLabel}>Notas Lançadas</p>
                <p className={styles.statValue}>88</p>
              </div>
              <div className={styles.statIcon}>
                <span className="material-symbols-outlined">fact_check</span>
              </div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>Gestão de Estágios e Documentação</h2>
              <div className={styles.tableActions}>
                <button className={styles.filterBtn}>
                  <span className="material-symbols-outlined">filter_list</span>
                  Filtrar
                </button>
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
                    <th>Instituição Parceira / Empresa</th>
                    <th>Documento</th>
                    <th className={styles.textCenter}>Ações de Documentação</th>
                    <th className={styles.textRight}>Nota Final</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1 */}
                  <tr>
                    <td>
                      <p className={styles.studentName}>João Silva</p>
                      <p className={styles.studentMat}>Mat: 202300452</p>
                    </td>
                    <td>
                      <p className={styles.institution}>Escola Técnica Municipal</p>
                    </td>
                    <td>
                      <span className={`${styles.docBadge} ${styles.docTermo}`}>
                        Termo de Compromisso
                      </span>
                    </td>
                    <td className={styles.textCenter}>
                      <div className={styles.actionButtons}>
                        <button className={`${styles.actionBtn} ${styles.approveBtn}`}>
                          <span className="material-symbols-outlined">check_circle</span>
                          Aprovar
                        </button>
                        <button className={`${styles.actionBtn} ${styles.rejectBtn}`}>
                          <span className="material-symbols-outlined">cancel</span>
                          Rejeitar
                        </button>
                      </div>
                    </td>
                    <td className={styles.textRight}>
                      <div className={styles.gradeInputWrapper}>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          placeholder="--"
                          className={styles.gradeInput}
                        />
                      </div>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr>
                    <td>
                      <p className={styles.studentName}>Maria Oliveira</p>
                      <p className={styles.studentMat}>Mat: 202300918</p>
                    </td>
                    <td>
                      <p className={styles.institution}>Empresa de Tecnologia Integrada</p>
                    </td>
                    <td>
                      <span className={`${styles.docBadge} ${styles.docRelatorio}`}>
                        Relatório Mensal
                      </span>
                    </td>
                    <td className={styles.textCenter}>
                      <div className={styles.actionButtons}>
                        <button className={`${styles.actionBtn} ${styles.approveBtn}`}>
                          <span className="material-symbols-outlined">check_circle</span>
                          Aprovar
                        </button>
                        <button className={`${styles.actionBtn} ${styles.rejectBtn}`}>
                          <span className="material-symbols-outlined">cancel</span>
                          Rejeitar
                        </button>
                      </div>
                    </td>
                    <td className={styles.textRight}>
                      <div className={styles.gradeInputWrapper}>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value="9.5"
                          className={styles.gradeInput}
                          readOnly
                        />
                      </div>
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr>
                    <td>
                      <p className={styles.studentName}>Carlos Santos</p>
                      <p className={styles.studentMat}>Mat: 202300712</p>
                    </td>
                    <td>
                      <p className={styles.institution}>Instituição de Ensino Superior</p>
                    </td>
                    <td>
                      <span className={`${styles.docBadge} ${styles.docPlano}`}>
                        Plano de Atividades
                      </span>
                    </td>
                    <td className={styles.textCenter}>
                      <div className={styles.actionButtons}>
                        <button className={`${styles.actionBtn} ${styles.approveBtn}`}>
                          <span className="material-symbols-outlined">check_circle</span>
                          Aprovar
                        </button>
                        <button className={`${styles.actionBtn} ${styles.rejectBtn}`}>
                          <span className="material-symbols-outlined">cancel</span>
                          Rejeitar
                        </button>
                      </div>
                    </td>
                    <td className={styles.textRight}>
                      <div className={styles.gradeInputWrapper}>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          placeholder="--"
                          className={styles.gradeInput}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.tableFooter}>
              <p className={styles.footerInfo}>Exibindo 3 de 12 registros de estágio ativo</p>
              <div className={styles.pagination}>
                <button className={styles.paginationBtn} disabled>
                  Anterior
                </button>
                <button className={styles.paginationBtn}>Próximo</button>
              </div>
            </div>
          </div>

          {/* Footer Summary Cards */}
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryCardHeader}>
                <span className="material-symbols-outlined text-primary">event_note</span>
                <h3 className={styles.summaryCardTitle}>Próximos Vencimentos</h3>
              </div>
              <ul className={styles.summaryList}>
                <li className={styles.summaryItem}>
                  <span className={styles.summaryItemText}>Relatório Maria Oliveira</span>
                  <span className={`${styles.summaryItemBadge} ${styles.badgeToday}`}>Hoje</span>
                </li>
                <li className={styles.summaryItem}>
                  <span className={styles.summaryItemText}>Termo João Silva</span>
                  <span className={`${styles.summaryItemBadge} ${styles.badgeDays}`}>2 dias</span>
                </li>
              </ul>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryCardHeader}>
                <span className="material-symbols-outlined text-primary">trending_up</span>
                <h3 className={styles.summaryCardTitle}>Média da Turma</h3>
              </div>
              <div className={styles.averageContainer}>
                <p className={styles.averageValue}>8.4</p>
                <span className={styles.averageTrend}>+5% vs semestre anterior</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '84%' }}></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardSupervisor;