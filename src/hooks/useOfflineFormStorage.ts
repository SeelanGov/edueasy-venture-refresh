import { UseFormReturn } from 'react-hook-form';
import { ApplicationFormValues } from '@/components/application/ApplicationFormFields';

// Local storage keys
export const LOCAL_STORAGE_FORM_KEY = 'edueasy-application-form';

export const useOfflineFormStorage = (
  form: UseFormReturn<ApplicationFormValues>,
  isOnline: boolean
) => {
  const saveFormToStorage = (data: ApplicationFormValues) => {
    localStorage.setItem(
      LOCAL_STORAGE_FORM_KEY,
      JSON.stringify({
        fullName: data.fullName,
        idNumber: data.idNumber,
        grade12Results: data.grade12Results,
        university: data.university,
        program: data.program,
      })
    );
  };

  const loadSavedForm = () => {
    const savedForm = localStorage.getItem(LOCAL_STORAGE_FORM_KEY);
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      form.reset(parsedForm);
    }
  };

  const clearSavedForm = () => {
    localStorage.removeItem(LOCAL_STORAGE_FORM_KEY);
  };

  return {
    saveFormToStorage,
    loadSavedForm,
    clearSavedForm,
  };
};
