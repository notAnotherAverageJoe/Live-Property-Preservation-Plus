import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import SearchBar from "../../components/helper/SearchBar";

test("renders SearchBar with correct placeholder and handles input change", () => {
  const mockOnSearchChange = jest.fn();
  const placeholderText = "Search...";
  const searchTerm = "";

  render(
    <SearchBar
      searchTerm={searchTerm}
      onSearchChange={mockOnSearchChange}
      placeholderText={placeholderText}
    />
  );

  // Check if the input element is rendered with the correct placeholder
  const inputElement = screen.getByPlaceholderText(placeholderText);
  expect(inputElement).toBeInTheDocument();

  fireEvent.change(inputElement, { target: { value: "test" } });

  // Check if the onSearchChange function is called with the correct value
  expect(mockOnSearchChange).toHaveBeenCalledWith("test");
});
