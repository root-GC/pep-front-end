import React from 'react';
import styles from './css/DashboardCoordenador.module.css';

const DashboardCoordenador = () => {
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
            <p className={styles.logoSubtitle}>Coordenação</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <a href="#" className={styles.navLink}>
            <span className="material-symbols-outlined">group</span>
            <span>Utilizadores</span>
          </a>
          <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>
            <span className="material-symbols-outlined">work</span>
            <span>Estágios</span>
          </a>
          <a href="#" className={styles.navLink}>
            <span className="material-symbols-outlined">grade</span>
            <span>Notas Académicas</span>
          </a>
        </nav>

        <div className={styles.supportBox}>
          <div className={styles.supportContent}>
            <p className={styles.supportTitle}>Suporte</p>
            <p className={styles.supportText}>
              Dúvidas sobre a distribuição? Consulte o manual pedagógico.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.searchContainer}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input
              type="text"
              placeholder="Pesquisar alunos ou entidades..."
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
                <p className={styles.userName}>Prof. Ricardo Lopes</p>
                <p className={styles.userRole}>Coordenador de Estágios</p>
              </div>
              <div className={styles.avatar}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQFC6geurPsPYoNB2hsYSn9aH1sHk0Ngml1FWF47-499NETwAuFYsWn5R-nZMh61ZifBi8jvxJUDenGnsFobGntG1xRVi7UPAnet5bQPLiB6u763KPI5Hie8DaOZIl2uZhFUR41lpQlEuAraHSWP1wgKZNQ98O4CQ2_EyCaeF6OqwEPvNVtBJpEXUgR6ovf7d_u0hY54xPJjy3KpioEew_Z6i-c3qXlTpbmOKcXgcvMHH1ivoZnS4--AXRkzo2DdCDSnPvigRb1rw"
                  alt="Avatar"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <div>
              <h2 className={styles.pageTitle}>Gestão de Estágios</h2>
              <p className={styles.pageSubtitle}>
                Atribua vagas e acompanhe o progresso formativo dos estudantes.
              </p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.filterBtn}>
                <span className="material-symbols-outlined">filter_list</span>
                Filtrar
              </button>
              <button className={styles.newVagaBtn}>
                <span className="material-symbols-outlined">add</span>
                Nova Vaga
              </button>
            </div>
          </div>

          {/* Two-column grid */}
          <div className={styles.columns}>
            {/* Left column - tables */}
            <div className={styles.leftColumn}>
              {/* Candidaturas Pendentes */}
              <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <h3 className={styles.tableTitle}>
                    <span className="material-symbols-outlined text-primary">list_alt</span>
                    Candidaturas Pendentes
                  </h3>
                  <span className={styles.badgeNew}>12 NOVOS</span>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Estudante</th>
                        <th>Entidade Acolhedora</th>
                        <th>Área de Estágio</th>
                        <th className={styles.textRight}>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.userInitials}>JS</div>
                            <span>João Silva</span>
                          </div>
                        </td>
                        <td>Tech Solutions Lda.</td>
                        <td>
                          <span className={styles.badgeArea}>Software</span>
                        </td>
                        <td className={styles.textRight}>
                          <button className={styles.assignBtn}>Atribuir</button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.userInitials}>MS</div>
                            <span>Maria Santos</span>
                          </div>
                        </td>
                        <td>Global Build IT</td>
                        <td>
                          <span className={styles.badgeArea}>Eng. Civil</span>
                        </td>
                        <td className={styles.textRight}>
                          <button className={styles.assignBtn}>Atribuir</button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.userInitials}>PC</div>
                            <span>Pedro Costa</span>
                          </div>
                        </td>
                        <td>Finance Corp S.A.</td>
                        <td>
                          <span className={styles.badgeArea}>Gestão</span>
                        </td>
                        <td className={styles.textRight}>
                          <button className={styles.assignBtn}>Atribuir</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Avaliações Pedagógicas */}
              <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <h3 className={styles.tableTitle}>
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    Avaliações Pedagógicas
                  </h3>
                  <button className={styles.exportBtn}>
                    <span className="material-symbols-outlined">download</span>
                    Exportar Pautas
                  </button>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Estudante</th>
                        <th className={styles.textCenter}>Classificação Final</th>
                        <th className={styles.textCenter}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Ana Oliveira</td>
                        <td className={`${styles.textCenter} ${styles.gradeValue}`}>18.4</td>
                        <td className={styles.textCenter}>
                          <span className={styles.badgeApproved}>APROVADO</span>
                        </td>
                      </tr>
                      <tr>
                        <td>Bruno Mendes</td>
                        <td className={`${styles.textCenter} ${styles.gradeValue}`}>16.2</td>
                        <td className={styles.textCenter}>
                          <span className={styles.badgeApproved}>APROVADO</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right column - form and summary */}
            <div className={styles.rightColumn}>
              {/* Edit Form */}
              <div className={styles.editCard}>
                <h3 className={styles.editTitle}>
                  <span className="material-symbols-outlined">edit_note</span>
                  Editar Registo
                </h3>
                <form className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nome Completo</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      defaultValue="João Silva"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Institucional</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      defaultValue="joao.silva@pep.edu"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Perfil de Acesso</label>
                    <select className={styles.formSelect} defaultValue="Estudante">
                      <option>Estudante</option>
                      <option>Entidade de Acolhimento</option>
                      <option>Orientador Pedagógico</option>
                    </select>
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.saveBtn}>Guardar</button>
                    <button type="button" className={styles.cancelBtn}>Cancelar</button>
                  </div>
                </form>
              </div>

              {/* Summary Card */}
              <div className={styles.summaryCard}>
                <div className={styles.summaryContent}>
                  <h3 className={styles.summaryTitle}>Sumário Académico</h3>
                  <div className={styles.summaryItems}>
                    <div className={styles.summaryItem}>
                      <span>Novos Pedidos</span>
                      <span className={styles.summaryValue}>12</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span>Estágios Ativos</span>
                      <span className={styles.summaryValue}>145</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '65%' }}></div>
                    </div>
                    <p className={styles.progressText}>65% das vagas do semestre preenchidas</p>
                  </div>
                </div>
                <div className={styles.summaryGlow}></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardCoordenador;