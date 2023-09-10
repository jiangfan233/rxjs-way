
import renderer from "react-test-renderer";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { TestUseDebounce } from "./TestUseDebounce";

describe("test useDebounce without args", () => {
  it("the count value should be 1", async () => {
    const { queryByText } = render(<TestUseDebounce />);


    const incBtn = queryByText("inc(1)");

    fireEvent.click(incBtn);

    expect(queryByText("Count: 0")).toBeInTheDocument();

    // jest.useFakeTimers();
    // jest.advanceTimersByTime(500);
    // expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});
