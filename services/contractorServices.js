import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

export const createContractor = (data) => API.post('/contractors', data);
export const getContractors = () => API.get('/contractors');
export const updateContractor = (id, data) => API.put(`/contractors/${id}`, data);
export const deleteContractor = (id) => API.delete(`/contractors/${id}`);
