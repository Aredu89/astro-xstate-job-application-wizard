import { createSignal, onCleanup, Show } from 'solid-js';
import { createActor } from 'xstate';
import { formWizardMachine } from '../machines/formWizardMachine';
import Button from "./Button";
import PersonalInfoStep from './PersonalInfo';
import ExperienceStep from './Experience';
import PortfolioStep from './Portfolio';

export default function FormStepper() {
  const [currentStep, setCurrentStep] = createSignal('personalInfo');
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [error, setError] = createSignal('');
  const [experienceYears, setExperienceYears] = createSignal<number | ''>('');
  const [technologies, setTechnologies] = createSignal('');
  const [portfolioLinks, setPortfolioLinks] = createSignal('');
  const [fileName, setFileName] = createSignal('');
  const [title, setTitle] = createSignal('');

  const actor = createActor(formWizardMachine);
  const snapshot = () => actor.getSnapshot();
  const data = () => snapshot().context.data;

  actor.subscribe((state) => {
    setCurrentStep(state.value as string);

    const newError = state.context.error ?? '';
    setError(prev => prev !== newError ? newError : prev);

    const meta = state.getMeta();
    const currentId = `${formWizardMachine.id}.${snapshot().value}`;
    setTitle((meta[currentId as keyof typeof meta])?.title ?? snapshot().value);
  });

  actor.start();
  onCleanup(() => actor.stop());

  const next = () => {
    if (currentStep() === 'personalInfo') {
      const value = { name: name(), email: email() };
      actor.send({ type: 'NEXT', value });
    } else if (currentStep() === 'experience') {
      const value = {
        experienceYears: Number(experienceYears()),
        technologies: technologies()
      };
      actor.send({ type: 'NEXT', value });
    } else if (currentStep() === 'portfolio') {
      const value = {
        portfolioLinks: portfolioLinks()
      };
      actor.send({ type: 'NEXT', value });
    } else if (currentStep() === 'upload') {
      const value = { fileName: fileName() }
      actor.send({ type: 'NEXT', value });
    }  else {
      actor.send({ type: 'NEXT' });
    }
  };
  const back = () => actor.send({ type: 'BACK' });
  const submit = () => actor.send({ type: 'SUBMIT' });

  return (
    <div>
      <h2 class="text-xl font-bold mb-4">Step: {title()}</h2>

      <Show when={currentStep() === 'personalInfo'}>
        <PersonalInfoStep
          name={name()}
          setName={setName}
          email={email()}
          setEmail={setEmail}
        />
      </Show>

      <Show when={currentStep() === "experience"}>
        <ExperienceStep
          experienceYears={experienceYears()}
          setExperienceYears={setExperienceYears}
          technologies={technologies()}
          setTechnologies={setTechnologies}
        />
      </Show>

      <Show when={currentStep() === 'portfolio'}>
        <PortfolioStep
          portfolioLinks={portfolioLinks()}
          setPortfolioLinks={setPortfolioLinks}
        />
      </Show>

      <Show when={currentStep() === 'upload'}>
        <div class="space-y-2">
          <input
            type="file"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              if (file) {
                setFileName(file.name);
              }
            }}
            class="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
          />
          <Show when={fileName()}>
            <p class="text-sm text-gray-700">Uploaded file: {fileName()}</p>
          </Show>
        </div>
      </Show>

      <Show when={currentStep() === 'review'}>
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Review Your Information</h3>
          <ul class="list-disc ml-5 space-y-1 text-sm">
            <li><strong>Name:</strong> {data().name}</li>
            <li><strong>Email:</strong> {data().email}</li>
            <li><strong>Years Experience:</strong> {data().experienceYears}</li>
            <li><strong>Skills:</strong> {data().technologies}</li>
            <li><strong>Portfolio URL:</strong> {data().portfolioLinks}</li>
            <li><strong>Uploaded File:</strong> {data().fileName ?? 'None'}</li>
          </ul>
        </div>
      </Show>

      <Show when={currentStep() === 'submitted'}>
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Thank you for applying!</h3>
        </div>
      </Show>

      <Show when={error()}>
        <p class="text-red-500 text-sm">{error()}</p>
      </Show>

      <div class="space-x-2 mt-2">
        {['experience', 'portfolio', 'upload', 'review'].includes(currentStep()) && (
          <Button onClick={back} class="bg-gray-500 text-white">
            Back
          </Button>
        )}
        {['personalInfo', 'experience', 'portfolio', 'upload'].includes(currentStep()) && (
          <Button onClick={next} class="bg-blue-500 text-white">
            Next
          </Button>
        )}
        {currentStep() === 'review' && (
          <Button onClick={submit} class="bg-green-500 text-white">
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};