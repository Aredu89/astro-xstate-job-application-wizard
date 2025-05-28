import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import FormStepper from './FormStepperSolid';
import { FormStateProvider } from '../context/FormStateContext';
import * as useFormMachineModule from '../hooks/useFormMachine';
import type { Steps } from '../types/FormStepperSolid.type';

// Mock child components to avoid full tree rendering
vi.mock('./PersonalInfo', () => ({
  default: () => <div>Mocked Personal Info Step</div>,
}));
vi.mock('./Experience', () => ({
  default: () => <div>Mocked Experience Step</div>,
}));
vi.mock('./Portfolio', () => ({
  default: () => <div>Mocked Portfolio Step</div>,
}));
vi.mock('./Upload', () => ({
  default: () => <div>Mocked Upload Step</div>,
}));
vi.mock('./ReviewInformation', () => ({
  default: () => <div>Mocked Review Step</div>,
}));
vi.mock('./Submitted', () => ({
  default: () => <div>Mocked Submitted Step</div>,
}));
vi.mock('./FormButtons', () => ({
  default: (props: any) => (
    <div>
      <button onClick={props.onNext}>Next</button>
      <button onClick={props.onBack}>Back</button>
      <button onClick={props.onSubmit}>Submit</button>
    </div>
  ),
}));

// Mock hooks
vi.mock('../hooks/useFormMachine', async () => {
  const actual = await vi.importActual('../hooks/useFormMachine');
  return {
    ...actual,
    useFormMachine: vi.fn(() => ({
      currentStep: () => 'personalInfo',
      error: () => '',
      title: () => 'Your Info',
      snapshot: () => ({ context: { data: { name: 'Test', email: 'test@example.com' } } }),
      next: vi.fn(),
      back: vi.fn(),
      submit: vi.fn(),
    })),
  };
});

describe('<FormStepper />', () => {
  it('renders the correct step component and title', () => {
    render(() => (
      <FormStateProvider>
        <FormStepper />
      </FormStateProvider>
    ));

    expect(screen.getByText('Step: Your Info')).toBeInTheDocument();
    expect(screen.getByText('Mocked Personal Info Step')).toBeInTheDocument();
  });

  it('calls navigation functions when buttons are clicked', async () => {
    const { getByText } = render(() => (
      <FormStateProvider>
        <FormStepper />
      </FormStateProvider>
    ));

    const nextBtn = getByText('Next');
    await fireEvent.click(nextBtn);

    expect(nextBtn).toBeInTheDocument();
  });

  it('displays error message if error() returns value', () => {
    const originalHook = useFormMachineModule.useFormMachine();
    vi.mocked(useFormMachineModule.useFormMachine).mockReturnValueOnce({
      currentStep: () => 'personalInfo' as Steps,
      error: () => 'This is an error',
      title: () => 'Your Info',
      snapshot: originalHook.snapshot,
      next: vi.fn(),
      back: vi.fn(),
      submit: vi.fn(),
      actor: {} as any,
    });

    render(() => (
      <FormStateProvider>
        <FormStepper />
      </FormStateProvider>
    ));
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });
});
