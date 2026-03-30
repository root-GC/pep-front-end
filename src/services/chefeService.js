import api from '../api/api';

// =============================
// USERS
// =============================

/**
 * Obtém a lista de todos os utilizadores (coordenadores, tutores, etc.)
 */
export const getUsers = () => api.get('/chefe/users');

/**
 * Cria um novo utilizador (coordenador ou tutor)
 * @param {Object} data - Dados do utilizador (name, email, password, role, instituicao_id)
 */
export const createUser = (data) => api.post('/chefe/users', data);

/**
 * Actualiza um utilizador existente
 * @param {number} id - ID do utilizador
 * @param {Object} data - Dados actualizados (name, email, password opcional, role, instituicao_id)
 */
export const updateUser = (id, data) => api.put(`/chefe/users/${id}`, data);

/**
 * Remove um utilizador
 * @param {number} id - ID do utilizador
 */
export const deleteUser = (id) => api.delete(`/chefe/users/${id}`);

// =============================
// INSTITUIÇÕES
// =============================

/**
 * Obtém a lista de todas as instituições parceiras
 */
export const getInstituicoes = () => api.get('/chefe/instituicoes');

/**
 * Cria uma nova instituição parceira
 * @param {Object} data - Dados da instituição (name, nuit, endereco, email, telefone)
 */
export const createInstituicao = (data) => api.post('/chefe/instituicoes', data);

/**
 * Actualiza uma instituição existente
 * @param {number} id - ID da instituição
 * @param {Object} data - Dados actualizados
 */
export const updateInstituicao = (id, data) => api.put(`/chefe/instituicoes/${id}`, data);

/**
 * Remove uma instituição
 * @param {number} id - ID da instituição
 */
export const deleteInstituicao = (id) => api.delete(`/chefe/instituicoes/${id}`);

// =============================
// ESTÁGIOS
// =============================

/**
 * Obtém a lista de todos os estágios (das instituições associadas ao chefe)
 */
export const getEstagios = () => api.get('/chefe/estagios');

/**
 * Obtém os estágios de uma instituição específica
 * @param {number} instituicaoId - ID da instituição
 */
export const getEstagiosByInstituicao = (instituicaoId) =>
  api.get(`/chefe/instituicoes/${instituicaoId}/estagios`);