import { createSignal, onCleanup, Show } from 'solid-js';
import { createActor } from 'xstate';
import { formWizardMachine } from '../machines/formWizardMachine';

export default function FormStepper() {
  const [currentStep, setCurrentStep] = createSignal('personalInfo');
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [error, setError] = createSignal('');
  const [experienceYears, setExperienceYears] = createSignal<number | ''>('');
  const [technologies, setTechnologies] = createSignal('');
  const [portfolioLinks, setPortfolioLinks] = createSignal('');

  const actor = createActor(formWizardMachine);

  actor.subscribe((state) => {
    setCurrentStep(state.value as string);
    setError('');
  });

  actor.start();
  onCleanup(() => actor.stop());

  const next = () => {
    if (currentStep() === 'personalInfo') {
      const value = { name: name(), email: email() };
      actor.send({ type: 'NEXT', value });
      const current = actor.getSnapshot();
      if (current.matches('personalInfo')) {
        setError('Please fill out both fields.');
      }
    } else if (currentStep() === 'experience') {
      const value = {
        experienceYears: Number(experienceYears()),
        technologies: technologies()
      };
      actor.send({ type: 'NEXT', value });
      const current = actor.getSnapshot();
      if (current.matches('experience')) {
        setError('Please fill out both experience fields.');
      }
    } else if (currentStep() === 'portfolio') {
      const value = {
        portfolioLinks: portfolioLinks()
      };
      actor.send({ type: 'NEXT', value });
      const current = actor.getSnapshot();
      if (current.matches('portfolio')) {
        setError('Please enter at least one portfolio link.');
      }
    } else {
      actor.send({ type: 'NEXT' });
    }
  };
  const back = () => actor.send({ type: 'BACK' });
  const submit = () => actor.send({ type: 'SUBMIT' });

  return (
    <div>
      <h2 class="text-xl font-bold mb-4">Step: {currentStep()}</h2>

      <Show when={currentStep() === 'personalInfo'}>
        <div class="space-y-2">
          <input
            placeholder="Your Name"
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            class="border p-2 rounded w-full"
          />
          <input
            placeholder="Your Email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            class="border p-2 rounded w-full"
          />
          <Show when={error()}>
            <p class="text-red-500 text-sm">{error()}</p>
          </Show>
        </div>
      </Show>

      <Show when={currentStep() === "experience"}>
        <div class="space-y-2">
          <input
            type="number"
            placeholder="Years of Experience"
            value={experienceYears()}
            onInput={(e) => setExperienceYears(e.currentTarget.valueAsNumber)}
            class="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Technologies used"
            value={technologies()}
            onInput={(e) => setTechnologies(e.currentTarget.value)}
            class="border p-2 rounded w-full"
          />
          <Show when={error()}>
            <p class="text-red-500 text-sm">{error()}</p>
          </Show>
        </div>
      </Show>

      <Show when={currentStep() === 'portfolio'}>
        <div class="space-y-2">
          <textarea
            placeholder="Enter portfolio URLs (comma-separated)"
            value={portfolioLinks()}
            onInput={(e) => setPortfolioLinks(e.currentTarget.value)}
            class="border p-2 rounded w-full"
            rows="4"
          />
          <Show when={error()}>
            <p class="text-red-500 text-sm">{error()}</p>
          </Show>
        </div>
      </Show>

      <div class="space-x-2">
        {['experience', 'portfolio', 'upload', 'review'].includes(currentStep()) && (
          <button onClick={back} class="px-4 py-2 bg-gray-500 text-white rounded">
            Back
          </button>
        )}
        {['personalInfo', 'experience', 'portfolio', 'upload'].includes(currentStep()) && (
          <button onClick={next} class="px-4 py-2 bg-blue-500 text-white rounded">
            Next
          </button>
        )}
        {currentStep() === 'review' && (
          <button onClick={submit} class="px-4 py-2 bg-green-500 text-white rounded">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};