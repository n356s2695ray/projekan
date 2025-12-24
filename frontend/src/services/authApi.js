import api from "./axios";

// Register user
export const registerUser = (data) => api.post("/auth/register", data);

// Login user
export const loginUser = (data) => api.post("/auth/login", data);
