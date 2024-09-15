import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import "../pagesCSS/RoleAssignment.css";

const RoleAssignment = ({ roles, onRoleAssigned }) => {
  const { token, user } = useAuth(); // Include user context
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.response || error);
        setMessage("Error fetching users.");
      }
    };

    fetchUsers();
  }, [token]);

  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRoleId) {
      setMessage("Please select both user and role.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/user-roles",
        { userId: selectedUserId, roleId: selectedRoleId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Role assigned successfully.");
      onRoleAssigned(); // Call callback to refresh role assignments
    } catch (error) {
      console.error("Error assigning role:", error.response || error);
      setMessage("Error assigning role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("User deleted successfully.");
      setUsers(users.filter((u) => u.id !== userId)); // Remove deleted user from the state
    } catch (error) {
      console.error("Error deleting user:", error.response || error);
      setMessage("Error deleting user.");
    }
  };

  return (
    <div className="create-role-form-container">
      <h2>Assign a Role to User</h2>

      <div>
        <label htmlFor="user-select" className="create-role-form-label">
          User:
        </label>
        <select
          id="user-select"
          className="create-role-form-select"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.first_name} {u.last_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="role-select" className="create-role-form-label">
          Role:
        </label>
        <select
          id="role-select"
          className="create-role-form-select"
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <button className="create-role-form-button" onClick={handleAssignRole}>
        Assign Role
      </button>

      <h3 className="create-role-form-roles-title">Delete a User</h3>
      <ul className="create-role-form-roles-list">
        {users.map((user) => (
          <li key={user.id} className="create-role-form-role-item">
            {user.first_name} {user.last_name}{" "}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <p
        className={`create-role-form-message ${
          message.includes("Error") ? "error" : ""
        }`}
      >
        {message}
      </p>
    </div>
  );
};

export default RoleAssignment;
