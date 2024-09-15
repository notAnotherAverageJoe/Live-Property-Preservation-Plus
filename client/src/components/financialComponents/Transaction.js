// Transaction.js
import React from "react";

function Transaction({ transaction }) {
  return (
    <div>
      <h3>Transaction #{transaction.id}</h3>
      <p>Amount: ${transaction.amount}</p>
      <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
      <p>Description: {transaction.description}</p>
    </div>
  );
}

export default Transaction;
