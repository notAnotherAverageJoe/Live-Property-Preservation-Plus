import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Weather from "../WeatherAPI/Weather";
import "../pagesCSS/Dashboard.css";
import { useAuth } from "../../contexts/AuthContext";

function Dashboard() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth(); // Access user context

  const accessLevel = user.access_level || 5;
  const isCreator = user.is_owner !== false;

  useEffect(() => {
    const fetchCompany = async () => {
      if (accessLevel < 1) {
        navigate("/login"); // Redirect if user doesn't have access
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:3000/api/user/company", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }

        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [accessLevel, navigate]);

  // Helper function to determine the visibility of links based on access level and company data
  const renderLinks = () => {
    const links = [];

    // Always show Create Company link if company data is not available
    if (!company && !loading) {
      links.push(
        <Link key="create-company" to="/create-company" className="button-link">
          Create a New Company
        </Link>
      );
    }

    // All Properties link for access level 1 or higher
    if (accessLevel >= 1) {
      links.push(
        <Link key="properties" to="/properties" className="button-link">
          All Properties
        </Link>
      );
    }

    // Additional links based on access level and company data
    if (accessLevel >= 2 && company) {
      links.push(
        <Link key="tenants" to="/tenants" className="button-link">
          Tenants
        </Link>
      );
    }

    if (accessLevel >= 3 && company) {
      links.push(
        <Link
          key="manage-leases"
          to="/leases-by-tenant/:tenantId"
          className="button-link"
        >
          Manage Leases
        </Link>
      );
    }

    if (accessLevel >= 4 && company) {
      links.push(
        <Link
          key="role-management"
          to="/dashboard/roles"
          className="button-link"
        >
          Role Management
        </Link>
      );
    }

    if (accessLevel >= 5 && company) {
      links.push(
        <Link key="create-user" to="/create-user" className="button-link">
          Create Company User
        </Link>
      );
    }

    if (accessLevel >= 10 || isCreator) {
      if (company) {
        links.push(
          <div key="company-info">
            <h2>Company Information</h2>
            <p>
              <strong>Name:</strong> {company.name}
            </p>
            <p>
              <strong>Address:</strong> {company.address}
            </p>
            <p>
              <strong>Company ID:</strong> {company.id}
            </p>
          </div>
        );
      }
    }

    return links;
  };

  return (
    <div className="dashboard-container">
      <h3>Dashboard</h3>

      {/* Render conditional content */}
      {renderLinks()}

      {loading && <p>Loading...</p>}

      {!company && !loading && accessLevel >= 2 && (
        <p>No company information available. Please create a company.</p>
      )}

      {accessLevel < 1 && !loading && (
        <p>You do not have access to view this dashboard.</p>
      )}

      {/* Weather Component always shown */}
      <Weather />
    </div>
  );
}

export default Dashboard;
