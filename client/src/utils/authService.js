import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Adjust as necessary

// Register new user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    // Check for specific error status codes
    if (error.response && error.response.status === 409) {
      // 409 Conflict
      throw new Error("Email is already taken.");
    }
    // Throw generic error for other cases
    throw new Error(
      error.response?.data?.message || "Registration failed. Please try again."
    );
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Login failed. Please try again."
    );
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem("token");
};

export { register, login, logout };
