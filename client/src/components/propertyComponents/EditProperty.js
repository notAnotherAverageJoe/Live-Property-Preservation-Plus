import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditProperty() {
  const { id } = useParams(); // Get the property ID from the URL
  const [property, setProperty] = useState({
    name: "",
    address: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch property data by ID
  useEffect(() => {
    const fetchProperty = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://localhost:3000/api/properties/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch property data");
        }

        const data = await response.json();
        setProperty(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to update the property
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/api/properties/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(property),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update property");
      }

      // After successful update, redirect back to the properties list or a specific page
      navigate("/properties");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Edit Property</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={property.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={property.address}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Update Property</button>
      </form>

      <button onClick={() => navigate("/properties")}>Cancel</button>
    </div>
  );
}

export default EditProperty;
