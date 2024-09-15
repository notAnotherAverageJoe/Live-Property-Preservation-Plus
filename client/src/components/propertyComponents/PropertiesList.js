import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import SearchBar from "../helper/SearchBar";
import "../styles/PropertyList.css";

function PropertiesList() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const isCreator = user.is_owner !== false;
  const accessLevel = user.access_level || 5;

  const canView = isCreator || accessLevel >= 1;
  const canCreate = accessLevel >= 2;
  const canEditOrDelete = (property) => {
    return (
      isCreator ||
      accessLevel >= 4 ||
      (accessLevel === 3 && property.created_by === user.id)
    );
  };

  // Adjusted accessLevel check to exclude level 1 from editing or deleting
  const canEdit = (property) => {
    return accessLevel >= 2 && canEditOrDelete(property);
  };

  const canDelete = (property) => {
    return accessLevel >= 2 && canEditOrDelete(property);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      if (!canView) {
        console.error("User does not have permission to view properties");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:3000/api/properties", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Error fetching properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [canView]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/properties/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete property");
        }

        setProperties(properties.filter((property) => property.id !== id));
        setFilteredProperties(
          filteredProperties.filter((property) => property.id !== id)
        );
      } catch (error) {
        console.error("Error deleting property", error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-property/${id}`);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setFilteredProperties(
      properties.filter((property) =>
        property.name.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  return (
    <div className="container">
      <h3>Properties List</h3>

      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholderText="Search by property name..."
      />

      {/* Add New Property Button - moved below the search bar */}
      {canCreate && (
        <div className="addPropertyButton">
          <button
            className="pill-link"
            onClick={() => navigate("/create-property")}
          >
            Add New Property
          </button>
        </div>
      )}

      {/* Conditional Rendering for Loading and Property List */}
      {loading ? (
        <p className="message">Loading...</p>
      ) : filteredProperties.length > 0 ? (
        <ul className="propertyList">
          {filteredProperties.map((property) => (
            <li key={property.id} className="propertyItem">
              <Link to={`/property/${property.id}`} className="propertyLink">
                {property.name} - {property.address}
              </Link>
              {(canEdit(property) || canDelete(property)) && (
                <div className="actionButtons">
                  {canEdit(property) && (
                    <button
                      className="pill-link"
                      onClick={() => handleEdit(property.id)}
                    >
                      Edit
                    </button>
                  )}
                  {canDelete(property) && (
                    <button
                      className="pill-link"
                      onClick={() => handleDelete(property.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="message">No properties found.</p>
      )}

      {/* Back to Dashboard Link */}
      <div className="backLink">
        <Link to="/dashboard" className="button-link">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default PropertiesList;
