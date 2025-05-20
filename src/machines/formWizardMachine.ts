import { assign, setup, assertEvent } from 'xstate';
import type { FormData } from "./types";

export const formWizardMachine = setup({
  types: {
    context: {} as {
      data: FormData;
      error?: string;
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
        error: "",
      };
    }),
    sendValidationError: assign(({}, params: { message: string }) => ({
      error: params?.message,
    })),
    cleanError: assign(() => ({
      error: "",
    })),
    logFinalData: ({ context }) => {
      console.log('Form submitted with data:', context.data);
    },
  },
}).createMachine({
  id: 'formWizard',
  initial: 'personalInfo',
  context: {
    data: {
      name: '',
      email: '',
    },
    error: '',
  },
  states: {
    personalInfo: {
      meta: { title: 'Your Info' },
      on: {
        NEXT: [
          {
            target: 'experience',
            actions: "assignFormData",
            guard: ({ event }) => !!event.value?.name && !!event.value?.email,
          },
          {
            target: "personalInfo",
            actions: {
              type: "sendValidationError",
              params: { message: "Please fill out both fields." }
            },
          },
        ],
      },
    },
    experience: {
      meta: { title: 'Work Experience' },
      on: {
        NEXT: [
          {
            target: 'portfolio',
            actions: "assignFormData",
            guard: ({ event }) =>
              typeof event.value?.experienceYears === 'number' &&
              !!event.value?.technologies,
          },
          {
            target: "experience",
            actions: {
              type: "sendValidationError",
              params: { message: "Please fill out both experience fields." }
            },
          },
        ],
        BACK: {
          target: 'personalInfo',
          actions: 'cleanError',
        },
      },
    },
    portfolio: {
      meta: { title: 'Portfolio' },
      on: {
        NEXT: [
          {
            target: 'upload',
            actions: "assignFormData",
            guard: ({ event }) => !!event.value?.portfolioLinks,
          },
          {
            target: "portfolio",
            actions: {
              type: "sendValidationError",
              params: { message: "Please enter at least one portfolio link." }
            },
          },
        ],
        BACK: {
          target: 'experience',
          actions: 'cleanError',
        },
      },
    },
    upload: {
      meta: { title: 'Resume' },
      on: {
        NEXT: [
          {
            target: 'review',
            actions: 'assignFormData',
            guard: ({ event }) => !!event.value?.fileName,
          },
          {
            target: "upload",
            actions: {
              type: "sendValidationError",
              params: { message: "Please upload a file." }
            },
          },
        ],
        BACK: {
          target: 'portfolio',
          actions: 'cleanError',
        },
      },
    },
    review: {
      meta: { title: 'Review your application' },
      on: {
        BACK: {
          target: 'upload',
          actions: 'cleanError',
        },
        SUBMIT: {
          target: 'submitted',
          actions: 'logFinalData',
        }
      }
    },
    submitted: { meta: { title: 'Application submitted' }, type: 'final' },
  },
});