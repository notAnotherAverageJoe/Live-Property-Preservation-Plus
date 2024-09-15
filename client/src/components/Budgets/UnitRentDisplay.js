import React from "react";
import "../styles/UnitRentDisplay.css";

function UnitRentDisplay({ units }) {
  // Calculate total rent
  const totalRent = units.length
    ? units.reduce((sum, unit) => {
        const rent = parseFloat(unit.rent_amount);
        return !isNaN(rent) ? sum + rent : sum;
      }, 0)
    : 0;

  return (
    <div className="unit-rent-display">
      <h3>Total Rent</h3>
      <p>${totalRent.toFixed(2) || "No units available"}</p>
    </div>
  );
}

export default UnitRentDisplay;
