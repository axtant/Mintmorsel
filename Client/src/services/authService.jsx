// src/services/authService.js
import { API_ENDPOINTS } from '../config/apiConfig';
export const login = async (credentials) => {
  const response = await fetch(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include', // Include cookies in requests
  });
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  const data = await response.json();
  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data; // Return the response data containing the JWT token
};

export const signup = async (userData) => {
  const response = await fetch(API_ENDPOINTS.SIGNUP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
    credentials: 'include', // Include cookies in requests
  });
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  const data = await response.json();
  localStorage.setItem('user', JSON.stringify(data.user));
};
