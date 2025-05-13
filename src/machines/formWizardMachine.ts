import { createMachine, assign } from 'xstate';
import type { FormData } from "./types";

export const formWizardMachine = createMachine({
  id: 'formWizard',
  initial: 'personalInfo',
  types: {
    context: {} as {
      data: FormData;
    },
    events: {} as
      | { type: 'NEXT'; value?: Partial<FormData> }
      | { type: 'BACK' }
      | { type: 'SUBMIT' },
  },
  context: {
    data: {
      name: '',
      email: '',
    },
  },
  states: {
    personalInfo: {
      on: {
        NEXT: {
          target: 'experience',
          actions: assign({
            data: ({ context, event }) => ({
              ...context.data,
              ...event.value,
            }),
          }),
          guard: ({ event }) => !!event.value?.name && !!event.value?.email,
        },
      },
    },
    experience: {
      on: {
        NEXT: {
          target: 'portfolio',
          actions: assign(({ context, event }) => ({
            data: {
              ...context.data,
              ...(event.value ?? {}),
            },
          })),
          guard: ({ event }) =>
            typeof event.value?.experienceYears === 'number' &&
            !!event.value?.technologies,
        },
        BACK: 'personalInfo',
      },
    },
    portfolio: { on: { NEXT: 'upload', BACK: 'experience' } },
    upload: { on: { NEXT: 'review', BACK: 'portfolio' } },
    review: { on: { SUBMIT: 'submitted', BACK: 'upload' } },
    submitted: { type: 'final' },
  },
});