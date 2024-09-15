import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateCompany() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get token from localStorage

    try {
      const response = await fetch("http://localhost:3000/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in headers
        },
        body: JSON.stringify({ name, address }),
      });

      if (!response.ok) {
        throw new Error("Failed to create company");
      }

      const data = await response.json();
      console.log("Company created:", data);

      // Update localStorage with new companyId
      localStorage.setItem("companyId", data.companyId);
      console.log(
        "Updated companyId in localStorage:",
        localStorage.getItem("companyId")
      );

      // Clear user session
      localStorage.removeItem("token"); // Assuming you store token in localStorage
      localStorage.removeItem("userId"); // Remove other relevant items
      localStorage.removeItem("companyId");

      // Redirect to login page with a prompt message
      navigate("/login", {
        state: {
          message:
            "Your company has been created. As the Creator you will always log in through the Creator portal\nAll users must be assigned roles and then will be able to access the Users Portal!",
        },
      });
    } catch (error) {
      console.error("Failed to create company", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Address:
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>
      <button type="submit">Create Company</button>
    </form>
  );
}

export default CreateCompany;
