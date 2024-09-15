import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import "../styles/CreateRoleForm.css";

const CreateRoleForm = ({ onRoleCreated }) => {
  const [roleName, setRoleName] = useState("");
  const [accessLevel, setAccessLevel] = useState(""); // State for access level
  const [message, setMessage] = useState("");
  const [roles, setRoles] = useState([]); // State to store the roles
  const { user, token } = useAuth(); // Use user and token from Auth context

  // Handle role name input change
  const handleInputChange = (e) => {
    setRoleName(e.target.value);
  };

  // Handle access level input change
  const handleAccessLevelChange = (e) => {
    setAccessLevel(e.target.value);
  };

  // Fetch roles from the API
  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data);
    } catch (error) {
      setMessage("Error fetching roles.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleName || !accessLevel) {
      setMessage("Role name and access level cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/roles",
        {
          name: roleName,
          access_level: parseInt(accessLevel), // Ensure access level is an integer
          company_id: user.company_id,
          user_id: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        }
      );
      setMessage(response.data.message);
      setRoleName("");
      setAccessLevel(""); // Reset access level after submission
      fetchRoles(); // Refresh roles list
      if (onRoleCreated) {
        onRoleCreated(); // Optional: If you need to trigger additional actions
      }
    } catch (error) {
      setMessage("Error creating role.");
    }
  };

  // Handle role deletion
  const handleDelete = async (roleId) => {
    try {
      await axios.delete(`http://localhost:3000/api/roles/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });
      setMessage("Role deleted successfully.");
      fetchRoles(); // Fetch roles again after deleting a role
    } catch (error) {
      setMessage("Error deleting role.");
    }
  };

  // Fetch the roles on component mount
  useEffect(() => {
    if (token) {
      fetchRoles(); // Call fetchRoles if token exists
    }
  }, [token]);

  return (
    <div className="create-role-form-container">
      <h2 className="create-role-form-title">Create a New Role</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="roleName" className="create-role-form-label">
            Role Name:
          </label>
          <input
            type="text"
            id="roleName"
            value={roleName}
            onChange={handleInputChange}
            required
            className="create-role-form-input"
          />
        </div>

        <div>
          <label htmlFor="accessLevel" className="create-role-form-label">
            Access Level (1-5):
          </label>
          <select
            id="accessLevel"
            value={accessLevel}
            onChange={handleAccessLevelChange}
            required
            className="create-role-form-select"
          >
            <option value="">Select Access Level</option>
            <option value="1">1 - Lowest</option>
            <option value="2">2 - Low</option>
            <option value="3">3 - Medium</option>
            <option value="4">4 - High</option>
            <option value="5">5 - Maximum</option>
          </select>
        </div>

        <button type="submit">Create Role</button>
      </form>
      {message && (
        <p
          className={`create-role-form-message ${
            message.startsWith("Error") ? "error" : ""
          }`}
        >
          {message}
        </p>
      )}

      <h3 className="create-role-form-roles-title">Existing Roles</h3>
      <ul className="create-role-form-roles-list">
        {roles.length > 0 ? (
          roles.map((role) => (
            <li key={role.id} className="create-role-form-role-item">
              {role.name} (ID: {role.id}, Access Level: {role.access_level})
              <button
                className="create-role-form-delete-button"
                onClick={() => handleDelete(role.id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No roles found.</p>
        )}
      </ul>
    </div>
  );
};

export default CreateRoleForm;
