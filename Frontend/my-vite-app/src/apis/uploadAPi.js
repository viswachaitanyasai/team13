import axios from "axios";

 const API_BASE_URL = "http://localhost:4000/api/files/upload";
// const API_BASE_URL="http://localhost:4000/api/files/upload"

export const fileUpload = async(file) => {
    try {
    
        const response = await axios.post(`${API_BASE_URL}/`, file, {
          headers: { 
            "Content-Type": "multipart/form-data",
          },
        }
        );
        return response.data;
      } catch (error) {
        console.error("API Error:", error.response?.data);
      }
    };
