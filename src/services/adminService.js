import api from "../api/api";

// =============================
// USERS (Admin)
// =============================
export const getUsers = () => api.get("/admin/users");
export const createUser = (data) => api.post("/admin/users", data);
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const ativarUser = (id) => api.post(`/admin/users/${id}/activate`);          // rota real
export const desativarUser = (id) => api.post(`/admin/users/${id}/deactivate`);    // rota real
export const assignRole = (id, role) => api.post(`/admin/users/${id}/assign-role`, { role });
export const removeRole = (id, role) => api.post(`/admin/users/${id}/remove-role`, { role });
export const resetUserPassword = (id, password) => api.post(`/admin/users/${id}/reset-password`, { password });
export const getUserLogs = (id) => api.get(`/admin/users/${id}/logs`);

// =============================
// ROLES (RBAC)
// =============================
export const getRoles = () => api.get("/admin/roles");
export const createRole = (data) => api.post("/admin/roles", data);
export const updateRole = (id, data) => api.put(`/admin/roles/${id}`, data);
export const deleteRole = (id) => api.delete(`/admin/roles/${id}`);
export const assignPermission = (roleId, permission) =>
  api.post(`/admin/roles/${roleId}/assign-permission`, { permission });
export const removePermission = (roleId, permission) =>
  api.post(`/admin/roles/${roleId}/remove-permission`, { permission });

// =============================
// DEPARTAMENTOS (academic)
// =============================
export const getDepartamentos = () => api.get("/academic/departamentos");
export const createDepartamento = (data) => api.post("/academic/departamentos", data);
export const updateDepartamento = (id, data) => api.put(`/academic/departamentos/${id}`, data);
export const deleteDepartamento = (id) => api.delete(`/academic/departamentos/${id}`);

// =============================
// CURSOS (academic)
// =============================
export const getCursos = () => api.get("/academic/cursos");
export const getCurso = (id) => api.get(`/academic/cursos/${id}`);
export const createCurso = (data) => api.post("/academic/cursos", data);
export const updateCurso = (id, data) => api.put(`/academic/cursos/${id}`, data);
export const deleteCurso = (id) => api.delete(`/academic/cursos/${id}`);
export const ativarCurso = (id) => api.post(`/academic/cursos/${id}/activate`);    // se existir no backend; senão remover
export const desativarCurso = (id) => api.post(`/academic/cursos/${id}/deactivate`);
export const getCursoCoordenadores = (id) => api.get(`/academic/cursos/${id}/coordenadores`);
export const getCursoEstudantes = (id) => api.get(`/academic/cursos/${id}/estudantes`);

// =============================
// INSTITUIÇÕES (academic)
// =============================
export const getInstituicoes = () => api.get("/academic/instituicoes");
export const createInstituicao = (data) => api.post("/academic/instituicoes", data);
export const updateInstituicao = (id, data) => api.put(`/academic/instituicoes/${id}`, data);
export const deleteInstituicao = (id) => api.delete(`/academic/instituicoes/${id}`);
export const approveInstituicao = (id) => api.post(`/academic/instituicoes/${id}/approve`);
export const rejectInstituicao = (id) => api.post(`/academic/instituicoes/${id}/reject`);
export const suspendInstituicao = (id) => api.post(`/academic/instituicoes/${id}/suspend`);
export const getInstituicaoEstagios = (id) => api.get(`/academic/instituicoes/${id}/estagios`);

// =============================
// LOGS (audit)
// =============================
export const getLogs = () => api.get("/admin/audit-logs");
export const getLog = (id) => api.get(`/admin/audit-logs/${id}`);

// =============================
// NOTIFICAÇÕES
// =============================
export const getNotifications = () => api.get("/admin/notifications");
export const getNotification = (id) => api.get(`/admin/notifications/${id}`);
export const markNotificationRead = (id) => api.post(`/admin/notifications/${id}/mark-as-read`);
export const markAllNotificationsRead = () => api.post("/admin/notifications/mark-all-as-read");
export const deleteNotification = (id) => api.delete(`/admin/notifications/${id}`);

// =============================
// ACTIVE SESSIONS (mantido)
// =============================
export const getActiveUsers = () => api.get("/admin/users/ativos");