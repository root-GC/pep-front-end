import api from '../api/api';

export const getTutores = () => api.get('/coordenador/tutores');
export const createUser = (data) => api.post('/coordenador/users', data);
export const updateUser = (id, data) => api.put(`/coordenador/users/${id}`, data);

export const getEstagios = () => api.get('/coordenador/estagios');
export const getEstagio = (id) => api.get(`/coordenador/estagios/${id}`);
export const createEstagio = (data) => api.post('/coordenador/estagios', data);
export const atribuirTutor = (id) => api.post(`/coordenador/estagios/${id}/tutor`);
export const getEstagiosPorTutor = (tutorId) => api.get(`/coordenador/tutores/${tutorId}/estagios`);

export const gerarCarta = (estagioId) => api.post(`/coordenador/estagios/${estagioId}/carta`);
export const baixarCarta = (estagioId) => api.get(`/coordenador/estagios/${estagioId}/carta`, { responseType: 'blob' });

export const gerarPauta = () => api.get('/coordenador/estagios/pauta', { responseType: 'blob' });
export const exportarSigeup = () => api.get('/coordenador/estagios/exportar-sigeup', { responseType: 'blob' });