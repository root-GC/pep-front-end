import React, { useState, useEffect } from 'react';
import styles from './css/DashboardEstagiario.module.css';
import api from '../../api/api.js';
import { useNavigate } from 'react-router-dom';

const MENUS = {
  MEU_ESTAGIO: 'meu-estagio',
  DOCUMENTOS: 'documentos',
  DIARIOS: 'diarios',
  PROJETOS: 'projetos',
  RELATORIO_FINAL: 'relatorio-final',
};

const DashboardEstagiario = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(MENUS.MEU_ESTAGIO);

  // Dados
  const [estagio, setEstagio] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loadingEstagio, setLoadingEstagio] = useState(false);
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);
  const [error, setError] = useState(null);

  // Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState('Termo de Compromisso');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // Fetch estágio
  const fetchMeuEstagio = async () => {
    setLoadingEstagio(true);
    setError(null);
    try {
      const { data } = await api.get('/estagiario/meu-estagio');
      setEstagio(data.data ?? data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar informações do estágio.');
    } finally {
      setLoadingEstagio(false);
    }
  };

  // Fetch documentos
  const fetchMeusDocumentos = async () => {
    setLoadingDocumentos(true);
    try {
      const { data } = await api.get('/estagiario/meus-documentos');
      setDocumentos(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      console.error('Erro ao carregar documentos', err);
    } finally {
      setLoadingDocumentos(false);
    }
  };

  useEffect(() => {
    fetchMeuEstagio();
    fetchMeusDocumentos();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.warn('Falha ao comunicar logout', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // Upload de documento
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadMsg('Selecione um ficheiro.');
      return;
    }
    setUploading(true);
    setUploadMsg('');
    const formData = new FormData();
    formData.append('ficheiro', selectedFile);
    formData.append('tipo', tipoDocumento);
    try {
      await api.post('/estagiario/documentos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMsg('Documento enviado com sucesso!');
      setSelectedFile(null);
      setTipoDocumento('Termo de Compromisso');
      fetchMeusDocumentos();
      // limpar input file
      e.target.reset();
    } catch (err) {
      setUploadMsg(err.response?.data?.message || 'Erro ao enviar documento.');
    } finally {
      setUploading(false);
    }
  };

  // ==================== RENDERS ====================

  const renderMeuEstagio = () => (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard do Estagiário</h1>
        <p className={styles.pageSubtitle}>
          Acompanhe seus documentos e detalhes do estágio.
        </p>
      </div>

      {loadingEstagio && <p>A carregar informações…</p>}
      {error && <div className={styles.errorMsg}>{error}</div>}

      {estagio && (
        <section className={styles.infoCard}>
          <div className={styles.infoCardContent}>
            <div className={styles.infoCardHeader}>
              <span className="material-symbols-outlined text-primary">info</span>
              <h2 className={styles.infoCardTitle}>Informações do Plano de Estágio</h2>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>Orientador / Supervisor</p>
                <p className={styles.infoValue}>
                  {estagio.supervisor?.name || 'Não atribuído'}
                </p>
              </div>
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>Tutor</p>
                <p className={styles.infoValue}>
                  {estagio.tutor?.name || 'Não atribuído'}
                </p>
              </div>
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>Carga Horária</p>
                <p className={styles.infoValue}>{estagio.carga_horaria || '—'}</p>
              </div>
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>Data de Início</p>
                <p className={styles.infoValue}>
                  {estagio.data_inicio
                    ? new Date(estagio.data_inicio).toLocaleDateString('pt-PT')
                    : '—'}
                </p>
              </div>
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>Previsão de Conclusão</p>
                <p className={styles.infoValue}>
                  {estagio.data_fim
                    ? new Date(estagio.data_fim).toLocaleDateString('pt-PT')
                    : '—'}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.infoCardAction}>
            <button className={styles.contractBtn}>Ver Detalhes do Contrato</button>
          </div>
        </section>
      )}
    </>
  );

  const renderDocumentos = () => (
    <div className={styles.columns}>
      {/* Coluna de Upload */}
      <div className={styles.uploadColumn}>
        <div className={styles.uploadCard}>
          <h3 className={styles.uploadTitle}>
            <span className="material-symbols-outlined text-primary">upload_file</span>
            Enviar Documento
          </h3>
          {uploadMsg && (
            <div
              style={{
                background: uploadMsg.includes('sucesso') ? '#dcfce7' : '#fef2f2',
                color: uploadMsg.includes('sucesso') ? '#166534' : '#ef4444',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              {uploadMsg}
            </div>
          )}
          <form className={styles.uploadForm} onSubmit={handleUpload}>
            <div className={styles.dropzone}>
              <span className={`material-symbols-outlined ${styles.dropzoneIcon}`}>
                cloud_upload
              </span>
              <p className={styles.dropzoneText}>
                Arraste ou clique para selecionar um arquivo
              </p>
              <p className={styles.dropzoneHint}>PDF, JPG ou PNG (Max 5MB)</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </div>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Tipo de Documento</label>
              <select
                className={styles.select}
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
              >
                <option>Termo de Compromisso</option>
                <option>Relatório de Atividades</option>
                <option>Comprovante de Matrícula</option>
                <option>Plano de Atividades</option>
                <option>Diário Reflexivo</option>
                <option>Projeto Experimental</option>
                <option>Relatório Final</option>
                <option>Portefólio</option>
              </select>
            </div>
            <button className={styles.uploadBtn} type="submit" disabled={uploading}>
              {uploading ? 'A enviar…' : 'Enviar Documento'}
            </button>
          </form>
        </div>
      </div>

      {/* Coluna de Documentos Enviados */}
      <div className={styles.tableColumn}>
        <div className={styles.tableCard}>
          <div className={styles.tableCardHeader}>
            <h3 className={styles.tableCardTitle}>
              <span className="material-symbols-outlined text-primary">history</span>
              Documentos Enviados
            </h3>
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
                {loadingDocumentos && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center' }}>
                      A carregar…
                    </td>
                  </tr>
                )}
                {!loadingDocumentos && documentos.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center' }}>
                      Nenhum documento enviado.
                    </td>
                  </tr>
                )}
                {documentos.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className={styles.documentCell}>
                        <span className="material-symbols-outlined text-blue-500">
                          picture_as_pdf
                        </span>
                        <span>{doc.nome_original || doc.ficheiro || 'Documento'}</span>
                      </div>
                    </td>
                    <td>
                      {doc.created_at
                        ? new Date(doc.created_at).toLocaleDateString('pt-PT')
                        : '—'}
                    </td>
                    <td className={styles.textCenter}>
                      <span
                        className={`${styles.statusBadge} ${
                          doc.status?.toLowerCase() === 'validado'
                            ? styles.statusValidated
                            : doc.status?.toLowerCase() === 'rejeitado'
                            ? styles.statusRejected
                            : styles.statusPending
                        }`}
                      >
                        {doc.status || 'Pendente'}
                      </span>
                    </td>
                    <td className={styles.textRight}>
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className={styles.actionBtn}>
                          <span className="material-symbols-outlined">download</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (titulo) => (
    <div className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>{titulo}</h1>
      <p className={styles.pageSubtitle}>Funcionalidade em desenvolvimento.</p>
    </div>
  );

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
        {/* Sidebar unificada (estilo Chefe/Supervisor) */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <h1 className={styles.logoTitle}>Sistema PEP</h1>
              <p className={styles.logoSubtitle}>Estagiário</p>
            </div>
          </div>

          <nav className={styles.nav}>
            <p className={styles.navLabel}>Menu Principal</p>
            <a
              href="#"
              className={`${styles.navLink} ${activeMenu === MENUS.MEU_ESTAGIO ? styles.navLinkActive : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.MEU_ESTAGIO); }}
            >
              <span className="material-symbols-outlined">school</span>
              <span>Meu Estágio</span>
            </a>
            <a
              href="#"
              className={`${styles.navLink} ${activeMenu === MENUS.DOCUMENTOS ? styles.navLinkActive : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.DOCUMENTOS); }}
            >
              <span className="material-symbols-outlined">description</span>
              <span>Documentos</span>
            </a>
            <a
              href="#"
              className={`${styles.navLink} ${activeMenu === MENUS.DIARIOS ? styles.navLinkActive : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.DIARIOS); }}
            >
              <span className="material-symbols-outlined">book</span>
              <span>Diários</span>
            </a>
            <a
              href="#"
              className={`${styles.navLink} ${activeMenu === MENUS.PROJETOS ? styles.navLinkActive : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.PROJETOS); }}
            >
              <span className="material-symbols-outlined">emoji_objects</span>
              <span>Projetos</span>
            </a>
            <a
              href="#"
              className={`${styles.navLink} ${activeMenu === MENUS.RELATORIO_FINAL ? styles.navLinkActive : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu(MENUS.RELATORIO_FINAL); }}
            >
              <span className="material-symbols-outlined">task_alt</span>
              <span>Relatório Final</span>
            </a>
          </nav>

          {/* Caixa de suporte (igual aos outros dashboards) */}
          <div className={styles.supportBox}>
            <div className={styles.supportContent}>
              <p className={styles.supportTitle}>Suporte</p>
              <p className={styles.supportText}>
                Precisa de ajuda? Consulte o manual do estagiário.
              </p>
            </div>
          </div>

          {/* Botão Sair bem visível */}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            <span>Sair</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {activeMenu === MENUS.MEU_ESTAGIO && renderMeuEstagio()}
          {activeMenu === MENUS.DOCUMENTOS && renderDocumentos()}
          {activeMenu === MENUS.DIARIOS && renderPlaceholder('Diários Reflexivos')}
          {activeMenu === MENUS.PROJETOS && renderPlaceholder('Projetos Experimentais')}
          {activeMenu === MENUS.RELATORIO_FINAL && renderPlaceholder('Relatório Final e Portefólio')}
        </main>
      </div>
    </div>
  );
};

export default DashboardEstagiario;