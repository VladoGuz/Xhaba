const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    }
  };

  try {
    const response = await fetch(url, finalOptions);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};
