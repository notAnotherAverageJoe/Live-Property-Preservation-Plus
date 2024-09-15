import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FinancialTransactionDisplay from "../../components/Budgets/FinancialTransactionDisplay";

describe("FinancialTransactionDisplay", () => {
  test("displays total transactions correctly with valid transactions", () => {
    const transactions = [
      { amount: "100.50" },
      { amount: "-20.00" },
      { amount: "50.25" },
    ];
    render(<FinancialTransactionDisplay transactions={transactions} />);

    expect(screen.getByText(/Total Transactions/i)).toBeInTheDocument();
    expect(screen.getByText("$130.75")).toBeInTheDocument(); // Total: 100.50 - 20.00 + 50.25
  });

  test('displays "No transactions available" when no transactions are provided', () => {
    render(<FinancialTransactionDisplay transactions={[]} />);

    expect(screen.getByText(/Total Transactions/i)).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  test("handles invalid transaction amounts gracefully", () => {
    const transactions = [
      { amount: "100.50" },
      { amount: "invalid" },
      { amount: "-50.00" },
    ];
    render(<FinancialTransactionDisplay transactions={transactions} />);

    expect(screen.getByText(/Total Transactions/i)).toBeInTheDocument();
    expect(screen.getByText("$50.50")).toBeInTheDocument(); // Total: 100.50 + 0 - 50.00
  });

  test("handles transactions with zero amount", () => {
    const transactions = [{ amount: "0.00" }, { amount: "0.00" }];
    render(<FinancialTransactionDisplay transactions={transactions} />);

    expect(screen.getByText(/Total Transactions/i)).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });
});
