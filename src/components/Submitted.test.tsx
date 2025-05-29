import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import SubmittedStep from './Submitted';

describe('<SubmittedStep />', () => {
  it('renders thank you message', () => {
    render(() => <SubmittedStep />);
    expect(screen.getByText('Thank you for applying!')).toBeInTheDocument();
  });
});