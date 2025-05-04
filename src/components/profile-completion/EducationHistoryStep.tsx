
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { Spinner } from "@/components/Spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

// South African provinces
const provinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

// Common South African high school subjects
const commonSubjects = [
  "English",
  "Afrikaans",
  "isiZulu",
  "isiXhosa",
  "Mathematics",
  "Mathematical Literacy",
  "Physical Sciences",
  "Life Sciences",
  "Geography",
  "History",
  "Accounting",
  "Business Studies",
  "Economics",
  "Life Orientation",
  "Computer Applications Technology",
  "Information Technology",
  "Consumer Studies",
  "Tourism",
];

const subjectMarkSchema = z.object({
  id: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  mark: z.coerce
    .number()
    .min(0, "Mark must be between 0 and 100")
    .max(100, "Mark must be between 0 and 100"),
});

const educationSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  province: z.string().min(2, "Province is required"),
  completionYear: z.coerce
    .number()
    .min(1990, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  grade11Subjects: z.array(subjectMarkSchema)
    .min(6, "You must include at least 6 subjects for Grade 11"),
  grade12Subjects: z.array(subjectMarkSchema)
    .min(6, "You must include at least 6 subjects for Grade 12"),
});

type EducationFormValues = z.infer<typeof educationSchema>;

interface EducationHistoryStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export const EducationHistoryStep = ({ onComplete, onBack }: EducationHistoryStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { educationInfo, setEducationInfo } = useProfileCompletionStore();
  const [activeTab, setActiveTab] = useState("grade11");
  
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      schoolName: educationInfo.schoolName || "",
      province: educationInfo.province || "",
      completionYear: educationInfo.completionYear || new Date().getFullYear(),
      grade11Subjects: educationInfo.grade11Subjects?.length > 0 
        ? educationInfo.grade11Subjects 
        : Array(7).fill(0).map(() => ({ id: uuidv4(), subject: "", mark: 0 })),
      grade12Subjects: educationInfo.grade12Subjects?.length > 0
        ? educationInfo.grade12Subjects
        : Array(7).fill(0).map(() => ({ id: uuidv4(), subject: "", mark: 0 })),
    },
  });
  
  const { fields: grade11Fields, append: appendGrade11, remove: removeGrade11 } = 
    useFieldArray({
      control: form.control,
      name: "grade11Subjects",
    });
    
  const { fields: grade12Fields, append: appendGrade12, remove: removeGrade12 } = 
    useFieldArray({
      control: form.control,
      name: "grade12Subjects",
    });

  const onSubmit = async (data: EducationFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Save education record to Supabase
      const { data: educationRecord, error: educationError } = await supabase
        .from('education_records')
        .insert({
          user_id: user.id,
          school_name: data.schoolName,
          province: data.province,
          completion_year: data.completionYear,
        })
        .select()
        .single();
        
      if (educationError) throw educationError;
      
      // Save Grade 11 subject marks
      if (educationRecord) {
        const grade11Marks = data.grade11Subjects.map(subject => ({
          education_record_id: educationRecord.id,
          subject_name: subject.subject,
          grade_level: 'grade11',
          mark: subject.mark,
        }));
        
        const { error: grade11Error } = await supabase
          .from('subject_marks')
          .insert(grade11Marks);
          
        if (grade11Error) throw grade11Error;
        
        // Save Grade 12 subject marks
        const grade12Marks = data.grade12Subjects.map(subject => ({
          education_record_id: educationRecord.id,
          subject_name: subject.subject,
          grade_level: 'grade12',
          mark: subject.mark,
        }));
        
        const { error: grade12Error } = await supabase
          .from('subject_marks')
          .insert(grade12Marks);
          
        if (grade12Error) throw grade12Error;
      }
      
      // Save to store
      setEducationInfo({
        schoolName: data.schoolName,
        province: data.province,
        completionYear: data.completionYear,
        grade11Subjects: data.grade11Subjects,
        grade12Subjects: data.grade12Subjects,
      });
      
      onComplete();
    } catch (error) {
      console.error("Error saving education info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Education History</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your school name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map(province => (
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
          </div>
          
          <FormField
            control={form.control}
            name="completionYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of Completion</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="YYYY" 
                    min={1990}
                    max={new Date().getFullYear()} 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4">
            <h3 className="text-lg font-medium mb-4">Subject Marks</h3>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grade11">Grade 11</TabsTrigger>
                <TabsTrigger value="grade12">Grade 12</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grade11">
                <Card>
                  <CardContent className="pt-6">
                    {grade11Fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-12 gap-4 items-center mb-4">
                        <div className="col-span-8">
                          <FormField
                            control={form.control}
                            name={`grade11Subjects.${index}.subject`}
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select subject" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {commonSubjects.map(subject => (
                                      <SelectItem key={subject} value={subject}>
                                        {subject}
                                      </SelectItem>
                                    ))}
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name={`grade11Subjects.${index}.mark`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="%" 
                                    min={0}
                                    max={100}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-1">
                          {index > 5 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeGrade11(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendGrade11({ id: uuidv4(), subject: "", mark: 0 })}
                      className="mt-2 text-cap-teal border-cap-teal hover:bg-cap-teal/10"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Subject
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="grade12">
                <Card>
                  <CardContent className="pt-6">
                    {grade12Fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-12 gap-4 items-center mb-4">
                        <div className="col-span-8">
                          <FormField
                            control={form.control}
                            name={`grade12Subjects.${index}.subject`}
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select subject" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {commonSubjects.map(subject => (
                                      <SelectItem key={subject} value={subject}>
                                        {subject}
                                      </SelectItem>
                                    ))}
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name={`grade12Subjects.${index}.mark`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="%" 
                                    min={0}
                                    max={100}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-1">
                          {index > 5 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeGrade12(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendGrade12({ id: uuidv4(), subject: "", mark: 0 })}
                      className="mt-2 text-cap-teal border-cap-teal hover:bg-cap-teal/10"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Subject
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="border-cap-teal text-cap-teal hover:bg-cap-teal/10"
            >
              Back
            </Button>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-cap-teal hover:bg-cap-teal/90"
            >
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
