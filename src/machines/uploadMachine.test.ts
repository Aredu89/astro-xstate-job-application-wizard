import { describe, it, expect, vi } from 'vitest';
import { uploadMachine } from './uploadMachine';
import { createActor, assertEvent } from 'xstate';

describe('uploadMachine', () => {
  it('should send UPLOAD_SUCCESS to parent if fileName is present', async () => {
    const sendParent = vi.fn();

    const actor = createActor(uploadMachine.provide({
      actions: {
        sendUploadSuccessToParent: ({ event }) => {
          expect(event.type).toBe('UPLOAD.NEXT');
          assertEvent(event, 'UPLOAD.NEXT'),
          sendParent({ type: 'UPLOAD_SUCCESS', value: event.value });
        },
      }
    }));

    actor.start();
    actor.send({ type: 'UPLOAD.NEXT', value: { fileName: 'resume.pdf' } });

    expect(sendParent).toHaveBeenCalledWith({
      type: 'UPLOAD_SUCCESS',
      value: { fileName: 'resume.pdf' }
    });
  });

  it('should send UPLOAD_ERROR to parent if fileName is missing', async () => {
    const sendParent = vi.fn();

    const actor = createActor(uploadMachine.provide({
      actions: {
        sendUploadErrorToParent: ({ event }) => {
          expect(event.type).toBe('UPLOAD.NEXT');
          sendParent({ type: 'UPLOAD_ERROR', message: 'Please upload a file.' });
        },
      }
    }));

    actor.start();
    actor.send({ type: 'UPLOAD.NEXT', value: {} });

    expect(sendParent).toHaveBeenCalledWith({
      type: 'UPLOAD_ERROR',
      message: 'Please upload a file.'
    });
  });

  it('should send UPLOAD_BACK_REQUESTED to parent when BACK is pressed', () => {
    const sendParent = vi.fn();

    const actor = createActor(uploadMachine.provide({
      actions: {
        sendBackRequestedToParent: () => {
          sendParent({ type: 'UPLOAD_BACK_REQUESTED' });
        },
      }
    }));

    actor.start();
    actor.send({ type: 'UPLOAD.BACK' });

    expect(sendParent).toHaveBeenCalledWith({ type: 'UPLOAD_BACK_REQUESTED' });
  });
});
