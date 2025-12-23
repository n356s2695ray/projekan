import api from "./axios";

export const getBudgets = async (month, year) => {
  const res = await api.get("/budgets", { params: { month, year } });
  return res.data || [];
};

export const saveBudget = (data) => api.post("/api/budgets", data);

export const deleteBudget = (id) => api.delete(`/api/budgets/${id}`);