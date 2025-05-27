import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { formWizardMachine } from './formWizardMachine';

describe('formWizardMachine', () => {
  it('starts at personalInfo state', () => {
    const actor = createActor(formWizardMachine).start();
    expect(actor.getSnapshot().value).toBe('personalInfo');
  });

  it('goes to experience on valid personalInfo NEXT', () => {
    const actor = createActor(formWizardMachine).start();
    actor.send({ type: 'NEXT', value: { name: 'John', email: 'john@example.com' } });
    expect(actor.getSnapshot().value).toBe('experience');
  });

  it('stays in personalInfo on invalid NEXT and sets error', () => {
    const actor = createActor(formWizardMachine).start();
    actor.send({ type: 'NEXT', value: { name: '', email: '' } });
    const snapshot = actor.getSnapshot();
    expect(snapshot.value).toBe('personalInfo');
    expect(snapshot.context.error).toBe('Please fill out both fields.');
  });

  it('goes back to personalInfo from experience on BACK', () => {
    const actor = createActor(formWizardMachine).start();
    actor.send({ type: 'NEXT', value: { name: 'John', email: 'john@example.com' } });
    expect(actor.getSnapshot().value).toBe('experience');
    actor.send({ type: 'BACK' });
    expect(actor.getSnapshot().value).toBe('personalInfo');
  });

  it('runs through all valid steps and ends in submitted', () => {
    const actor = createActor(formWizardMachine).start();

    actor.send({ type: 'NEXT', value: { name: 'Jane', email: 'jane@example.com' } });
    actor.send({ type: 'NEXT', value: { experienceYears: 3, technologies: 'React,Node' } });
    actor.send({ type: 'NEXT', value: { portfolioLinks: 'https://portfolio.com' } });
    actor.send({ type: 'NEXT', value: { fileName: 'resume.pdf' } });
    actor.send({ type: 'SUBMIT' });

    expect(actor.getSnapshot().value).toBe('submitted');
  });

  it('validates experience step fields correctly', () => {
    const actor = createActor(formWizardMachine).start();

    actor.send({ type: 'NEXT', value: { name: 'Jane', email: 'jane@example.com' } });
    actor.send({ type: 'NEXT', value: { experienceYears: 0, technologies: '' } });

    expect(actor.getSnapshot().value).toBe('experience');
    expect(actor.getSnapshot().context.error).toBe('Please fill out both experience fields.');
  });
});
