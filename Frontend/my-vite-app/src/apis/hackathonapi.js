import axios from "axios";

const API_BASE_URL = "https://your-backend-url.com/api/hackathons"; // Replace with actual backend URL

// Set auth headers
const getAuthHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };
};

// 🔹 Create Hackathon
export const createHackathon = async (hackathonData) => {
  try {
    const response = await axios.post(API_BASE_URL, hackathonData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create hackathon" };
  }
};

// 🔹 Get All Hackathons (Protected)
export const getHackathons = async () => {
  try {
    const response = await axios.get(API_BASE_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch hackathons" };
  }
};

// 🔹 Get Hackathon by ID
export const getHackathonById = async (hackathonId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${hackathonId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Hackathon not found" };
  }
};

// 🔹 Edit Hackathon (Only Teacher Who Created It)
export const editHackathon = async (hackathonId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${hackathonId}`, updatedData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to edit hackathon" };
  }
};

// 🔹 Delete Hackathon (Only Creator Can Delete)
export const removeHackathon = async (hackathonId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${hackathonId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete hackathon" };
  }
};
