// components/TransactionList.js
import React from "react";
import "../styles/TransactionsList.css"; // Make sure you import the CSS file

const TransactionList = ({
  transactions,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  return (
    <ul className="transaction-list">
      {transactions.map((trans) => (
        <li key={trans.id} className="transaction-item">
          <strong>{trans.type}</strong>: ${trans.amount} on{" "}
          {new Date(trans.transaction_date).toLocaleDateString()}
          <br />
          Description: {trans.description}
          <br />
          {(canEdit || canDelete) && (
            <div className="button-container">
              {canEdit && <button onClick={() => onEdit(trans)}>Edit</button>}
              {canDelete && (
                <button onClick={() => onDelete(trans.id)}>Delete</button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;
