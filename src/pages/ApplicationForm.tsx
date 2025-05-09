
import { Navbar } from "@/components/Navbar";
import { Form } from "@/components/ui/form";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import { OfflineNotice } from "@/components/application/OfflineNotice";
import { ApplicationFormFields } from "@/components/application/ApplicationFormFields";
import { FormActions } from "@/components/application/FormActions";
import { Separator } from "@/components/ui/separator";

const ApplicationForm = () => {
  const {
    form,
    isSubmitting,
    handleFileChange,
    onSubmit,
    handleSyncNow,
    isOnline
  } = useApplicationForm();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-cap-dark">Program Application</h1>
            <p className="text-gray-600 mt-1">Apply to your desired educational institution and program</p>
            <Separator className="mt-4" />
          </div>
          
          <OfflineNotice isOnline={isOnline} onSyncNow={handleSyncNow} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ApplicationFormFields 
                form={form} 
                isSubmitting={isSubmitting} 
                handleFileChange={handleFileChange} 
              />
              
              <Separator />
              
              <FormActions isSubmitting={isSubmitting} />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
