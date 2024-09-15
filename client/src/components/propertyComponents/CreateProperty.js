import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function CreateProperty() {
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const navigate = useNavigate();

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  let companyId = null;

  if (token) {
    try {
      // Decode the token to get the company_id
      const decodedToken = jwtDecode(token);
      companyId = decodedToken.company_id;
    } catch (error) {
      console.error("Error decoding token", error);
    }
  }

  if (!companyId) {
    console.error("Company ID not found in token");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const property = {
      name: propertyName,
      address: propertyAddress,
      company_id: companyId, // Include company_id
    };

    try {
      const response = await fetch("http://localhost:3000/api/properties", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(property),
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }

      navigate("/properties");
    } catch (error) {
      console.error("Error creating property", error);
    }
  };

  return (
    <div>
      <h1>Create Property</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Property Name</label>
          <input
            type="text"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Property Address</label>
          <input
            type="text"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Property</button>
      </form>
    </div>
  );
}

export default CreateProperty;
