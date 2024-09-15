import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TenantsManager.css";
import Pagination from "../helper/Pagination"; // Import the Pagination component

const TenantsManager = () => {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    property_id: "",
  });
  const [editing, setEditing] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tenantsPerPage] = useState(5); // Adjust as needed

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/properties", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProperties(res.data);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = JSON.parse(atob(token.split(".")[1])).company_id;
        const res = await axios.get(
          `http://localhost:3000/api/tenants/${companyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTenants(res.data);
      } catch (err) {
        console.error("Error fetching tenants:", err);
      }
    };

    fetchTenants();
  }, []);

  useEffect(() => {
    // Filter tenants based on selected property
    const filtered = tenants.filter((tenant) =>
      selectedPropertyId === ""
        ? false // Do not show tenants if no property is selected
        : tenant.property_id === parseInt(selectedPropertyId)
    );
    setFilteredTenants(filtered);
  }, [tenants, selectedPropertyId]);

  // Calculate current tenants to display
  const indexOfLastTenant = currentPage * tenantsPerPage;
  const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage;
  const currentTenants = filteredTenants.slice(
    indexOfFirstTenant,
    indexOfLastTenant
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, first_name, last_name, email, phone, property_id } = formData;
    try {
      const token = localStorage.getItem("token");
      if (editing) {
        await axios.put(
          `http://localhost:3000/api/tenants/${id}`,
          { first_name, last_name, email, phone, property_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditing(false);
      } else {
        await axios.post(
          "http://localhost:3000/api/tenants",
          { first_name, last_name, email, phone, property_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setFormData({
        id: null,
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        property_id: "",
      });
      // Refetch tenants to get the updated list
      const companyId = JSON.parse(atob(token.split(".")[1])).company_id;
      const res = await axios.get(
        `http://localhost:3000/api/tenants/${companyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTenants(res.data);
    } catch (err) {
      console.error("Failed to submit tenant:", err);
    }
  };

  const handleEdit = (tenant) => {
    setEditing(true);
    setFormData(tenant);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/tenants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refetch tenants after deletion
      const companyId = JSON.parse(atob(token.split(".")[1])).company_id;
      const res = await axios.get(
        `http://localhost:3000/api/tenants/${companyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTenants(res.data);
    } catch (err) {
      console.error("Failed to delete tenant:", err);
    }
  };

  const handlePropertyFilterChange = (e) => {
    setSelectedPropertyId(e.target.value);
    setCurrentPage(1); // Reset page number when filtering
  };

  return (
    <div className="tenants-manager-container">
      <h3>Manage Tenants</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
        <select
          name="property_id"
          value={formData.property_id || ""}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>
            -- Select Property --
          </option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.name}
            </option>
          ))}
        </select>
        <button type="submit">
          {editing ? "Update Tenant" : "Add Tenant"}
        </button>
      </form>

      <h2>Filter Tenants by Property</h2>
      <select value={selectedPropertyId} onChange={handlePropertyFilterChange}>
        <option value="" disabled>
          -- Select Property to Filter --
        </option>
        {properties.map((property) => (
          <option key={property.id} value={property.id}>
            {property.name}
          </option>
        ))}
      </select>

      <h2>Tenants List</h2>
      <ul>
        {currentTenants.length > 0 ? (
          currentTenants.map((tenant) => (
            <li key={tenant.id}>
              <p>{`First Name: ${tenant.first_name} Last Name: ${tenant.last_name}`}</p>
              <p>{`Tenant Email: ${tenant.email} Tenant Phone: ${tenant.phone} Tenant ID: ${tenant.id}`}</p>
              <div>
                <button
                  className="pill-link"
                  onClick={() => handleEdit(tenant)}
                >
                  Edit
                </button>
                <button
                  className="pill-link"
                  onClick={() => handleDelete(tenant.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No tenants found for the selected property.</p>
        )}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredTenants.length / tenantsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TenantsManager;
