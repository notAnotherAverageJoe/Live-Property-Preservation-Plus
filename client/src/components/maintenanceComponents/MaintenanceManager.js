import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const MaintenanceManager = ({ unitId }) => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    request_description: "",
    status: "Pending",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Set axios default headers for authentication
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchRequests = useCallback(async () => {
    try {
      if (!unitId) {
        console.error("No unitId provided");
        return;
      }
      const response = await axios.get(
        `http://localhost:3000/api/units/${unitId}/requests`
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }, [unitId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRequest) {
        // Update request
        await axios.put(
          `http://localhost:3000/api/requests/${selectedRequest.id}`,
          formData
        );
      } else {
        // Create request
        await axios.post(
          `http://localhost:3000/api/units/${unitId}/requests`,
          formData
        );
      }
      fetchRequests();
      setFormData({ request_description: "", status: "Pending" });
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error saving request:", error);
    }
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setFormData({
      request_description: request.request_description,
      status: request.status,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/requests/${id}`);
      fetchRequests();
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  return (
    <div>
      <h2>Manage Maintenance Requests for Unit {unitId}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="request_description"
          placeholder="Request Description"
          value={formData.request_description}
          onChange={handleChange}
          required
        />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">
          {selectedRequest ? "Update Request" : "Create Request"}
        </button>
      </form>
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            {request.request_description} - {request.status}{" "}
            <button onClick={() => handleEdit(request)}>Edit</button>{" "}
            <button onClick={() => handleDelete(request.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaintenanceManager;
