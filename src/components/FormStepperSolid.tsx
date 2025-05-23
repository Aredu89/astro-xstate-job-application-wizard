import { createSignal, onCleanup, Show } from 'solid-js';
import { createActor } from 'xstate';
import { formWizardMachine } from '../machines/formWizardMachine';
import PersonalInfoStep from './PersonalInfo';
import ExperienceStep from './Experience';
import PortfolioStep from './Portfolio';
import UploadStep from './Upload';
import ReviewInformationStep from './ReviewInformation';
import Submitted from './Submitted';
import FormButtons from './FormButtons';
import { Steps } from '../types/FormStepperSolid';

export default function FormStepper() {
  const [currentStep, setCurrentStep] = createSignal<Steps>(Steps.personalInfo);
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
    setCurrentStep(state.value as Steps);

    const newError = state.context.error ?? '';
    setError(prev => prev !== newError ? newError : prev);

    const meta = state.getMeta();
    const currentId = `${formWizardMachine.id}.${snapshot().value}`;
    setTitle((meta[currentId as keyof typeof meta])?.title ?? snapshot().value);
  });

  actor.start();
  onCleanup(() => actor.stop());

  const stepsMap = {
    personalInfo: () => (
      <PersonalInfoStep
        name={name()}
        setName={setName}
        email={email()}
        setEmail={setEmail}
      />
    ),
    experience: () => (
      <ExperienceStep
        experienceYears={experienceYears()}
        setExperienceYears={setExperienceYears}
        technologies={technologies()}
        setTechnologies={setTechnologies}
      />
    ),
    portfolio: () => (
      <PortfolioStep
        portfolioLinks={portfolioLinks()}
        setPortfolioLinks={setPortfolioLinks}
      />
    ),
    upload: () => (
      <UploadStep
        fileName={fileName()}
        setFileName={setFileName}
      />
    ),
    review: () => (
      <ReviewInformationStep data={data()} />
    ),
    submitted: () => (
      <Submitted />
    ),
  };

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

      {stepsMap[currentStep()]?.()}

      <Show when={error()}>
        <p class="text-red-500 text-sm">{error()}</p>
      </Show>

      <FormButtons
        currentStep={currentStep}
        onBack={back}
        onNext={next}
        onSubmit={submit}
      />
    </div>
  );
};