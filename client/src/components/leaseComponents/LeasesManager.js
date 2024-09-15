import React, { useState, useEffect } from "react";
import axios from "axios";

const LeasesManager = () => {
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaseData, setLeaseData] = useState({
    unit_id: "",
    tenant_id: "",
    start_date: "",
    end_date: "",
    rent_amount: "",
  });

  useEffect(() => {
    fetchUnits();
    fetchTenants();
  }, []);

  const fetchUnits = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/units");
      setUnits(res.data);
    } catch (err) {
      setError("Failed to fetch units.");
    }
  };

  const fetchTenants = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/tenants");
      setTenants(res.data);
    } catch (err) {
      setError("Failed to fetch tenants.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setLeaseData({ ...leaseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (leaseData.start_date > leaseData.end_date) {
      alert("End date must be after the start date.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/leases", leaseData);
      alert("Lease created successfully");
      setLeaseData({
        unit_id: "",
        tenant_id: "",
        start_date: "",
        end_date: "",
        rent_amount: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create lease");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Create a Lease</h1>
      <form onSubmit={handleSubmit}>
        <select
          name="unit_id"
          value={leaseData.unit_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Unit</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.unit_number} - {unit.building_name}
            </option>
          ))}
        </select>

        <select
          name="tenant_id"
          value={leaseData.tenant_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Tenant</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.first_name} {tenant.last_name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="start_date"
          value={leaseData.start_date}
          onChange={handleInputChange}
          required
        />

        <input
          type="date"
          name="end_date"
          value={leaseData.end_date}
          onChange={handleInputChange}
          required
        />

        <input
          type="number"
          name="rent_amount"
          placeholder="Rent Amount"
          value={leaseData.rent_amount}
          onChange={handleInputChange}
          required
        />

        <button type="submit">Create Lease</button>
      </form>
    </div>
  );
};

export default LeasesManager;
