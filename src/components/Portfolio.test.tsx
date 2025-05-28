import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import PortfolioStep from './Portfolio';
import { FormStateProvider, useFormState } from '../context/FormStateContext';

// Mock context
vi.mock('../context/FormStateContext', async () => {
  const actual = await vi.importActual('../context/FormStateContext');
  return {
    ...actual,
    useFormState: vi.fn(),
  };
});

describe('<PortfolioStep />', () => {
  it('renders with initial portfolio links and updates on input', async () => {
    const mockSetForm = vi.fn();

    // Set up mocked context state
    const mockUseFormState = useFormState as unknown as Mock;
    mockUseFormState.mockReturnValue({
      form: () => ({ portfolioLinks: 'https://site.com, https://github.com' }),
      setForm: mockSetForm,
    });

    render(() => <PortfolioStep />);

    const textarea = screen.getByPlaceholderText('Enter portfolio URLs (comma-separated)');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('https://site.com, https://github.com');

    // Simulate user typing
    await fireEvent.input(textarea, { target: { value: 'https://newlink.com' } });

    expect(mockSetForm).toHaveBeenCalledWith({ portfolioLinks: 'https://newlink.com' });
  });
});
