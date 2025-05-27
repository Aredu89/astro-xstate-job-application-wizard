import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import PersonalInfoStep from '../components/PersonalInfo'; // adjust path if needed
import { FormStateProvider } from '../context/FormStateContext';

describe('<PersonalInfoStep />', () => {
  it('renders name and email inputs and updates context on input', async () => {
    render(() => (
      <FormStateProvider>
        <PersonalInfoStep />
      </FormStateProvider>
    ));

    // Get the input fields
    const nameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Your Email') as HTMLInputElement;

    // Check initial values
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');

    // Simulate user input
    await fireEvent.input(nameInput, { target: { value: 'Alice' } });
    await fireEvent.input(emailInput, { target: { value: 'alice@example.com' } });

    // Check updated values
    expect(nameInput.value).toBe('Alice');
    expect(emailInput.value).toBe('alice@example.com');
  });
});