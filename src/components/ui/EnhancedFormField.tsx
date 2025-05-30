import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SecurityBadge } from '@/components/ui/SecurityBadge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, Info, XCircle } from 'lucide-react';
import { Control, FieldValues, Path } from 'react-hook-form';

interface EnhancedFormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  tooltip?: string;
  helperText?: string;
  validationStatus?: 'valid' | 'invalid' | undefined;
  disabled?: boolean;
  securityBadgeType?: 'encryption' | 'data-protection' | 'privacy' | 'verification';
  maxLength?: number;
  patternExample?: string;
}

export const EnhancedFormField = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  required = false,
  type = 'text',
  placeholder,
  tooltip,
  helperText,
  validationStatus,
  disabled = false,
  securityBadgeType,
  maxLength,
  patternExample,
}: EnhancedFormFieldProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="relative">
          <div className="flex items-center gap-1 mb-1">
            <FormLabel className="font-semibold text-gray-800">
              {label}
              {required && (
                <span className="text-red-500 ml-0.5" aria-label="required">
                  *
                </span>
              )}
            </FormLabel>
            {securityBadgeType && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    tabIndex={0}
                    aria-label={`${securityBadgeType} badge`}
                    className="outline-none"
                  >
                    <SecurityBadge type={securityBadgeType} size="sm" showLabel={false} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {securityBadgeType === 'encryption' &&
                    'Encryption: This field is encrypted in storage.'}
                  {securityBadgeType === 'data-protection' &&
                    'Data Protection: This field is protected by data privacy policies.'}
                  {securityBadgeType === 'privacy' &&
                    'Privacy: This field contains private information.'}
                  {securityBadgeType === 'verification' &&
                    'Verification: This field is used for verification purposes.'}
                </TooltipContent>
              </Tooltip>
            )}
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    tabIndex={0}
                    aria-label={`Info about ${label}`}
                    className="ml-1 cursor-pointer"
                  >
                    <Info className="h-4 w-4 text-gray-400" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            )}
          </div>
          <FormControl>
            <div
              className={`relative transition-all duration-200 ${fieldState.invalid ? 'border-red-500 bg-red-50 animate-shake' : fieldState.isTouched && !fieldState.invalid ? 'border-green-500 bg-green-50' : ''} rounded-md`}
            >
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                className={`pr-10 ${fieldState.invalid ? 'border-red-500' : fieldState.isTouched && !fieldState.invalid ? 'border-green-500' : ''}`}
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? `${name}-error` : undefined}
              />
              {validationStatus === 'valid' && (
                <CheckCircle
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 h-5 w-5"
                  aria-label="Valid"
                />
              )}
              {fieldState.invalid && (
                <XCircle
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 h-5 w-5 animate-shake"
                  aria-label="Invalid"
                />
              )}
            </div>
          </FormControl>
          {helperText && !fieldState.invalid && (
            <div className="text-xs text-gray-500 mt-1 animate-fade-in">{helperText}</div>
          )}
          {patternExample && (
            <div className="text-xs text-blue-500 mt-1 animate-fade-in">
              Example: {patternExample}
            </div>
          )}
          {maxLength && (
            <div className="text-xs text-gray-400 mt-1 animate-fade-in" aria-live="polite">
              {field.value?.length || 0}/{maxLength} characters
            </div>
          )}
          <FormMessage className="text-xs font-semibold animate-fade-in" id={`${name}-error`} />
        </FormItem>
      )}
    />
  );
};

// CSS for shake animation (add to index.css if not present):
// @keyframes shake { 0% { transform: translateX(0); } 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } 100% { transform: translateX(0); } }
// .animate-shake { animation: shake 0.3s; }
// .animate-fade-in { animation: fadeIn 0.3s ease-out; opacity: 1; }
