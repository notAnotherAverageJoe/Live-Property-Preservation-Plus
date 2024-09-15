import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionList from "../../components/financialComponents/TransactionList";
import "@testing-library/jest-dom";

describe("TransactionList", () => {
  // Sample transactions for testing
  const transactions = [
    {
      id: "1",
      type: "Flood",
      amount: 500,
      description: "Heavy rain",
      transaction_date: "2024-08-01T00:00:00Z",
    },
    {
      id: "2",
      type: "Roof",
      amount: 300,
      description: "Repairs",
      transaction_date: "2024-08-02T00:00:00Z",
    },
  ];

  it("renders transactions correctly", () => {
    render(
      <TransactionList
        transactions={transactions}
        onEdit={() => {}}
        onDelete={() => {}}
        canEdit={true}
        canDelete={true}
      />
    );

    // Check if transaction items are rendered correctly
    expect(screen.getByText(/Flood/i)).toBeInTheDocument();
    expect(screen.getByText(/Roof/i)).toBeInTheDocument();
    expect(screen.getByText(/Heavy/i)).toBeInTheDocument();
    expect(screen.getByText(/Repair/i)).toBeInTheDocument();
  });

  it("handles edit button click", () => {
    const handleEdit = jest.fn();

    render(
      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={() => {}}
        canEdit={true}
        canDelete={true}
      />
    );

    // Click edit button for first transaction
    fireEvent.click(screen.getAllByText(/Edit/i)[0]);

    // Verify if the edit handler was called with correct transaction
    expect(handleEdit).toHaveBeenCalledWith(transactions[0]);
  });

  it("handles delete button click", () => {
    const handleDelete = jest.fn();

    render(
      <TransactionList
        transactions={transactions}
        onEdit={() => {}}
        onDelete={handleDelete}
        canEdit={true}
        canDelete={true}
      />
    );

    // Click delete button for first transaction
    fireEvent.click(screen.getAllByText(/Delete/i)[0]);

    // Verify if the delete handler was called with correct transaction ID
    expect(handleDelete).toHaveBeenCalledWith("1");
  });

  it("does not show edit or delete buttons if canEdit and canDelete are false", () => {
    render(
      <TransactionList
        transactions={transactions}
        onEdit={() => {}}
        onDelete={() => {}}
        canEdit={false}
        canDelete={false}
      />
    );

    // Check if edit and delete buttons are not present
    expect(screen.queryByText(/Edit/i)).toBeNull();
    expect(screen.queryByText(/Delete/i)).toBeNull();
  });
});
