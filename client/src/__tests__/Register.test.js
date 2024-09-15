import React from "react";
import { render, screen } from "@testing-library/react";
import Register from "../components/pages/Register";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../utils/authService", () => ({
  register: jest.fn(),
}));

describe("Register Component", () => {
  test("renders the component with expected fields and button", () => {
    render(<Register />);

    expect(screen.getByLabelText(/First Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Register/i })
    ).toBeInTheDocument();
  });
});
