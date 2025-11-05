import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: (username: string, password: string) =>
    api.post('/auth/register', { username, password }),
  
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
};

// Words API
export const wordsApi = {
  getAll: () => api.get('/words'),
  
  add: (english: string, hebrew: string) =>
    api.post('/words', { english, hebrew }),
  
  update: (id: string, english: string, hebrew: string) =>
    api.put(`/words/${id}`, { english, hebrew }),
  
  delete: (id: string) => api.delete(`/words/${id}`),
  
  getPractice: (count: number) => api.get(`/words/practice/${count}`),
  
  updatePracticeResult: (id: string, correct: boolean) =>
    api.put(`/words/${id}/practice`, { correct }),
};

// Translation API
export const translateApi = {
  translate: (text: string) =>
    api.post('/translate/translate', { text }),
};

// Dictionary API
export const dictionaryApi = {
  // Report incorrect translation
  reportTranslation: (english: string, currentHebrew: string, suggestedHebrew: string, reason?: string) =>
    api.post('/dictionary/report', { english, currentHebrew, suggestedHebrew, reason }),
  
  // Get user's reports
  getReports: () => api.get('/dictionary/reports'),
  
  // Get random words for practice from global dictionary
  getPracticeWords: (count: number) => api.get(`/dictionary/practice/${count}`),
  
  // Get words by category
  getPracticeByCategory: (category: string, count: number) =>
    api.get(`/dictionary/practice/category/${category}?count=${count}`),
  
  // Get all categories
  getCategories: () => api.get('/dictionary/categories'),
};

export default api;
