import React from 'react';
import styles from './css/DashboardEstagiario.module.css';

const DashboardEstagiario = () => {
  return (
    <div className={styles.dashboard}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <span className="material-symbols-outlined">school</span>
          </div>
          <h2 className={styles.headerTitle}>PEP - Portal do Estagiário</h2>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.headerActions}>
            <button className={styles.iconButton}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className={styles.iconButton}>
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div
            className={styles.profileImage}
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBwci8-7H4g28iOH3MT_MuJINhygHYZdc4MDGgBosOtSA6KJeh2Pg7KNAi2Dqy5n4R148N6JWIkXzcoxXR4-j5bHpwcY_CBLJr-4gMhhPyASTMqWd_G778_HIhCcUgjDV8Jbg_JdupHaECa4W5lrSKtftnvKBnQQHYEr2kk74OWpNUA7PQ-ME_79jBTVChG1BPjqTxA-rGgKMUzlitUMSoofvjidUOMXPB3JHciC560BCeU8TPvfqp3Qr8QhRuIRMFg5A5HzdW-vPM')",
            }}
          />
        </div>
      </header>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarMenu}>
            <p className={styles.menuLabel}>Menu Principal</p>
            <a href="#" className={`${styles.menuItem} ${styles.menuItemActive}`}>
              <span className="material-symbols-outlined">school</span>
              <span>Meu Estágio</span>
            </a>
            <a href="#" className={styles.menuItem}>
              <span className="material-symbols-outlined">description</span>
              <span>Documentos</span>
            </a>
          </div>
          <div className={styles.sidebarFooter}>
            <div className={styles.userInfo}>
              <div className={styles.userDetails}>
                <p className={styles.userName}>Lucas Oliveira</p>
                <p className={styles.userRole}>Estagiário de Educação</p>
              </div>
              <button className={styles.logoutBtn}>
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Dashboard do Estagiário</h1>
            <p className={styles.pageSubtitle}>
              Bem-vindo de volta! Acompanhe seus documentos acadêmicos e detalhes do contrato.
            </p>
          </div>

          {/* Stage Info Card */}
          <section className={styles.infoCard}>
            <div className={styles.infoCardContent}>
              <div className={styles.infoCardHeader}>
                <span className="material-symbols-outlined text-primary">info</span>
                <h2 className={styles.infoCardTitle}>Informações do Plano de Estágio</h2>
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <p className={styles.infoLabel}>Orientador Acadêmico</p>
                  <p className={styles.infoValue}>Prof. João Silva</p>
                </div>
                <div className={styles.infoItem}>
                  <p className={styles.infoLabel}>Carga Horária</p>
                  <p className={styles.infoValue}>30h semanais</p>
                </div>
                <div className={styles.infoItem}>
                  <p className={styles.infoLabel}>Data de Início</p>
                  <p className={styles.infoValue}>01/02/2024</p>
                </div>
                <div className={styles.infoItem}>
                  <p className={styles.infoLabel}>Previsão de Conclusão</p>
                  <p className={styles.infoValue}>31/12/2024</p>
                </div>
              </div>
            </div>
            <div className={styles.infoCardAction}>
              <button className={styles.contractBtn}>Ver Detalhes do Contrato</button>
            </div>
          </section>

          {/* Two-column layout */}
          <div className={styles.columns}>
            {/* Left column - Document Upload */}
            <div className={styles.uploadColumn}>
              <div className={styles.uploadCard}>
                <h3 className={styles.uploadTitle}>
                  <span className="material-symbols-outlined text-primary">upload_file</span>
                  Enviar Documento
                </h3>
                <div className={styles.uploadForm}>
                  <div className={styles.dropzone}>
                    <span className={`material-symbols-outlined ${styles.dropzoneIcon}`}>
                      cloud_upload
                    </span>
                    <p className={styles.dropzoneText}>
                      Arraste ou clique para selecionar um arquivo
                    </p>
                    <p className={styles.dropzoneHint}>PDF, JPG ou PNG (Max 5MB)</p>
                  </div>
                  <div className={styles.selectGroup}>
                    <label className={styles.selectLabel}>Tipo de Documento</label>
                    <select className={styles.select} defaultValue="Termo de Compromisso">
                      <option>Termo de Compromisso</option>
                      <option>Relatório de Atividades</option>
                      <option>Comprovante de Matrícula</option>
                      <option>Plano de Atividades</option>
                    </select>
                  </div>
                  <button className={styles.uploadBtn}>Enviar Documento</button>
                </div>
              </div>
            </div>

            {/* Right column - Documents Table */}
            <div className={styles.tableColumn}>
              <div className={styles.tableCard}>
                <div className={styles.tableCardHeader}>
                  <h3 className={styles.tableCardTitle}>
                    <span className="material-symbols-outlined text-primary">history</span>
                    Documentos Enviados
                  </h3>
                  <button className={styles.viewAllBtn}>Ver todos</button>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Documento</th>
                        <th>Enviado em</th>
                        <th className={styles.textCenter}>Status</th>
                        <th className={styles.textRight}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className={styles.documentCell}>
                            <span className="material-symbols-outlined text-blue-500">
                              picture_as_pdf
                            </span>
                            <span>Termo_Assinado.pdf</span>
                          </div>
                        </td>
                        <td>15/02/2024</td>
                        <td className={styles.textCenter}>
                          <span className={`${styles.statusBadge} ${styles.statusValidated}`}>
                            Validado
                          </span>
                        </td>
                        <td className={styles.textRight}>
                          <button className={styles.actionBtn}>
                            <span className="material-symbols-outlined">download</span>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className={styles.documentCell}>
                            <span className="material-symbols-outlined text-blue-500">
                              picture_as_pdf
                            </span>
                            <span>Relatorio_Atividades_Jan.pdf</span>
                          </div>
                        </td>
                        <td>02/02/2024</td>
                        <td className={styles.textCenter}>
                          <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                            Em Análise
                          </span>
                        </td>
                        <td className={styles.textRight}>
                          <button className={styles.actionBtn}>
                            <span className="material-symbols-outlined">download</span>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className={styles.documentCell}>
                            <span className="material-symbols-outlined text-blue-500">
                              picture_as_pdf
                            </span>
                            <span>Comprovante_Matricula.pdf</span>
                          </div>
                        </td>
                        <td>28/01/2024</td>
                        <td className={styles.textCenter}>
                          <span className={`${styles.statusBadge} ${styles.statusValidated}`}>
                            Validado
                          </span>
                        </td>
                        <td className={styles.textRight}>
                          <button className={styles.actionBtn}>
                            <span className="material-symbols-outlined">download</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardEstagiario;