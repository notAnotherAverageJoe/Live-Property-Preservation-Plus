import React, { useState, useEffect } from "react";
import axios from "axios";

const LeasesList = () => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeases = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      const companyId = JSON.parse(atob(token.split(".")[1])).company_id;
      try {
        const res = await axios.get(
          `http://localhost:3000/api/leases/company/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLeases(res.data);
      } catch (err) {
        setError("Failed to fetch leases.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeases();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Leases List</h1>
      {leases.length > 0 ? (
        <ul>
          {leases.map((lease) => (
            <li key={lease.id}>
              <strong>Unit:</strong> {lease.unit_id} - <strong>Tenant:</strong>{" "}
              {lease.tenant_id} -<strong> Start Date:</strong>{" "}
              {lease.start_date} - <strong>End Date:</strong> {lease.end_date} -
              <strong> Rent Amount:</strong> ${lease.rent_amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No leases found.</p>
      )}
    </div>
  );
};

export default LeasesList;
