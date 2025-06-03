import { render, fireEvent } from "@solidjs/testing-library";
import { describe, it, expect, vi } from "vitest";
import Button from "./Button";

describe("<Button />", () => {
  it("renders with default styles and children", () => {
    const { getByText } = render(() => <Button>Click me</Button>);
    const button = getByText("Click me");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("px-4 py-2 rounded cursor-pointer");
  });

  it("applies custom className", () => {
    const { getByText } = render(() => (
      <Button class="bg-blue-500 text-white">Styled Button</Button>
    ));
    const button = getByText("Styled Button");
    expect(button).toHaveClass("bg-blue-500");
    expect(button).toHaveClass("text-white");
  });

  it("fires onClick handler when clicked", async () => {
    const handleClick = vi.fn();
    const { getByText } = render(() => (
      <Button onClick={handleClick}>Click Handler</Button>
    ));
    const button = getByText("Click Handler");
    await fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("has the correct default type", () => {
    const { getByText } = render(() => <Button>Default Type</Button>);
    const button = getByText("Default Type");
    expect(button).toHaveAttribute("type", "button");
  });

  it("respects custom type prop", () => {
    const { getByText } = render(() => <Button type="submit">Submit</Button>);
    const button = getByText("Submit");
    expect(button).toHaveAttribute("type", "submit");
  });
});
