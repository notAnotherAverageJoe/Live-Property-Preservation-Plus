import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import CreateLease from "./CreateLease";
import SearchBar from "../helper/SearchBar";

const LeasesListByCompany = () => {
  const [leases, setLeases] = useState([]);
  const [filteredLeases, setFilteredLeases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [decodedToken, setDecodedToken] = useState(null); // State for decoded token

  const fetchLeases = async (companyId) => {
    setLoading(true);
    setSubmitted(true);

    try {
      const url = `http://localhost:3000/api/leases?company_id=${companyId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLeases(response.data);
      setFilteredLeases(response.data); // Initialize filteredLeases with all leases
    } catch (error) {
      setError(
        "Error fetching leases: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCompanyIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const tokenData = jwtDecode(token);
        setDecodedToken(tokenData); // Set decoded token to state
        const companyId = tokenData.company_id; // Extract company_id from the token

        if (companyId) {
          fetchLeases(companyId); // Call fetchLeases with companyId
        } else {
          setError("Company ID not found in token.");
        }
      } catch (e) {
        setError("Failed to decode token.");
      }
    };

    fetchCompanyIdFromToken(); // Trigger fetching on component mount
  }, []); // Empty dependency array means this effect runs once on mount

  const handleUpdateLease = async (leaseId, updatedLease) => {
    if (!decodedToken) {
      setError("No token decoded. Unable to update lease.");
      return;
    }

    try {
      const updatedLeaseWithISO = {
        ...updatedLease,
        start_date: toISODate(updatedLease.start_date),
        end_date: toISODate(updatedLease.end_date),
      };
      console.log("Payload to update lease:", updatedLeaseWithISO); // Log payload for debugging
      const response = await axios.put(
        `http://localhost:3000/api/leases/${leaseId}`,
        updatedLeaseWithISO,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add Authorization header
          },
        }
      );
      console.log("Update response:", response); // Log response for debugging
      alert("Lease updated successfully");
      fetchLeases(decodedToken.company_id); // Refetch leases after update
    } catch (error) {
      console.error("Error updating lease:", error); // Log error for debugging
      setError(
        "Error updating lease: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDeleteLease = async (leaseId) => {
    try {
      await axios.delete(`http://localhost:3000/api/leases/${leaseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Lease deleted successfully");
      setLeases(leases.filter((lease) => lease.id !== leaseId));
      setFilteredLeases(filteredLeases.filter((lease) => lease.id !== leaseId));
    } catch (error) {
      setError(
        "Error deleting lease: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleLeaseChange = (e, leaseId, field) => {
    const updatedLeases = leases.map((lease) => {
      if (lease.id === leaseId) {
        return { ...lease, [field]: e.target.value };
      }
      return lease;
    });
    setLeases(updatedLeases);
    setFilteredLeases(updatedLeases); // Update filteredLeases as well
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const toISODate = (dateString) => new Date(dateString).toISOString();

  const handleSearchChange = (searchTerm) => {
    setSearchTerm(searchTerm);
    const filtered = leases.filter((lease) =>
      String(lease.unit_id).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLeases(filtered);
  };

  // Callback function to refetch leases after creating a new lease
  const handleLeaseCreated = () => {
    if (decodedToken) {
      fetchLeases(decodedToken.company_id);
    }
  };

  return (
    <div>
      <CreateLease onLeaseCreated={handleLeaseCreated} />
      <h3>Leases by Company</h3>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholderText="Search by Unit ID"
      />
      {submitted && (
        <>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {filteredLeases.length > 0 ? (
            <ul>
              {filteredLeases.map((lease) => (
                <li key={lease.id}>
                  <label>
                    Unit ID:
                    <input
                      type="text"
                      value={lease.unit_id}
                      onChange={(e) =>
                        handleLeaseChange(e, lease.id, "unit_id")
                      }
                    />
                  </label>

                  <label>
                    Start Date:
                    <input
                      type="date"
                      value={formatDate(lease.start_date)}
                      onChange={(e) =>
                        handleLeaseChange(e, lease.id, "start_date")
                      }
                    />
                  </label>

                  <label>
                    End Date:
                    <input
                      type="date"
                      value={formatDate(lease.end_date)}
                      onChange={(e) =>
                        handleLeaseChange(e, lease.id, "end_date")
                      }
                    />
                  </label>

                  <label>
                    Rent Amount:
                    <input
                      type="number"
                      value={lease.rent_amount}
                      onChange={(e) =>
                        handleLeaseChange(e, lease.id, "rent_amount")
                      }
                    />
                  </label>

                  <label>
                    Status:
                    <select
                      value={lease.status}
                      onChange={(e) => handleLeaseChange(e, lease.id, "status")}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>

                  <button onClick={() => handleUpdateLease(lease.id, lease)}>
                    Update Lease
                  </button>
                  <button onClick={() => handleDeleteLease(lease.id)}>
                    Delete Lease
                  </button>
                  <hr />
                  <br />
                </li>
              ))}
            </ul>
          ) : (
            !loading && <p>No leases found for this company.</p>
          )}
        </>
      )}
    </div>
  );
};

export default LeasesListByCompany;
