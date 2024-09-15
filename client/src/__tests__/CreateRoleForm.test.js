import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom";

import { useAuth } from "../contexts/AuthContext";
import CreateRoleForm from "../components/creationComponents/CreateRoleForm";

// Mock axios and useAuth
jest.mock("axios");
jest.mock("../contexts/AuthContext");

const mockRoles = [
  { id: 1, name: "Admin", access_level: 5 },
  { id: 2, name: "Editor", access_level: 3 },
];

describe("CreateRoleForm Component", () => {
  beforeEach(() => {
    // Mock useAuth hook
    useAuth.mockReturnValue({
      user: { id: 1, company_id: 101 },
      token: "fake-jwt-token",
    });
  });

  test("fetches and displays roles on component mount", async () => {
    axios.get.mockResolvedValueOnce({
      data: mockRoles,
    });

    render(<CreateRoleForm />);

    // Use findByText to wait for the roles to be displayed
    expect(await screen.findByText(/Admin/i)).toBeInTheDocument();
    expect(await screen.findByText(/Editor/i)).toBeInTheDocument();

    // Ensure axios.get was called to fetch the roles
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3000/api/roles", {
      headers: { Authorization: `Bearer fake-jwt-token` },
    });
  });

  test("handles API errors when fetching roles", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error fetching roles"));

    render(<CreateRoleForm />);

    // Use findByText to wait for the error message to appear
    expect(
      await screen.findByText("Error fetching roles.")
    ).toBeInTheDocument();
  });

  test("displays error when creating a role fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Error creating role"));

    render(<CreateRoleForm />);

    // Simulate user input and form submission
    fireEvent.change(screen.getByLabelText(/Role Name/i), {
      target: { value: "Test Role" },
    });
    fireEvent.change(screen.getByLabelText(/Access Level/i), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByText(/Create Role/i));

    // Use findByText to wait for the error message to appear
    expect(await screen.findByText("Error creating role.")).toBeInTheDocument();
  });
});
