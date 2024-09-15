import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/pages/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Mock the useAuth hook from AuthContext
jest.mock("../contexts/AuthContext");

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Preserve other router-dom exports
  useNavigate: jest.fn(),
}));

describe("Navbar Component", () => {
  let mockLogout, mockNavigate;

  beforeEach(() => {
    mockLogout = jest.fn(); // Mock the logout function
    mockNavigate = jest.fn(); // Mock the navigate function
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders login and register links when user is not logged in", () => {
    // Mock useAuth to simulate no user being logged in
    useAuth.mockReturnValue({ user: null, logout: mockLogout });

    // Render the Navbar within a router
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check if the login and register links are displayed
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
  });

  it("renders dashboard and profile links when user is logged in", () => {
    // Mock useAuth to simulate a logged-in user
    useAuth.mockReturnValue({
      user: { id: 1, name: "John Doe" },
      logout: mockLogout,
    });

    // Render the Navbar within a router
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check if the dashboard and profile links are displayed
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
  });

  it("calls logout and navigates to login on logout click", () => {
    // Mock useAuth to simulate a logged-in user
    useAuth.mockReturnValue({
      user: { id: 1, name: "John Doe" },
      logout: mockLogout,
    });

    // Render the Navbar within a router
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Find and click the logout link
    const logoutLink = screen.getByText(/logout/i);
    fireEvent.click(logoutLink);

    // Assert that logout was called and navigate was called with "/login"
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
