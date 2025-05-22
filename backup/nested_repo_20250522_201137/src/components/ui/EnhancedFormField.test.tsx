import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { EnhancedFormField } from './EnhancedFormField';
import { useForm, FormProvider } from 'react-hook-form';
import React from 'react';
import { TooltipProvider } from './tooltip';

function FormWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { password: '' } });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('EnhancedFormField', () => {
  it('renders with label, helper, and badge', () => {
    render(
      <TooltipProvider>
        <FormWrapper>
          <EnhancedFormField
            control={undefined} // control is provided by FormProvider context
            name="password"
            label="Password"
            helperText="Use a strong password."
            securityBadgeType="encryption"
          />
        </FormWrapper>
      </TooltipProvider>
    );
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Use a strong password.')).toBeInTheDocument();
    expect(screen.getByTestId('security-badge-encryption')).toBeInTheDocument();
  });
});
