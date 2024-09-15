import React, { useState, useEffect } from "react";
import axios from "axios";
import UnitRentDisplay from "./UnitRentDisplay";
import FinancialTransactionDisplay from "./FinancialTransactionDisplay";
import "../styles/BudgetForecast.css"; // Ensure correct path to CSS

function BudgetForecast() {
  const [budget, setBudget] = useState(0);
  const [units, setUnits] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/properties"
        );
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties", error);
        setError("Failed to fetch properties");
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProperty) return;

      try {
        const unitResponse = await axios.get(
          `http://localhost:3000/api/properties/${selectedProperty}/units`
        );
        const transactionResponse = await axios.get(
          `http://localhost:3000/api/properties/${selectedProperty}/financial-transactions`
        );

        setUnits(unitResponse.data || []);
        setTransactions(transactionResponse.data || []);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error("Data not found:", error);
          setError("No data available for the selected property.");
          setUnits([]);
          setTransactions([]);
        } else {
          console.error("Error fetching data", error);
          setError("Failed to fetch data");
        }
      }
    };

    fetchData();
  }, [selectedProperty]);

  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
  };

  // Calculate forecast
  const forecast =
    budget +
    units.reduce((sum, unit) => {
      const rent = parseFloat(unit.rent_amount);
      return !isNaN(rent) ? sum + rent : sum;
    }, 0) -
    transactions.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.amount);
      return !isNaN(amount) ? sum + amount : sum;
    }, 0);

  return (
    <div className="budget-forecast">
      <h2>Budget Forecast</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="property">Select Property:</label>
        <select
          id="property"
          value={selectedProperty || ""}
          onChange={handlePropertyChange}
        >
          <option value="">Select a property</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.name}
            </option>
          ))}
        </select>

        <label htmlFor="budget">Enter Budget:</label>
        <input
          type="number"
          id="budget"
          value={budget}
          onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
        />
      </form>

      {selectedProperty && (
        <div className="forecast-info">
          <UnitRentDisplay units={units} />
          <FinancialTransactionDisplay transactions={transactions} />
          <div className="summary-box">
            <p>
              <strong>Budget:</strong> ${budget.toFixed(2)}
            </p>
            <p>
              <strong>Forecast:</strong> ${forecast.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetForecast;
