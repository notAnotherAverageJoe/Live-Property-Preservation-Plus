import React from "react";
import "../styles/FinancialTransactionDisplay.css"; // Create this CSS file for styling

function FinancialTransactionDisplay({ transactions }) {
  // Calculate total transactions (including negatives)
  const totalTransactions = transactions.length
    ? transactions.reduce((sum, transaction) => {
        const amount = parseFloat(transaction.amount);
        return !isNaN(amount) ? sum + amount : sum;
      }, 0)
    : 0;

  return (
    <div className="financial-transaction-display">
      <h3>Total Transactions</h3>
      <p>${totalTransactions.toFixed(2) || "No transactions available"}</p>
    </div>
  );
}

export default FinancialTransactionDisplay;
