// services/summaryApi.js
import api from "./axios";

// GET summary keseluruhan
export const getSummary = async () => {
  try {
    const res = await api.get("/api/dashboard/summary");
    return res.data;
  } catch (err) {
    console.error("Error fetching summary:", err);
    return null;
  }
};

// GET category
export const getCategory = async () => {
  try {
    const res = await api.get("/api/dashboard/category");
    return res.data;
  } catch (err) {
    console.error("Error fetching category:", err);
    return [];
  }
};

// GET daily summary
export const getDaily = async () => {
  try {
    const res = await api.get("/api/dashboard/daily");
    return res.data;
  } catch (err) {
    console.error("Error fetching daily summary:", err);
    return [];
  }
};
