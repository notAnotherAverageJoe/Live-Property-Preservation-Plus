import React, { useRef } from "react";
import "../styles/TransactionForm.css";

const TransactionForm = ({
  transaction,
  onChange,
  onSubmit,
  editingTransactionId,
}) => {
  const typeRef = useRef(null);
  const amountRef = useRef(null);
  const descriptionRef = useRef(null);
  const transactionDateRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate the amount field
    if (name === "amount") {
      // Allow only numeric input (including decimals)
      if (/^\d*\.?\d*$/.test(value)) {
        onChange(e);
      }
    } else {
      onChange(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate amount field
    if (!/^\d*\.?\d*$/.test(transaction.amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    // Proceed with form submission
    onSubmit(e);
  };

  // Focus the appropriate field when editing
  React.useEffect(() => {
    if (editingTransactionId) {
      // Adjust focus as needed
      if (typeRef.current) typeRef.current.focus();
    }
  }, [editingTransactionId]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="type"
        value={transaction.type}
        onChange={handleInputChange}
        placeholder="Type"
        ref={typeRef} // Attach ref
      />
      <input
        type="number"
        name="amount"
        value={transaction.amount}
        onChange={handleInputChange}
        placeholder="Amount"
        min="0"
        step="0.01"
        ref={amountRef} // Attach ref
      />
      <input
        type="text"
        name="description"
        value={transaction.description}
        onChange={handleInputChange}
        placeholder="Description"
        ref={descriptionRef} // Attach ref
      />
      <input
        type="date"
        name="transactionDate"
        value={transaction.transactionDate}
        onChange={handleInputChange}
        placeholder="Transaction Date"
        ref={transactionDateRef} // Attach ref
      />
      <button type="submit">
        {editingTransactionId ? "Update Transaction" : "Add Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;
