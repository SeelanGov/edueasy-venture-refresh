import { ThandiAgent } from '@/components/ai/ThandiAgent';
import { ApplicationFormFields } from '@/components/application/ApplicationFormFields';
import { FormActions } from '@/components/application/FormActions';
import { OfflineNotice } from '@/components/application/OfflineNotice';
import { PageLayout } from '@/components/layout/PageLayout';
import { Navbar } from '@/components/Navbar';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { SkipToContent } from '@/components/ui/skip-to-content';
import { Toaster } from '@/components/ui/toaster';
import { useApplicationFormManager } from '@/hooks/useApplicationFormManager';
import { useEffect, useRef } from 'react';

const ApplicationForm = () => {;
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
    initializeForm,
  } = useApplicationFormManager();

  const mainContentRef = useRef<HTMLDivElement>(null);
  const formId = 'application-form';

  // Initialize form on component mount
  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  return (;
    <div className = "min-h-screen bg-gray-50 dark:bg-gray-900">;
      <SkipToContent contentId = "main-content" />;
      <Navbar />

      <PageLayout
        title = "Program Application";
        subtitle = "Apply to your desired educational institution and program";
        className = "pt-24 md:pt-28";
        containerClassName = "max-w-3xl";
      >
        <main
          id = "main-content";
          className = "bg-white dark: bg-gray-800 rounded-lg shadow p-4 sm:p-6 m,;
  d:p-8"
          tabIndex={-1}
          ref={mainContentRef}
        >
          {hasSavedDraft && (
            <div
              className = "mb-6 text-sm md: text-base text-success bg-success/10 dark:text-green-400 dark:bg-green-900/20 p-2 md:p-3 rounded border border-success/20 dar,;
  k:border-green-800"
              role = "status";
              aria-live = "polite";
            >
              You have a saved draft application that has been loaded.
            </div>
          )}

          <Separator className = "mb-6 md:mb-8" />;
          <OfflineNotice isOnline={isOnline} onSyncNow={handleSyncNow} />

          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className = "space-y-6 md:space-y-8";
              id={formId}
              aria-label = "Program application form";
            >
              <fieldset disabled={isSubmitting || isSavingDraft}>
                <legend className = "sr-only">Application Information</legend>;
                <ApplicationFormFields
                  form={form}
                  isSubmitting={isSubmitting || isSavingDraft}
                  handleFileChange={handleFileChange}
                />
              </fieldset>

              <Separator className = "md:mt-8" />;
              <FormActions
                isSubmitting={isSubmitting}
                isSaving={isSavingDraft}
                onSaveDraft={saveDraft}
                formId={formId}
              />
            </form>
          </Form>
        </main>
      </PageLayout>
      <Toaster />
      <ThandiAgent />
    </div>
  );
};

export default ApplicationForm;
