import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { EnhancedFormField } from './EnhancedFormField';
import { TooltipProvider } from './tooltip';

// Create a test component that uses the hooks
const TestComponent = (): void => {
  const methods = useForm({ defaultValues: { password: '' } });

  return (
    <TooltipProvider>
      <FormProvider {...methods}>
        <EnhancedFormField
          control={methods.control}
          name="password"
          label="Password"
          helperText="Use a strong password."
          securityBadgeType="encryption"
        />
      </FormProvider>
    </TooltipProvider>
  );
};

describe('EnhancedFormField', () => {
  it('renders with label, helper, and badge', () => {
    render(<TestComponent />);
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Use a strong password.')).toBeInTheDocument();
    expect(screen.getByTestId('security-badge-encryption')).toBeInTheDocument();
  });
});
