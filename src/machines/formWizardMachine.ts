import { assign, setup, assertEvent, sendTo } from 'xstate';
import type { FormData } from "./types";
import { uploadMachine } from "./uploadMachine";

export const formWizardMachine = setup({
  types: {
    context: {} as {
      data: FormData;
      error?: string;
    },
    events: {} as
      | { type: 'NEXT'; value?: Partial<FormData> }
      | { type: 'BACK' }
      | { type: 'SUBMIT' }
      | { type: 'UPLOAD_SUCCESS'; value: Partial<FormData> }
      | { type: 'UPLOAD_ERROR'; message: string }
      | { type: 'UPLOAD_BACK_REQUESTED' },
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
    assignUploadedData: assign(({ context, event }) => {
      assertEvent(event, 'UPLOAD_SUCCESS');
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
  actors: {
    uploadActor: uploadMachine,
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
      invoke: [
        {
          id: 'uploadService',
          src: 'uploadActor',
        },
      ],
      on: {
        UPLOAD_SUCCESS: {
          target: 'review',
          actions: 'assignUploadedData',
        },
        UPLOAD_ERROR: {
          actions: {
            type: "sendValidationError",
            params: ({ event }) => {
              assertEvent(event, 'UPLOAD_ERROR');
              return { message: event.message };
            },
          },
        },
        UPLOAD_BACK_REQUESTED: {
          target: 'portfolio',
          actions: 'cleanError',
        },
        NEXT: {
          actions: sendTo(
            'uploadService',
            ({ event }) => {
              assertEvent(event, 'NEXT');
              return { type: 'UPLOAD.NEXT', value: event.value };
            }
          ),
        },
        BACK: {
          actions: sendTo(
            'uploadService',
            { type: 'UPLOAD.BACK' }
          ),
        },
      },
      exit: 'cleanError',
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