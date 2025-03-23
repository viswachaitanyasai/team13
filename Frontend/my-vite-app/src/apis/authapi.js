import axios from "axios";

const API_BASE_URL = "https://team13-aajv.onrender.com/api/auth";

// 📌 Register a New User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed." };
  }
};

// 📌 Verify Email (OTP Verification)
export const verifyEmail = async (otpData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-email`, otpData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Email verification failed." };
  }
};

// 📌 Resend OTP
export const resendOTP = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resend-otp`, {
      email: email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to resend OTP." };
  }
};

// 📌 Login User
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      // Include credentials (cookies)
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed." };
  }
};

// 📌 Logout User
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/logout`, {});
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Logout failed." };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { error: "Failed to request password reset." }
    );
  }
};

export const resetPassword = async (resetData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/reset-password`,
      resetData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Password reset failed." };
  }
};
