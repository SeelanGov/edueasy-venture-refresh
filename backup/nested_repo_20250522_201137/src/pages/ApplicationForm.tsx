
import { useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Form } from "@/components/ui/form";
import { OfflineNotice } from "@/components/application/OfflineNotice";
import { ApplicationFormFields } from "@/components/application/ApplicationFormFields";
import { FormActions } from "@/components/application/FormActions";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { ThandiAgent } from "@/components/ai/ThandiAgent";
import { useApplicationFormManager } from "@/hooks/useApplicationFormManager";
import { SkipToContent } from "@/components/ui/skip-to-content";
import { ApplicationFormValues } from "@/components/application/ApplicationFormFields";

const ApplicationForm = () => {
  const {
    form,
    isSubmitting,
    isSavingDraft,
    handleFileChange,
    onSubmit,
    saveDraft,
    handleSyncNow,
    isOnline,
    hasSavedDraft,
    initializeForm
  } = useApplicationFormManager();

  const mainContentRef = useRef<HTMLDivElement>(null);
  const formId = "application-form";

  // Initialize form on component mount
  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SkipToContent contentId="main-content" />
      <Navbar />
      
      <main 
        id="main-content" 
        className="container mx-auto px-4 py-8 pt-24 md:pt-28"
        tabIndex={-1}
        ref={mainContentRef}
      >
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 md:p-8">
          <header className="mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-cap-dark dark:text-white">Program Application</h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mt-1">Apply to your desired educational institution and program</p>
            {hasSavedDraft && (
              <div 
                className="mt-2 text-sm md:text-base text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20 p-2 md:p-3 rounded border border-green-200 dark:border-green-800"
                role="status"
                aria-live="polite"
              >
                You have a saved draft application that has been loaded.
              </div>
            )}
            <Separator className="mt-4 md:mt-6" />
          </header>
          
          <OfflineNotice isOnline={isOnline} onSyncNow={handleSyncNow} />

          <Form {...form}>
            <form 
              onSubmit={onSubmit} 
              className="space-y-6 md:space-y-8"
              id={formId}
              aria-label="Program application form"
            >
              <fieldset disabled={isSubmitting || isSavingDraft}>
                <legend className="sr-only">Application Information</legend>
                <ApplicationFormFields 
                  form={form} 
                  isSubmitting={isSubmitting || isSavingDraft} 
                  handleFileChange={handleFileChange} 
                />
              </fieldset>
              
              <Separator className="md:mt-8" />
              
              <FormActions 
                isSubmitting={isSubmitting}
                isSaving={isSavingDraft}
                onSaveDraft={saveDraft}
                formId={formId}
              />
            </form>
          </Form>
        </div>
      </main>
      <Toaster />
      <ThandiAgent />
    </div>
  );
};

export default ApplicationForm;
