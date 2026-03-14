import React from 'react';
import styles from './css/DashboardTutor.module.css';

const DashboardTutor = () => {
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
          <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>
            <span className="material-symbols-outlined">group</span>
            <span>Estagiários</span>
          </a>
          <a href="#" className={styles.navLink}>
            <span className="material-symbols-outlined">assignment_turned_in</span>
            <span>Avaliações</span>
          </a>
          <a href="#" className={styles.navLink}>
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Cronograma</span>
          </a>
          <a href="#" className={styles.navLink}>
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

        {/* Content */}
        <main className={styles.content}>
          {/* Welcome Section */}
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
              <button className={styles.newEvaluationBtn}>
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
              <p className={styles.statValue}>12</p>
              <p className={styles.statTrend}>Estudantes Ativos</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Avaliações Pendentes</span>
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
              <p className={styles.statValue}>04</p>
              <p className={`${styles.statTrend} ${styles.urgent}`}>Ação Necessária</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Desempenho Geral</span>
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <p className={styles.statValue}>88%</p>
              <p className={styles.statTrend}>Média da Turma</p>
            </div>
          </div>

          {/* Table Section */}
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
                  <tr>
                    <td className={styles.studentName}>João Silva Fernandes</td>
                    <td>Engenharia - 8º Sem</td>
                    <td>10/01/2024</td>
                    <td>
                      <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{ width: '75%' }}></div>
                        </div>
                        <span className={styles.progressText}>75%</span>
                      </div>
                    </td>
                    <td className={styles.textRight}>
                      <button className={styles.detailsBtn}>Detalhes</button>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.studentName}>Maria Clara Oliveira</td>
                    <td>Administração - 6º Sem</td>
                    <td>15/02/2024</td>
                    <td>
                      <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{ width: '40%' }}></div>
                        </div>
                        <span className={styles.progressText}>40%</span>
                      </div>
                    </td>
                    <td className={styles.textRight}>
                      <button className={styles.detailsBtn}>Detalhes</button>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.studentName}>Lucas Santos Lima</td>
                    <td>Informática - 7º Sem</td>
                    <td>01/03/2024</td>
                    <td>
                      <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{ width: '22%' }}></div>
                        </div>
                        <span className={styles.progressText}>22%</span>
                      </div>
                    </td>
                    <td className={styles.textRight}>
                      <button className={styles.detailsBtn}>Detalhes</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Section: Create Assessment */}
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
            <form className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Estagiário Selecionado</label>
                  <select className={styles.formSelect} defaultValue="">
                    <option value="" disabled>Selecione um estudante...</option>
                    <option>João Silva Fernandes</option>
                    <option>Maria Clara Oliveira</option>
                    <option>Lucas Santos Lima</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Período de Referência</label>
                  <div className={styles.dateRange}>
                    <input type="date" className={styles.formInput} />
                    <input type="date" className={styles.formInput} />
                  </div>
                </div>
              </div>

              <div className={styles.ratingGrid}>
                <div className={styles.ratingGroup}>
                  <p className={styles.ratingLabel}>Pontualidade e Assiduidade</p>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="pont" className={styles.radio} />
                      <span>Regular</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="pont" className={styles.radio} />
                      <span>Bom</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="pont" defaultChecked className={styles.radio} />
                      <span>Excelente</span>
                    </label>
                  </div>
                </div>
                <div className={styles.ratingGroup}>
                  <p className={styles.ratingLabel}>Competências Técnicas</p>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="hab" className={styles.radio} />
                      <span>Em Desenvolvimento</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="hab" defaultChecked className={styles.radio} />
                      <span>Atende as expectativas</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="hab" className={styles.radio} />
                      <span>Supera as expectativas</span>
                    </label>
                  </div>
                </div>
                <div className={styles.ratingGroup}>
                  <p className={styles.ratingLabel}>Postura Profissional</p>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="comp" className={styles.radio} />
                      <span>Satisfatório</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="comp" defaultChecked className={styles.radio} />
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
                ></textarea>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.saveBtn}>Finalizar e Salvar Avaliação</button>
              </div>
            </form>
          </div>
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