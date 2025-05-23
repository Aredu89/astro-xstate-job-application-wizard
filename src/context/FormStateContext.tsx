import { createContext, useContext, createSignal } from 'solid-js';
import type { Accessor, JSX } from 'solid-js';

type FormState = {
  name: string;
  email: string;
  experienceYears?: number;
  technologies: string;
  portfolioLinks: string;
  fileName: string;
};

type FormStateContextType = {
  form: Accessor<FormState>;
  setForm: (fields: Partial<FormState>) => void;
};

const FormStateContext = createContext<FormStateContextType>();

export function FormStateProvider(props: { children: JSX.Element }) {
  const [form, setFormState] = createSignal<FormState>({
    name: '',
    email: '',
    experienceYears: undefined,
    technologies: '',
    portfolioLinks: '',
    fileName: ''
  });

  const setForm = (fields: Partial<FormState>) => setFormState(prev => ({ ...prev, ...fields }));

  return (
    <FormStateContext.Provider value={{ form, setForm }}>
      {props.children}
    </FormStateContext.Provider>
  );
}

export function useFormState() {
  const ctx = useContext(FormStateContext);
  if (!ctx) throw new Error('useFormState must be used inside FormStateProvider');
  return ctx;
}
