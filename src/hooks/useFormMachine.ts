import { createSignal, onCleanup } from 'solid-js';
import { createActor } from 'xstate';
import { formWizardMachine } from '../machines/formWizardMachine';
import { Steps } from '../types/FormStepperSolid.type';
import type { FormData } from '../machines/types';

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

  const snapshot = () => actor.getSnapshot();

  const next = (value?: Partial<FormData>) => actor.send({ type: 'NEXT', value });
  const back = () => actor.send({ type: 'BACK' });
  const submit = () => actor.send({ type: 'SUBMIT' });

  return {
    actor,
    currentStep,
    error,
    title,
    next,
    back,
    submit,
    snapshot,
  };
};