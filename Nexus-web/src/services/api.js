const API_BASE_URL = import.meta.env.VITE_BASE_URL;
//const API_BASE_URL = 'http://localhost:3000';
// const API_BASE_URL = 'https://fetchx-backend-fucw.onrender.com';
// const API_BASE_URL = 'https://fetchx-suit.onrender.com';

// 🔑 Load key from environment
const API_KEY = import.meta.env.VITE_FETCHX_API_KEY; // change if not using Vite

const fetchFromAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error(`Failed to fetch from endpoint: ${endpoint}`, error);
    }
    throw error;
  }
};

// 🎯 Wrapper functions

export const fetchPexels = (type, query, page, signal) => {
  return fetchFromAPI(`metadata/pexels/${type}?query=${query}&page=${page}&perPage=15`, { signal });
};

export const fetchUnsplash = (query, page, signal) => {
  return fetchFromAPI(`metadata/unsplash/images?query=${query}&page=${page}&perPage=15`, { signal });
};

export const fetchPixabay = (type, query, page, signal) => {
  const pixabayType = type === 'images' ? 'photos' : type;
  return fetchFromAPI(`metadata/pixabay/${pixabayType}?query=${query}&page=${page}&perPage=15`, { signal });
};

export const fetchProviderCounts = (query, mediaType, signal) => {
  return fetchFromAPI(`search?query=${query}&type=${mediaType}`, { signal });
};
