import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/analytics";

export const getHackathonStats = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hackathons`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch hackathon statistics." };
  }
};

export const getStudentRegistrations = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch student registration data." };
  }
};

export const getSubmissionStats = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/submissions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch submission statistics." };
  }
};
