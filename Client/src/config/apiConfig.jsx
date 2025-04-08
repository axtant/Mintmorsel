// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8787/api/v1';
const API_BASE_URL =  'http://127.0.0.1:8787/api/v1';

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/signin`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    MENU: `${API_BASE_URL}/menu`,
  };