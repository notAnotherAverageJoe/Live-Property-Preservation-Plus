import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { hasFullAccess } from "../../utils/accessUtils";
import SearchBar from "../helper/SearchBar";
import Pagination from "../helper/Pagination"; // Import Pagination component

const UnitsManager = ({ propertyId }) => {
  const { token, user } = useAuth();
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    unit_number: "",
    type: "",
    rent_amount: "",
  });
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const unitsPerPage = 5;
  const navigate = useNavigate();

  const unitNumberRef = useRef(null);
  const typeRef = useRef(null);
  const rentAmountRef = useRef(null);

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchUnits = useCallback(async () => {
    try {
      if (!propertyId) {
        console.error("No propertyId provided");
        return;
      }
      const response = await axios.get(
        `http://localhost:3000/api/properties/${propertyId}/units`
      );
      setUnits(response.data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  }, [propertyId, token]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rent_amount" && (value < 0 || isNaN(value))) {
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUnit) {
        await axios.put(
          `http://localhost:3000/api/units/${selectedUnit.id}`,
          formData
        );
      } else {
        await axios.post(`http://localhost:3000/api/units`, {
          ...formData,
          property_id: propertyId,
        });
      }
      fetchUnits();
      setFormData({ unit_number: "", type: "", rent_amount: "" });
      setSelectedUnit(null);
    } catch (error) {
      console.error("Error saving unit:", error);
    }
  };

  const handleEdit = (unit) => {
    setSelectedUnit(unit);
    setFormData({
      unit_number: unit.unit_number,
      type: unit.type,
      rent_amount: unit.rent_amount,
    });
    if (unitNumberRef.current) unitNumberRef.current.focus();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/units/${id}`);
      fetchUnits();
    } catch (error) {
      console.error("Error deleting unit:", error);
    }
  };

  const isCreator = user.is_owner !== false;
  const accessLevel = user.access_level || 5;

  const canView = isCreator || accessLevel >= 1;
  const canCreate = canView || accessLevel >= 2;
  const canEdit = accessLevel >= 3;
  const canDelete = accessLevel >= 4;

  const filteredUnits = units.filter(
    (unit) =>
      unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUnits.length / unitsPerPage);
  const indexOfLastUnit = currentPage * unitsPerPage;
  const indexOfFirstUnit = indexOfLastUnit - unitsPerPage;
  const currentUnits = filteredUnits.slice(indexOfFirstUnit, indexOfLastUnit);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Manage Units for Property {propertyId}</h2>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholderText="Search units (By Type, 1A1, 6B3, etc...)"
      />

      {canCreate && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="unit_number"
            placeholder="Unit / Bldg type(APT/BLDG/334..etc)"
            value={formData.unit_number}
            onChange={handleChange}
            required
            ref={unitNumberRef}
          />
          <input
            type="text"
            name="type"
            placeholder="Type (e.g., 1B1B)"
            value={formData.type}
            onChange={handleChange}
            ref={typeRef}
          />
          <input
            type="number"
            name="rent_amount"
            placeholder="Rent Amount"
            value={formData.rent_amount}
            onChange={handleChange}
            required
            ref={rentAmountRef}
            min="0"
          />
          <button type="submit">
            {selectedUnit ? "Update Unit" : "Create Unit"}
          </button>
        </form>
      )}

      {canView ? (
        <>
          <h2>Units</h2>
          <ul>
            {currentUnits.map((unit) => (
              <li key={unit.id} className="transaction-item">
                <span>
                  {unit.unit_number} ({unit.type}) - ${unit.rent_amount} - Unit
                  ID: {unit.id}
                </span>
                <button
                  onClick={() =>
                    navigate(
                      `/properties/${propertyId}/units/${unit.id}/requests`
                    )
                  }
                >
                  View Maintenance Requests
                </button>
                {canEdit && (
                  <button onClick={() => handleEdit(unit)}>Edit</button>
                )}
                {canDelete && (
                  <button onClick={() => handleDelete(unit.id)}>Delete</button>
                )}
              </li>
            ))}
          </ul>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        </>
      ) : (
        <p>You do not have permission to view units for this property.</p>
      )}
    </div>
  );
};

export default UnitsManager;
