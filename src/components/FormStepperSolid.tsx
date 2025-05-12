import { createSignal, onCleanup } from 'solid-js';
import { createActor } from 'xstate';
import { formWizardMachine } from '../machines/formWizardMachine';

export default function FormStepper() {
  const [currentStep, setCurrentStep] = createSignal('personalInfo');

  const actor = createActor(formWizardMachine);

  actor.subscribe((state) => {
    setCurrentStep(state.value as string);
  });

  actor.start();

  onCleanup(() => actor.stop());

  return (
    <div>
      <h2 class="text-xl font-bold mb-4">Current Step: {currentStep()}</h2>

      <div class="space-x-2">
        {['personalInfo', 'experience', 'portfolio', 'upload'].includes(currentStep()) && (
          <button
            onClick={() => actor.send({ type: 'NEXT' })}
            class="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        )}

        {['experience', 'portfolio', 'upload', 'review'].includes(currentStep()) && (
          <button
            onClick={() => actor.send({ type: 'BACK' })}
            class="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Back
          </button>
        )}

        {currentStep() === 'review' && (
          <button
            onClick={() => actor.send({ type: 'SUBMIT' })}
            class="px-4 py-2 bg-green-500 text-white rounded"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}