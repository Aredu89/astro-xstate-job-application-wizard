import { render, screen, cleanup } from "@solidjs/testing-library";
import { describe, it, expect, afterEach } from 'vitest';
import ReviewInformationStep from './ReviewInformation';
import type { FormData } from '../machines/types';

describe('<ReviewInformationStep />', () => {
  const baseData: Omit<FormData, 'fileName'> = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    experienceYears: 3,
    technologies: 'Vue, Solid',
    portfolioLinks: 'https://example.com, https://portfolio.com',
  };

  afterEach(cleanup);

  it('displays all fields with "None" when fileName is undefined', () => {
    render(() => <ReviewInformationStep data={{ ...baseData, fileName: undefined }} />);

    expect(screen.getByText('Name:', { selector: 'strong' }).parentElement).toHaveTextContent('Name: Jane Doe');
    expect(screen.getByText('Email:', { selector: 'strong' }).parentElement).toHaveTextContent('Email: jane@example.com');
    expect(screen.getByText('Years Experience:', { selector: 'strong' }).parentElement).toHaveTextContent('Years Experience: 3');
    expect(screen.getByText('Skills:', { selector: 'strong' }).parentElement).toHaveTextContent('Skills: Vue, Solid');
    expect(screen.getByText('Portfolio URL:', { selector: 'strong' }).parentElement).toHaveTextContent(
      'Portfolio URL: https://example.com, https://portfolio.com'
    );
    expect(screen.getByText('Uploaded File:', { selector: 'strong' }).parentElement).toHaveTextContent('Uploaded File: None');
  });

  it('displays the uploaded file name when fileName is defined', () => {
    render(() => <ReviewInformationStep data={{ ...baseData, fileName: 'resume.pdf' }} />);

    expect(screen.getByText('Uploaded File:', { selector: 'strong' }).parentElement).toHaveTextContent('Uploaded File: resume.pdf');
  });
});
