import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const getProfile = async (token) => {
  if (!token) throw new Error("Missing authentication token");

  const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,   // <-- IMPORTANT: send JWT token now
    },
  });

  return response.data;
};
