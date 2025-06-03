import { render, fireEvent } from "@solidjs/testing-library";
import { describe, it, expect, vi } from "vitest";
import FormButtons from "./FormButtons";

describe("<FormButtons />", () => {
  it("renders Back and Next buttons for middle steps and triggers handlers", async () => {
    const onBack = vi.fn();
    const onNext = vi.fn();
    const onSubmit = vi.fn();

    const { getByText, queryByText } = render(() => (
      <FormButtons
        currentStep={() => "portfolio"}
        onBack={onBack}
        onNext={onNext}
        onSubmit={onSubmit}
      />
    ));

    const backBtn = getByText("Back");
    const nextBtn = getByText("Next");
    const submitBtn = queryByText("Submit");

    expect(backBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeInTheDocument();

    await fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalled();

    await fireEvent.click(nextBtn);
    expect(onNext).toHaveBeenCalled();
  });

  it("renders only Submit button on review step", async () => {
    const onBack = vi.fn();
    const onNext = vi.fn();
    const onSubmit = vi.fn();

    const { getByText, queryByText } = render(() => (
      <FormButtons
        currentStep={() => "review"}
        onBack={onBack}
        onNext={onNext}
        onSubmit={onSubmit}
      />
    ));

    const backBtn = getByText("Back");
    const submitBtn = getByText("Submit");
    const nextBtn = queryByText("Next");

    expect(backBtn).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(nextBtn).not.toBeInTheDocument();

    await fireEvent.click(submitBtn);
    expect(onSubmit).toHaveBeenCalled();
  });

  it("renders only Next button on personalInfo step", () => {
    const { getByText, queryByText } = render(() => (
      <FormButtons
        currentStep={() => "personalInfo"}
        onBack={() => {}}
        onNext={() => {}}
        onSubmit={() => {}}
      />
    ));

    expect(getByText("Next")).toBeInTheDocument();
    expect(queryByText("Back")).not.toBeInTheDocument();
    expect(queryByText("Submit")).not.toBeInTheDocument();
  });
});
