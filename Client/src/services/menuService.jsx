import { API_ENDPOINTS } from '../config/apiConfig';

export const fetchMenu = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.MENU, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
};

export const postMenuItem = async (menuItem) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.MENU}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuItem),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  } catch (error) {
    console.error('Error posting menu item:', error);
    throw error;
  }
};

export const deleteAllMenuItems = async () => {
  try {
    const response = await fetch(`${API_ENDPOINTS.MENU}/delete`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  } catch (error) {
    console.error('Error deleting all menu items:', error);
    throw error;
  }
};

export const updateMenuItemDesc = async (newDesc) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.MENU}/update-desc`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemDesc: newDesc }),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  } catch (error) {
    console.error('Error updating item description:', error);
    throw error;
  }
};

