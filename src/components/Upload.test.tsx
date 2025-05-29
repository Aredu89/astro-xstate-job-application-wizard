import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import UploadStep from './Upload';
import { FormStateProvider, useFormState } from '../context/FormStateContext';

describe('<UploadStep />', () => {
  it('renders file input', () => {
    render(() => (
      <FormStateProvider>
        <UploadStep />
      </FormStateProvider>
    ));

    const fileInput = screen.getByTestId('file-input');
    expect(fileInput).toBeInTheDocument();
  });

  it('updates and displays file name when a file is selected', async () => {
    render(() => (
      <FormStateProvider>
        <UploadStep />
      </FormStateProvider>
    ));

    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    // Simulate file upload
    await fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(screen.getByText('Uploaded file: resume.pdf')).toBeInTheDocument();
  });
});
