import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@solidjs/testing-library';
import { useFormMachine } from './useFormMachine';

describe('useFormMachine', () => {
  let cleanup: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup?.();
  });

  it('should initialize to personalInfo step with empty error and correct title', () => {
    const hook = renderHook(() => useFormMachine());
    cleanup = hook.cleanup;

    expect(hook.result.currentStep()).toBe('personalInfo');
    expect(hook.result.error()).toBe('');
    expect(hook.result.title()).toBe('Your Info');
  });

  it('should go to next step when valid personal info is provided', () => {
    const hook = renderHook(() => useFormMachine());
    cleanup = hook.cleanup;

    hook.result.next({ name: 'Alice', email: 'alice@example.com' });

    expect(hook.result.currentStep()).toBe('experience');
    expect(hook.result.error()).toBe('');
    expect(hook.result.title()).toBe('Work Experience');

    const snapshot = hook.result.snapshot();
    expect(snapshot.context.data.name).toBe('Alice');
    expect(snapshot.context.data.email).toBe('alice@example.com');
  });

  it('should set error when NEXT is called with missing name/email', () => {
    const hook = renderHook(() => useFormMachine());
    cleanup = hook.cleanup;

    hook.result.next({ name: '' });

    expect(hook.result.currentStep()).toBe('personalInfo');
    expect(hook.result.error()).toBe('Please fill out both fields.');
  });

  it('should go back from experience to personalInfo', () => {
    const hook = renderHook(() => useFormMachine());
    cleanup = hook.cleanup;

    hook.result.next({ name: 'Alice', email: 'alice@example.com' });
    expect(hook.result.currentStep()).toBe('experience');

    hook.result.back();
    expect(hook.result.currentStep()).toBe('personalInfo');
  });

  it('should reach submitted step with full valid flow and log final data', () => {
    const hook = renderHook(() => useFormMachine());
    cleanup = hook.cleanup;

    hook.result.next({ name: 'Alice', email: 'alice@example.com' });
    hook.result.next({ experienceYears: 3, technologies: 'JS, TS' });
    hook.result.next({ portfolioLinks: 'https://github.com/alice' });
    hook.result.next({ fileName: 'cv.pdf' });

    expect(hook.result.currentStep()).toBe('review');

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    hook.result.submit();

    expect(hook.result.currentStep()).toBe('submitted');
    expect(logSpy).toHaveBeenCalledWith('Form submitted with data:', {
      name: 'Alice',
      email: 'alice@example.com',
      experienceYears: 3,
      technologies: 'JS, TS',
      portfolioLinks: 'https://github.com/alice',
      fileName: 'cv.pdf',
    });

    logSpy.mockRestore();
  });
});
