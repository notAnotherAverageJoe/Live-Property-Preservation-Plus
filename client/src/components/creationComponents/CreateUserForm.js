import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateUserForm = () => {
  const { token, user } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [userRoles, setUserRoles] = useState([]); // Initialize as empty array
  const navigate = useNavigate(); // useNavigate hook for redirection

  // Fetch user roles from an API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/roles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRoles(response.data.roles || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching roles:", error);
        setUserRoles([]); // Fallback to empty array if error occurs
      }
    };

    fetchRoles();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/users",
        {
          email,
          role,
          company_id: user.company_id,
          first_name: firstName,
          last_name: lastName,
          password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("User created successfully.");
      navigate("/dashboard/roles"); // Redirect to Role Management page
    } catch (error) {
      console.error(
        "Error details:",
        error.response ? error.response.data : error.message
      );
      alert("Error creating user.");
    }
  };

  return (
    <div>
      <h3>Create New User</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="role">Role:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {userRoles.length > 0 ? (
            userRoles.map((userRole, index) => (
              <option key={index} value={userRole}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </option>
            ))
          ) : (
            <option value="user">User</option>
          )}
        </select>

        <label htmlFor="firstName">First Name:</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default CreateUserForm;
