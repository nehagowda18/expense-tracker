import axios from 'axios';

const API = axios.create({ baseURL: 'https://expense-tracker-backend-1rgb.onrender.com/api' });
export const expensesAPI = {
  getAll: (params) => API.get('/expenses', { params }),
  getSummary: (params) => API.get('/expenses/summary', { params }),
  getById: (id) => API.get(`/expenses/${id}`),
  create: (data) => API.post('/expenses', data),
  update: (id, data) => API.put(`/expenses/${id}`, data),
  delete: (id) => API.delete(`/expenses/${id}`),
};

export const categoriesAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  delete: (id) => API.delete(`/categories/${id}`),
};