import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../../components/helper/Pagination";
import "@testing-library/jest-dom";

describe("Pagination Component", () => {
  test("renders correctly with initial props", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />
    );

    expect(screen.getByText(/Page 1 of 5/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Next/i })).not.toBeDisabled();
  });

  test("calls onPageChange with correct arguments when Next button is clicked", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Next/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test("calls onPageChange with correct arguments when Previous button is clicked", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Previous/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  test("disables Next button on the last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={jest.fn()} />
    );

    expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
  });

  test("disables Previous button on the first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />
    );

    expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
  });
});
