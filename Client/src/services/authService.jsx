// src/services/authService.js
import { API_ENDPOINTS } from '../config/apiConfig';

export const login = async (credentials) => {
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include', // Include cookies in requests
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data; // Return the response data containing the JWT token
  } catch (error) {
    throw error; // Re-throw to propagate error to caller
  }
};
export const signup = async (userData) => {
  try {
    const response = await fetch(API_ENDPOINTS.SIGNUP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include', // Include cookies in requests
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  } catch (error) {
    throw error; // Re-throw to propagate error to caller
  }
};
