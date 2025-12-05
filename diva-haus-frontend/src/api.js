const API_BASE_URL = "http://localhost:5000";

export const checkHealth = async () => {
  const res = await fetch(`${API_BASE_URL}/health`);
  return res.text();
};
