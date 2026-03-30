import api from "../api/api";

// =============================
// USERS
// =============================
export const getUsers = () => {
  return api.get("/admin/users");
};

export const createUser = (data) => {
  return api.post("/admin/users", data);
};

export const updateUser = (id, data) => {
  return api.put(`/admin/users/${id}`, data);
};

export const deleteUser = (id) => {
  return api.delete(`/admin/users/${id}`);
};

export const ativarUser = (id) => {
  return api.post(`/admin/users/${id}/ativar`);
};

export const desativarUser = (id) => {
  return api.post(`/admin/users/${id}/desativar`);
};

// =============================
// CURSOS
// =============================
export const getCursos = () => {
  return api.get("/admin/cursos");
};

export const getCurso = (id) => {
  return api.get(`/admin/cursos/${id}`);
};

export const createCurso = (data) => {
  return api.post("/admin/cursos", data);
};

export const updateCurso = (id, data) => {
  return api.put(`/admin/cursos/${id}`, data);
};

export const deleteCurso = (id) => {
  return api.delete(`/admin/cursos/${id}`);
};

export const ativarCurso = (id) => {
  return api.post(`/admin/cursos/${id}/ativar`);
};

export const desativarCurso = (id) => {
  return api.post(`/admin/cursos/${id}/desativar`);
};

// =============================
// LOGS
// =============================
export const getLogs = () => {
  return api.get("/admin/logs");
};

// =============================
// ACTIVE SESSIONS
// =============================
export const getActiveUsers = () => {
  return api.get("/admin/users/ativos");
};