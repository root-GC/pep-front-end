import React from 'react';
import styles from './css/DashboardChefe.module.css';

const DashboardChefe = () => {
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
          <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className={styles.navLink}>
            <span className="material-symbols-outlined">group</span>
            <span>Gestão de Utilizadores</span>
          </a>
          <a href="#" className={styles.navLink}>
            <span className="material-symbols-outlined">corporate_fare</span>
            <span>Gestão de Instituições</span>
          </a>
          <a href="#" className={styles.navLink}>
            <span className="material-symbols-outlined">work</span>
            <span>Gestão de Estágios</span>
          </a>

          <div className={styles.navDivider}>
            <a href="#" className={styles.navLink}>
              <span className="material-symbols-outlined">settings</span>
              <span>Configurações</span>
            </a>
          </div>
        </nav>

        <div className={styles.supportBox}>
          <div className={styles.supportContent}>
            <p className={styles.supportTitle}>Suporte Técnico</p>
            <p className={styles.supportText}>Precisa de ajuda com o sistema? Contacte TI.</p>
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
              placeholder="Pesquisar por estagiário ou processo..."
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
                <p className={styles.userName}>Carlos Mendes</p>
                <p className={styles.userRole}>Chefe de Repartição</p>
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

        {/* Main Content Area */}
        <main className={styles.content}>
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
              <button className={styles.newUserBtn}>
                <span className="material-symbols-outlined">person_add</span>
                Novo Utilizador
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Total Utilizadores</span>
                <span className="material-symbols-outlined">group</span>
              </div>
              <p className={styles.statValue}>1,248</p>
              <p className={styles.statTrend}>+12% este mês</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Instituições Parceiras</span>
                <span className="material-symbols-outlined">corporate_fare</span>
              </div>
              <p className={styles.statValue}>42</p>
              <p className={styles.statTrend}>Estável</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Estágios Ativos</span>
                <span className="material-symbols-outlined">work</span>
              </div>
              <p className={styles.statValue}>156</p>
              <p className={styles.statTrend}>+5 esta semana</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Pendências</span>
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
              <p className={styles.statValue}>18</p>
              <p className={`${styles.statTrend} ${styles.urgent}`}>Ação Urgente</p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className={styles.columns}>
            {/* Left column (table) */}
            <div className={styles.leftColumn}>
              {/* Tabs */}
              <div className={styles.tabs}>
                <button className={`${styles.tab} ${styles.tabActive}`}>
                  Gestão de Utilizadores
                </button>
                <button className={styles.tab}>Instituições</button>
                <button className={styles.tab}>Estágios</button>
              </div>

              {/* Table header with filter */}
              <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>Lista de Utilizadores</h3>
                <div>
                  <select className={styles.filterSelect}>
                    <option>Filtrar por Perfil</option>
                    <option>Coordenador</option>
                    <option>Estagiário</option>
                    <option>Supervisor</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Perfil</th>
                      <th>Status</th>
                      <th className={styles.textRight}>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.userInitials}>AS</div>
                          <span>Ana Silva</span>
                        </div>
                      </td>
                      <td>ana.silva@pep.gov.mz</td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeProfile}`}>
                          Coordenador
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeActive}`}>
                          ATIVO
                        </span>
                      </td>
                      <td className={styles.textRight}>
                        <button className={styles.editBtn}>Editar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.userInitials}>JM</div>
                          <span>João Mutola</span>
                        </div>
                      </td>
                      <td>joao.mutola@gmail.com</td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeProfile}`}>
                          Estagiário
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeActive}`}>
                          ATIVO
                        </span>
                      </td>
                      <td className={styles.textRight}>
                        <button className={styles.editBtn}>Editar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.userInitials}>RC</div>
                          <span>Ricardo Chongo</span>
                        </div>
                      </td>
                      <td>r.chongo@empresa.co.mz</td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeProfile}`}>
                          Supervisor
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeInactive}`}>
                          INATIVO
                        </span>
                      </td>
                      <td className={styles.textRight}>
                        <button className={styles.editBtn}>Editar</button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Pagination */}
                <div className={styles.pagination}>
                  <span className={styles.paginationInfo}>
                    Mostrando 3 de 1,248 utilizadores
                  </span>
                  <div className={styles.paginationControls}>
                    <button className={styles.paginationBtn}>Anterior</button>
                    <button className={`${styles.paginationBtn} ${styles.paginationBtnActive}`}>
                      1
                    </button>
                    <button className={styles.paginationBtn}>Próximo</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column (metrics & promo) */}
            <div className={styles.rightColumn}>
              <div className={styles.metricsCard}>
                <h3 className={styles.metricsTitle}>
                  <span className="material-symbols-outlined">analytics</span>
                  Métricas Rápidas
                </h3>
                <div className={styles.metricsList}>
                  <div className={styles.metricItem}>
                    <span>Taxa de Ocupação</span>
                    <span className={styles.metricValue}>82%</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span>Vagas Críticas</span>
                    <span className={`${styles.metricValue} ${styles.critical}`}>12</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span>Novas Entidades</span>
                    <span className={styles.metricValue}>+4</span>
                  </div>
                </div>
              </div>

              <div className={styles.promoCard}>
                <div className={styles.promoContent}>
                  <h3 className={styles.promoTitle}>Relatórios Mensais</h3>
                  <p className={styles.promoText}>
                    O relatório consolidado de Julho já está disponível para exportação.
                  </p>
                  <button className={styles.promoBtn}>Baixar Agora</button>
                </div>
                <div className={styles.promoGlow}></div>
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
  );
};

export default DashboardChefe;