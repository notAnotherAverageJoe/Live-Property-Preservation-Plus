// UnitRentDisplay.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import UnitRentDisplay from "../../components/Budgets/UnitRentDisplay";

describe("UnitRentDisplay", () => {
  test("displays total rent correctly with valid rent amounts", () => {
    const units = [
      { rent_amount: "1000.50" },
      { rent_amount: "500.00" },
      { rent_amount: "300.25" },
    ];
    render(<UnitRentDisplay units={units} />);

    expect(screen.getByText(/Total Rent/i)).toBeInTheDocument();
    expect(screen.getByText("$1800.75")).toBeInTheDocument(); // Total: 1000.50 + 500.00 + 300.25
  });

  test('displays "No units available" when no units are provided', () => {
    render(<UnitRentDisplay units={[]} />);

    expect(screen.getByText(/Total Rent/i)).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument(); // Total: 0.00
  });

  test("handles invalid rent amounts gracefully", () => {
    const units = [
      { rent_amount: "1000.50" },
      { rent_amount: "invalid" },
      { rent_amount: "500.00" },
    ];
    render(<UnitRentDisplay units={units} />);

    expect(screen.getByText(/Total Rent/i)).toBeInTheDocument();
    expect(screen.getByText("$1500.50")).toBeInTheDocument(); // Total: 1000.50 + 0 + 500.00
  });

  test("handles units with zero rent amount", () => {
    const units = [{ rent_amount: "0.00" }, { rent_amount: "0.00" }];
    render(<UnitRentDisplay units={units} />);

    expect(screen.getByText(/Total Rent/i)).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });
});
