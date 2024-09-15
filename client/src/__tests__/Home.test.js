import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

import Home from "../components/pages/Home";

test("renders the component with expected text", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  const expectedText = /preservation/i;
  const element = screen.getByText(expectedText);

  expect(element).toBeInTheDocument();
});
