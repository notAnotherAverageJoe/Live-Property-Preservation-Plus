import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "../components/pages/Login";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("axios");
jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    login: jest.fn(),
  })),
}));

describe("Login Component", () => {
  test("renders the component with expected text", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    const heading = screen.getByRole("heading", { name: /Login/i });
    expect(heading).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /Login/i });
    expect(submitButton).toBeInTheDocument();

    const creatorLabel = screen.getByText(/Creator/i);
    expect(creatorLabel).toBeInTheDocument();
  });
});
