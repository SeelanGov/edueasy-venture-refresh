
import { Navbar } from "@/components/Navbar";
import { Form } from "@/components/ui/form";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import { OfflineNotice } from "@/components/application/OfflineNotice";
import { ApplicationFormFields } from "@/components/application/ApplicationFormFields";
import { FormActions } from "@/components/application/FormActions";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";

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
    hasSavedDraft
  } = useApplicationForm();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-cap-dark">Program Application</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Apply to your desired educational institution and program</p>
            {hasSavedDraft && (
              <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                You have a saved draft application that has been loaded.
              </div>
            )}
            <Separator className="mt-4" />
          </div>
          
          <OfflineNotice isOnline={isOnline} onSyncNow={handleSyncNow} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ApplicationFormFields 
                form={form} 
                isSubmitting={isSubmitting || isSavingDraft} 
                handleFileChange={handleFileChange} 
              />
              
              <Separator />
              
              <FormActions 
                isSubmitting={isSubmitting}
                isSaving={isSavingDraft}
                onSaveDraft={saveDraft}
              />
            </form>
          </Form>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ApplicationForm;
