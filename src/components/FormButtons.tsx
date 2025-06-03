import Button from "./Button";

export default function FormButtons(props: {
  currentStep: () => string;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  return (
    <div class="space-x-2 mt-2">
      {["experience", "portfolio", "upload", "review"].includes(props.currentStep()) && (
        <Button onClick={props.onBack} class="bg-gray-500 text-white">Back</Button>
      )}
      {["personalInfo", "experience", "portfolio", "upload"].includes(props.currentStep()) && (
        <Button onClick={props.onNext} class="bg-blue-500 text-white">Next</Button>
      )}
      {props.currentStep() === "review" && (
        <Button onClick={props.onSubmit} class="bg-green-500 text-white">Submit</Button>
      )}
    </div>
  );
};