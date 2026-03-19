import api from "./api.js";



// Register a new user api function
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// Login user api function
export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};


// Logout user api function
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};


// refreshAccessToken user api function
export const refreshAccessToken = async () => {
  const response = await api.post("/auth/refresh-token");
  return response.data;
};

// current user api function
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
