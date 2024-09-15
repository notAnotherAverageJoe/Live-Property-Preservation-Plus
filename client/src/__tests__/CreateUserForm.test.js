import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import CreateUserForm from "../components/creationComponents/CreateUserForm";
import "@testing-library/jest-dom";

// Mock axios and useAuth
jest.mock("axios");
jest.mock("../contexts/AuthContext");

const mockUserRoles = ["admin", "editor", "user"];

describe("CreateUserForm Component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      token: "fake-jwt-token",
      user: { company_id: 101 },
    });
  });

  const renderWithRouter = (ui) => {
    return render(<Router>{ui}</Router>);
  };

  test("fetches and displays user roles correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: { roles: mockUserRoles } });

    renderWithRouter(<CreateUserForm />);

    // Wait for the roles to be fetched and displayed in the select element
    const roleSelect = await screen.findByLabelText(/Role:/i);
    expect(roleSelect).toBeInTheDocument();

    // Separate `waitFor` calls for each role option
    await waitFor(() => {
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Editor")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("User")).toBeInTheDocument();
    });
  });

  test("handles form submission error", async () => {
    axios.post.mockRejectedValueOnce(new Error("Error creating user"));
    window.alert = jest.fn(); // Mock alert function

    renderWithRouter(<CreateUserForm />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Role:/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText(/First Name:/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name:/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Create User/i));

    // Separate `waitFor` calls for each assertion
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Error creating user.");
    });
  });
});
