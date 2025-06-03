import { render, fireEvent } from "@solidjs/testing-library";
import { describe, it, expect, vi } from "vitest";
import ExperienceStep from "./Experience";
import { FormStateProvider } from "../context/FormStateContext";

describe("<ExperienceStep />", () => {
  it("renders inputs and updates form context", async () => {
    const { getByPlaceholderText } = render(() => (
      <FormStateProvider>
        <ExperienceStep />
      </FormStateProvider>
    ));

    const experienceInput = getByPlaceholderText("Years of Experience") as HTMLInputElement;
    const technologiesInput = getByPlaceholderText("Technologies used") as HTMLInputElement;

    // Initial state
    expect(experienceInput.value).toBe("");
    expect(technologiesInput.value).toBe("");

    // Simulate user input
    await fireEvent.input(experienceInput, { target: { value: "5" } });
    await fireEvent.input(technologiesInput, { target: { value: "React, Node.js" } });

    // Expect updated values in inputs
    expect(experienceInput.value).toBe("5");
    expect(technologiesInput.value).toBe("React, Node.js");
  });
});
