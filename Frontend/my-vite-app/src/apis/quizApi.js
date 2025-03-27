import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "https://team131.onrender.com/api/quiz";
// const API_BASE_URL="https://team131.onrender.com/api/quiz";


export const createQuiz = async (formData, navigate) => {
  console.log(formData)
  const token = localStorage.getItem("authToken");
  if (!token) {
    toast.error("No authentication token found. Redirecting to login...");
    navigate("/teacher-login");
    return;

  }
  try {

    const response = await axios.post(`${API_BASE_URL}/create`, formData, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data);

    if (error.response?.status === 401) {
      toast.error("Session expired. Redirecting to login...");
      localStorage.removeItem("authToken");
      navigate("/teacher-login");
    } else {
      toast.error(error.response?.data?.error || "Failed to create quiz.");
    }
    
    throw error.response?.data ;
  }
};

export const removeQuiz = async (quizId, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to delete quiz." };
    }
  };

  export const getQuizzes = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quizes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch quizzes." };
    }
  };
  