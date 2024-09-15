import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../utils/authService";
import GoToHome from "../helper/GoTohome";

function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // State for error message
  const [success, setSuccess] = useState(false); // State for success message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(false); // Clear previous success message

    // Check password length
    if (formData.password.length < 10) {
      setError("Password must be at least 10 characters long.");
      return;
    }

    try {
      const response = await register(formData);
      console.log(response);
      setSuccess(true); // Set success message
      setTimeout(() => navigate("/login"), 3000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Registration failed", error);
      setError(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Display error message */}
      {success && (
        <p className="success-message">
          Congratulations! You have successfully registered.
        </p>
      )}{" "}
      {/* Display success message */}
      <h3>Register</h3>
      <label>
        First Name:
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="10" // HTML validation
        />
      </label>
      <button type="submit">Register</button>
      <GoToHome />
    </form>
  );
}

export default Register;
