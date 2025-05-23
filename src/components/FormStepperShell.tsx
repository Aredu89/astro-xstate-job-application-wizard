import { FormStateProvider } from '../context/FormStateContext';
import FormStepper from './FormStepperSolid';

export default function FormStepperShell() {
  return (
    <FormStateProvider>
      <FormStepper />
    </FormStateProvider>
  );
}
