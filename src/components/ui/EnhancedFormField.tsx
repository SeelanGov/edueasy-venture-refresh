import React from 'react';
import { cn } from '@/lib/utils';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Control } from 'react-hook-form';

interface EnhancedFormFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'number';
  placeholder?: string;
  helperText?: string;
  tooltip?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

/**
 * EnhancedFormField
 * @description Enhanced form field component with tooltip and helper text
 */
export const EnhancedFormField: React.FC<EnhancedFormFieldProps> = ({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  helperText,
  tooltip,
  required = false,
  disabled = false,
  className,
  rows = 3,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn('space-y-2', className)}>
          <FormLabel className="flex items-center gap-2">
            {label}
            {required && <span className="text-destructive">*</span>}
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {type === 'textarea' ? (
                <Textarea
                  placeholder={placeholder}
                  disabled={disabled}
                  rows={rows}
                  className={cn(
                    fieldState.error && 'border-destructive focus-visible:ring-destructive'
                  )}
                  {...field}
                />
              ) : (
                <Input
                  type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={cn(
                    fieldState.error && 'border-destructive focus-visible:ring-destructive'
                  )}
                  {...field}
                />
              )}
              {type === 'password' && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={disabled}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          {helperText && (
            <FormDescription className="text-sm text-muted-foreground">
              {helperText}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};