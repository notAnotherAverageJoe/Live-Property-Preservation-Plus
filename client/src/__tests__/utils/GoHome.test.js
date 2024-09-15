import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoToHome from "../../components/helper/GoTohome";
import { useNavigate } from "react-router-dom";

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(), // Mock the useNavigate hook
}));

describe("HomeButton Component", () => {
  it("renders the button and navigates to home on click", () => {
    const mockNavigate = jest.fn(); // Create a mock function
    useNavigate.mockReturnValue(mockNavigate); // Set the mock return value of useNavigate

    render(<GoToHome />); // Render the component

    // Check if the button is in the document
    const button = screen.getByRole("button", { name: /Go to Home/i });
    expect(button).toBeInTheDocument();

    // Simulate a button click
    fireEvent.click(button);

    // Assert that navigate was called with the home route
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
