import { assign, setup, assertEvent } from 'xstate';
import type { FormData } from "./types";

export const formWizardMachine = setup({
  types: {
    context: {} as {
      data: FormData;
    },
    events: {} as
      | { type: 'NEXT'; value?: Partial<FormData> }
      | { type: 'BACK' }
      | { type: 'SUBMIT' },
  },
  actions: {
    assignFormData: assign(({ context, event }) => {
      assertEvent(event, 'NEXT');
      return {
        data: {
          ...context.data,
          ...(event.value ?? {}),
        },
      };
    }),
  },
}).createMachine({
  id: 'formWizard',
  initial: 'personalInfo',
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
          actions: "assignFormData",
          guard: ({ event }) => !!event.value?.name && !!event.value?.email,
        },
      },
    },
    experience: {
      on: {
        NEXT: {
          target: 'portfolio',
          actions: "assignFormData",
          guard: ({ event }) =>
            typeof event.value?.experienceYears === 'number' &&
            !!event.value?.technologies,
        },
        BACK: 'personalInfo',
      },
    },
    portfolio: {
      on: {
        NEXT: {
          target: 'upload',
          actions: "assignFormData",
          guard: ({ event }) => !!event.value?.portfolioLinks,
        },
        BACK: 'experience',
      },
    },
    upload: {
      on: {
        NEXT: {
          target: 'review',
          actions: 'assignFormData',
          guard: ({ event }) => !!event.value?.fileName,
        },
        BACK: 'portfolio',
      },
    },
    review: { on: { SUBMIT: 'submitted', BACK: 'upload' } },
    submitted: { type: 'final' },
  },
});