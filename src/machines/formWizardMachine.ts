import { createMachine } from 'xstate';

export const formWizardMachine = createMachine({
  id: 'formWizard',
  initial: 'personalInfo',
  states: {
    personalInfo: { on: { NEXT: 'experience' } },
    experience: { on: { NEXT: 'portfolio', BACK: 'personalInfo' } },
    portfolio: { on: { NEXT: 'upload', BACK: 'experience' } },
    upload: { on: { NEXT: 'review', BACK: 'portfolio' } },
    review: { on: { SUBMIT: 'submitted', BACK: 'upload' } },
    submitted: { type: 'final' },
  },
});