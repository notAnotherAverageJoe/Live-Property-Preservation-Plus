import React from "react";
import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import axios from "axios";
import RoleAssignment from "../components/creationComponents/RolesAssignment";

// Mock the useAuth hook
jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    token: "test-token",
  }),
}));

// Mock axios
jest.mock("axios");

describe("RoleAssignment Component", () => {
  test("fetches and displays users", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: "1", first_name: "John", last_name: "Doe" },
        { id: "2", first_name: "Jane", last_name: "Doe" },
      ],
    });

    render(<RoleAssignment roles={[]} onRoleAssigned={() => {}} />);

    const userSelect = await screen.findByLabelText(/User:/i);
    expect(userSelect).toBeInTheDocument();
    expect(userSelect).toHaveTextContent("John Doe");
    expect(userSelect).toHaveTextContent("Jane Doe");
  });
});
