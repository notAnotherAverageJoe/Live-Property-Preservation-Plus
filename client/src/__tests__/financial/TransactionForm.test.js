import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionForm from "../../components/financialComponents/TransactionForm";
import "@testing-library/jest-dom";

// Mock props
const defaultProps = {
  transaction: {
    type: "",
    amount: "",
    description: "",
    transactionDate: "",
  },
  onChange: jest.fn(),
  onSubmit: jest.fn(),
  editingTransactionId: null,
};

describe("TransactionForm", () => {
  it("renders the form with empty fields when not editing", () => {
    render(<TransactionForm {...defaultProps} />);

    expect(screen.getByPlaceholderText(/Type/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Amount/i)).toHaveValue(null);
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Transaction Date/i)).toHaveValue("");
    expect(screen.getByText(/Add Transaction/i)).toBeInTheDocument();
  });

  it("renders the form with fields pre-filled when editing", () => {
    const props = {
      ...defaultProps,
      transaction: {
        type: "Flood",
        amount: 500,
        description: "Heavy rain",
        transactionDate: "2024-08-01",
      },
      editingTransactionId: "1",
    };

    render(<TransactionForm {...props} />);

    expect(screen.getByPlaceholderText(/Type/i)).toHaveValue("Flood");
    expect(screen.getByPlaceholderText(/Amount/i)).toHaveValue(500); // Ensure Amount value is a number
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue(
      "Heavy rain"
    );
    expect(screen.getByPlaceholderText(/Transaction Date/i)).toHaveValue(
      "2024-08-01"
    );
    expect(screen.getByText(/Update Transaction/i)).toBeInTheDocument();
  });

  it("calls onChange handler when input values change", () => {
    render(<TransactionForm {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText(/Type/i), {
      target: { value: "Flood" },
    });
    expect(defaultProps.onChange).toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText(/Amount/i), {
      target: { value: "500" },
    });
    expect(defaultProps.onChange).toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "Heavy rain" },
    });
    expect(defaultProps.onChange).toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText(/Transaction Date/i), {
      target: { value: "2024-08-01" },
    });
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it("calls onSubmit handler when form is submitted", () => {
    render(<TransactionForm {...defaultProps} />);

    fireEvent.submit(screen.getByRole("button", { name: /Add Transaction/i }));

    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
});
