import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import "../pagesCSS/Login.css";
import GoToHome from "../helper/GoTohome";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreator, setIsCreator] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        navigate("/login");
      }, 40000);
    }
  }, [message, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const endpoint = isCreator
        ? "http://localhost:3000/api/auth/creator-login"
        : "http://localhost:3000/api/auth/login";

      const response = await axios.post(endpoint, { email, password });

      if (response.data.token) {
        login(response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      // Set error message based on the response
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login failed:", errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {message && <p className="alert alert-info">{message}</p>}
        {error && <p className="alert alert-danger">{error}</p>}{" "}
        {/* Display error message */}
        <div className="login-type">
          <label>
            <input
              type="radio"
              id="regularUser"
              checked={!isCreator}
              onChange={() => setIsCreator(false)}
            />
            Regular User
          </label>
          <label>
            <input
              type="radio"
              id="creator"
              checked={isCreator}
              onChange={() => setIsCreator(true)}
            />
            Creator
          </label>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          <GoToHome />
        </form>
      </div>
    </div>
  );
};

export default Login;
