import { createSignal, onCleanup } from 'solid-js';
import { createActor } from 'xstate';
import { formWizardMachine } from '../machines/formWizardMachine';
import { Steps } from '../types/FormStepperSolid';

export function useFormMachine() {
  const [currentStep, setCurrentStep] = createSignal<Steps>(Steps.personalInfo);
  const [error, setError] = createSignal('');
  const [title, setTitle] = createSignal('');

  const actor = createActor(formWizardMachine);
  actor.subscribe((state) => {
    setCurrentStep(state.value as Steps);
    const newError = state.context.error ?? '';
    setError(prev => prev !== newError ? newError : prev);

    const meta = state.getMeta();
    const currentId = `${formWizardMachine.id}.${state.value}`;
    setTitle(meta[currentId as keyof typeof meta]?.title ?? state.value);
  });

  actor.start();
  onCleanup(() => actor.stop());

  return { actor, currentStep, error, title };
};