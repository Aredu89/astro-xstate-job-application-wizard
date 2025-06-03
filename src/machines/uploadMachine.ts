// uploadMachine.ts
import { setup, assertEvent, sendParent } from 'xstate';
import type { FormData } from "./types";

export const uploadMachine = setup({
  types: {
    context: {} as {},
    events: {} as
      | { type: 'UPLOAD.NEXT'; value?: Partial<FormData> }
      | { type: 'UPLOAD.BACK' }
      | { type: 'UPLOAD_SUCCESS'; value: Partial<FormData> }
      | { type: 'UPLOAD_ERROR'; message: string }
      | { type: 'UPLOAD_BACK_REQUESTED' },
  },
  actions: {
    sendUploadSuccessToParent: sendParent(({ event }) => {
      assertEvent(event, 'UPLOAD.NEXT');
      if (event.value === undefined) {
        throw new Error("Logic error: event.value should not be undefined when sending UPLOAD_SUCCESS");
      }
      return { type: 'UPLOAD_SUCCESS', value: event.value } as const;
    }),
    sendUploadErrorToParent: sendParent(({ event }) => { 
        assertEvent(event, 'UPLOAD.NEXT');
        return { type: 'UPLOAD_ERROR', message: "Please upload a file." } as const;
    }),
    sendBackRequestedToParent: sendParent({ type: 'UPLOAD_BACK_REQUESTED' } as const),
  },
}).createMachine({
  id: 'uploadMachine',
  initial: 'idle',
  states: {
    idle: {
      on: {
        'UPLOAD.NEXT': [
          {
            actions: "sendUploadSuccessToParent",
            guard: ({ event }) => {
                assertEvent(event, 'UPLOAD.NEXT');
                return !!event.value?.fileName;
            },
          },
          {
            actions: "sendUploadErrorToParent",
            guard: ({ event }) => {
                assertEvent(event, 'UPLOAD.NEXT');
                return !event.value?.fileName;
            }
          },
        ],
        'UPLOAD.BACK': {
          actions: "sendBackRequestedToParent",
        }
      },
    },
  },
});