import React from "react";

function SearchBar({ searchTerm, onSearchChange, placeholderText }) {
  return (
    <input
      type="text"
      placeholder={placeholderText}
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
}

export default SearchBar;
