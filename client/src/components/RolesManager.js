import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import CreateRoleForm from "./creationComponents/CreateRoleForm";
import RoleAssignment from "./creationComponents/RolesAssignment";
import "./styles/RoleManager.css";

const RolesManager = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch roles
  const fetchRoles = async () => {
    if (isAuthenticated && token) {
      try {
        const response = await axios.get("http://localhost:3000/api/roles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error.response || error);
        setMessage("Error fetching roles.");
      }
    }
  };

  useEffect(() => {
    fetchRoles(); // Fetch roles on component mount
  }, [isAuthenticated, token]);

  return (
    <div>
      <h2 className="roles-manager-title">Manage Roles</h2>
      {user ? (
        <div className="roles-manager-container">
          <div className="roles-manager-component">
            <CreateRoleForm onRoleCreated={fetchRoles} />
          </div>
          <div className="roles-manager-component">
            <RoleAssignment roles={roles} onRoleAssigned={fetchRoles} />
          </div>
        </div>
      ) : (
        <p>Please log in.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default RolesManager;
