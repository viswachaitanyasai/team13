import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "https://team131.onrender.com/api/hackathons";
// const API_BASE_URL="https://team131.onrender.com/api/hackathons";


export const createHackathon = async (formData, navigate) => {
  console.log(formData)
  const token = localStorage.getItem("authToken");
  console.log("Retrieved Token Before API Call:", token);
  if (!token) {
    toast.error("No authentication token found. Redirecting to login...");
    navigate("/teacher-login"); // Redirect to login page
    return;

  }
  try {

    const response = await axios.post(`${API_BASE_URL}/`, formData, {
      headers: { 
        "Authorization": `Bearer ${token}`,
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
      toast.error(error.response?.data?.error || "Failed to create hackathon.");
    }
    
    throw error.response?.data ;
  }
};

export const getHackathons = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch hackathons." };
  }
};

export const getHackathonById = async (hackathonId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${hackathonId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch hackathon details." };
  }
};

export const editHackathon = async (hackathonId, updatedData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${hackathonId}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update hackathon." };
  }
};

export const removeHackathon = async (hackathonId, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${hackathonId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete hackathon." };
  }
};

export const getHackathonSubmissions = async (hackathonId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${hackathonId}/submissions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch submissions." };
  }
};

export const getHackathonSummary = async (hackathonId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${hackathonId}/summary`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch summary." };
  }
};

export const getSubmission = async (hackathonId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${hackathonId}/submissions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch student submission." };
  }
};
export const getEvaluations = async (hackathonId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${hackathonId}/evaluations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch evaluations." };
  }
};

export const getHackathonRegistrations = async (hackathonId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${hackathonId}/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete hackathon." };
  }
};

export const getHackathonsByTeacher = async (teacherId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teacher/${teacherId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch teacher's hackathons." };
  }
};

export const joinHackathon = async (inviteCode) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/join`, { inviteCode });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to join hackathon." };
  }
};
export const publishResults=async(hackathonId, token)=>{
  try{
    const response = await axios.post(`${API_BASE_URL}/${hackathonId}/publish-result`,{hackathonId}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
  catch (error) {
    throw error.response?.data || { error: "Failed to join hackathon." };
  }
}
//  /hackathonid/submissions
export const getAnalysis=async(evaluation_id,token)=>{
  console.log(token)
  const response=await axios.get(`${API_BASE_URL}/evaluations/${evaluation_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
}
export const handleCategoryChange=async(submission_id,token,category)=>
{
  const response=await axios.put(`https://team131.onrender.com/api/submissions/${submission_id}/category`,{evaluation_category:category} ,{
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}