import React from 'react';
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Control } from 'react-hook-form';
import type { AddressFormValues } from './types';

// South African provinces
const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

interface ProvinceSelectorProps {
  control: Control<AddressFormValues>;
}

/**
 * ProvinceSelector
 * @description Function
 */
export const ProvinceSelector: React.FC<ProvinceSelectorProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="province"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Province</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a province" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
