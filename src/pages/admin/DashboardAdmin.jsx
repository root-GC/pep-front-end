import React from "react";
import "./css/Dashboard.css";

const DashboardAdmin = () => {
  return (
    
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <div className="logo-icon">
            <span className="material-symbols-outlined">school</span>
          </div>
          <h2 className="logo-text">PEP - Gestão de Estágios</h2>
        </div>

        <div className="header-actions">
          <div className="search-bar">
            <span className="material-symbols-outlined search-icon">
              search
            </span>
            <input
              type="text"
              placeholder="Pesquisar..."
              className="search-input"
            />
          </div>

          <div className="action-buttons">
            <button className="icon-button">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="icon-button">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main container with sidebar and content */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <p className="nav-section-title">Menu Principal</p>
            <a href="#" className="nav-item active">
              <span className="material-symbols-outlined">group</span>
              <span>Utilizadores</span>
            </a>
            <a href="#" className="nav-item">
              <span className="material-symbols-outlined">class</span>
              <span>Cursos</span>
            </a>
            <a href="#" className="nav-item">
              <span className="material-symbols-outlined">corporate_fare</span>
              <span>Instituições de Ensino</span>
            </a>
            <a href="#" className="nav-item">
              <span className="material-symbols-outlined">history_edu</span>
              <span>Logs de Atividade</span>
            </a>
            <a href="#" className="nav-item">
              <span className="material-symbols-outlined">badge</span>
              <span>Orientadores</span>
            </a>
          </nav>

          <div className="status-card">
            <p className="status-title">Status da Plataforma</p>
            <div className="status-indicator">
              <span className="status-dot"></span>
              <p className="status-text">Ambiente Online</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="content">
          {/* Quick stats */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="material-symbols-outlined">person</span>
                <span className="stat-label">Total</span>
              </div>
              <p className="stat-value">1,250</p>
              <p className="stat-description">Estagiários Registrados</p>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="material-symbols-outlined">library_books</span>
                <span className="stat-label">Ativos</span>
              </div>
              <p className="stat-value">45</p>
              <p className="stat-description">Cursos de Estágio</p>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="material-symbols-outlined">school</span>
                <span className="stat-label">Escolas</span>
              </div>
              <p className="stat-value">12</p>
              <p className="stat-description">Instituições Ativas</p>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="material-symbols-outlined">monitoring</span>
                <span className="stat-label">Logs</span>
              </div>
              <p className="stat-value">156</p>
              <p className="stat-description">Atividades de Hoje</p>
            </div>
          </section>

          {/* Two‑column layout: table + form */}
          <div className="content-grid">
            {/* User table section */}
            <section className="table-section">
              <div className="section-header">
                <h3 className="section-title">
                  Gestão de Estagiários e Utilizadores
                </h3>
                <button className="btn btn-primary btn-small">
                  <span className="material-symbols-outlined">person_add</span>
                  Novo Utilizador
                </button>
              </div>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email Acadêmico</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="cell-name">João Silva</td>
                      <td className="cell-email">joao@estagio.pep.pt</td>
                      <td>
                        <span className="badge badge-active">Em Estágio</span>
                      </td>
                      <td>
                        <div className="action-cell">
                          <button className="icon-btn" title="Editar Perfil">
                            <span className="material-symbols-outlined">
                              edit
                            </span>
                          </button>
                          <button className="icon-btn" title="Deletar Registro">
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                          <button
                            className="icon-btn"
                            title="Suspender Estágio"
                          >
                            <span className="material-symbols-outlined">
                              block
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="cell-name">Maria Santos</td>
                      <td className="cell-email">maria@estagio.pep.pt</td>
                      <td>
                        <span className="badge badge-completed">
                          Concluído
                        </span>
                      </td>
                      <td>
                        <div className="action-cell">
                          <button className="icon-btn" title="Editar Perfil">
                            <span className="material-symbols-outlined">
                              edit
                            </span>
                          </button>
                          <button className="icon-btn" title="Deletar Registro">
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                          <button className="icon-btn" title="Reativar">
                            <span className="material-symbols-outlined">
                              check_circle
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="cell-name">Carlos Lima</td>
                      <td className="cell-email">carlos@estagio.pep.pt</td>
                      <td>
                        <span className="badge badge-active">Em Estágio</span>
                      </td>
                      <td>
                        <div className="action-cell">
                          <button className="icon-btn" title="Editar Perfil">
                            <span className="material-symbols-outlined">
                              edit
                            </span>
                          </button>
                          <button className="icon-btn" title="Deletar Registro">
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                          <button
                            className="icon-btn"
                            title="Suspender Estágio"
                          >
                            <span className="material-symbols-outlined">
                              block
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <p className="table-info">
                  Mostrando 3 de 1,250 registros acadêmicos
                </p>
                <div className="pagination">
                  <button className="pagination-btn">Anterior</button>
                  <button className="pagination-btn">Próximo</button>
                </div>
              </div>
            </section>

            {/* Form section */}
            <section className="form-section">
              <h3 className="section-title">Configurar Novo Estágio</h3>

              <div className="form-card">
                <form className="form">
                  <div className="form-group">
                    <label htmlFor="titulo">
                      Título do Plano de Estágio
                    </label>
                    <input
                      type="text"
                      id="titulo"
                      placeholder="Ex: Estágio em Administração Escolar"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="instituicao">
                      Instituição de Ensino
                    </label>
                    <select id="instituicao" className="form-select">
                      <option>Selecione a escola/instituição</option>
                      <option>Universidade Aberta</option>
                      <option>Escola Superior de Tecnologia</option>
                      <option>Instituto de Educação e Pedagogia</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="duracao">Duração do Estágio (horas)</label>
                    <input
                      type="number"
                      id="duracao"
                      placeholder="160"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="objetivos">Objetivos Pedagógicos</label>
                    <textarea
                      id="objetivos"
                      placeholder="Breve descrição dos objetivos do estágio..."
                      rows="3"
                      className="form-textarea"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    Salvar Plano de Estágio
                  </button>
                </form>
              </div>

              <div className="info-note">
                <span className="material-symbols-outlined info-icon">
                  info
                </span>
                <p className="info-text">
                  Nota: Novos planos de estágio devem ser validados pelo
                  Orientador antes de publicados.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;