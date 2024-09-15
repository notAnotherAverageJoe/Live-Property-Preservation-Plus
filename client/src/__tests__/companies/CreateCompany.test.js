import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import CreateCompany from "../../components/creationComponents/CreateCompany";

describe("CreateCompany Component", () => {
  it("renders form inputs and submit button", () => {
    render(
      <MemoryRouter>
        <CreateCompany />
      </MemoryRouter>
    );

    // Check if form inputs and button are rendered
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Company/i })
    ).toBeInTheDocument();
  });
});
