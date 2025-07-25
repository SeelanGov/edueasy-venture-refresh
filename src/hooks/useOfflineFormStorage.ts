import type { UseFormReturn } from 'react-hook-form';
import type { ApplicationFormValues } from '@/components/application/ApplicationFormFields';

// Local storage keys

/**
 * LOCAL_STORAGE_FORM_KEY
 * @description Function
 */
export const LOCAL_STORAGE_FORM_KEY = 'edueasy-application-form';


/**
 * useOfflineFormStorage
 * @description Function
 */
export const useOfflineFormStorage = (
  form: UseFormReturn<ApplicationFormValues>,
  isOnline: boolean,
): void => {
  const saveFormToStorage = (data: ApplicationFormValues): void => {
    localStorage.setItem(
      LOCAL_STORAGE_FORM_KEY,
      JSON.stringify({
        fullName: data.fullName,
        idNumber: data.idNumber,
        grade12Results: data.grade12Results,
        university: data.university,
        program: data.program,
      }),
    );
  };

  const loadSavedForm = (): void => {
    const savedForm = localStorage.getItem(LOCAL_STORAGE_FORM_KEY);
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      form.reset(parsedForm);
    }
  };

  const clearSavedForm = (): void => {
    localStorage.removeItem(LOCAL_STORAGE_FORM_KEY);
  };

  return {
    saveFormToStorage,
    loadSavedForm,
    clearSavedForm,
  };
};
