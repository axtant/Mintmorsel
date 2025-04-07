export const fetchMenu = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8787/api/v1/menu");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching menu:", error);
      return [];
    }
  };
  