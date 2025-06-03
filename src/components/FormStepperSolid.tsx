import { Show } from "solid-js";
import PersonalInfoStep from "./PersonalInfo";
import ExperienceStep from "./Experience";
import PortfolioStep from "./Portfolio";
import UploadStep from "./Upload";
import ReviewInformationStep from "./ReviewInformation";
import Submitted from "./Submitted";
import FormButtons from "./FormButtons";
import { useFormMachine } from "../hooks/useFormMachine";
import { useFormState } from "../context/FormStateContext";

export default function FormStepper() {
  const { currentStep, error, title, snapshot, next, back, submit } = useFormMachine();
  const { form } = useFormState();

  const stepsMap = {
    personalInfo: () => <PersonalInfoStep />,
    experience: () => <ExperienceStep />,
    portfolio: () => <PortfolioStep />,
    upload: () => <UploadStep />,
    review: () => <ReviewInformationStep data={snapshot().context.data} />,
    submitted: () => <Submitted />,
  };

  const handleNext = () => next(form());

  return (
    <div>
      <h2 class="text-xl font-bold mb-4">Step: {title()}</h2>

      {stepsMap[currentStep()]?.()}

      <Show when={error()}>
        <p class="text-red-500 text-sm">{error()}</p>
      </Show>

      <FormButtons
        currentStep={currentStep}
        onBack={back}
        onNext={handleNext}
        onSubmit={submit}
      />
    </div>
  );
};