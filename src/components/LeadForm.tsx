"use client";

import { useState } from "react";
import { z } from "zod";
import { trackLeadSubmission } from "@/lib/analytics";
import { Mail, Phone, GraduationCap } from "lucide-react";

interface LeadFormProps {
  locale?: string;
}

const leadSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  grade: z.string().optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "You must accept the privacy policy" }) })
});

const content = {
  en: {
    title: "Ready to get started?",
    subtitle: "Join thousands of students who've found their path with EduEasy",
    form: {
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      phone: "Phone Number", 
      phonePlaceholder: "e.g., 0821234567",
      grade: "Current Grade (Optional)",
      gradeOptions: [
        { value: "", label: "Select grade" },
        { value: "grade_11", label: "Grade 11" },
        { value: "grade_12", label: "Grade 12" },
        { value: "matric", label: "Matric (Grade 12)" },
        { value: "gap_year", label: "Gap Year" },
        { value: "other", label: "Other" }
      ],
      consent: "I agree to the Privacy Policy and Terms of Service, and consent to my personal information being processed according to POPIA regulations.",
      submit: "Get Started",
      submitting: "Submitting..."
    },
    success: "Thank you! We'll be in touch soon via WhatsApp or SMS.",
    error: "Something went wrong. Please try again or contact us on WhatsApp."
  },
  zu: {
    title: "Ukulungele ukuqalisa?",
    subtitle: "Joyina amakhulu abafundi abathole indlela yabo nge-EduEasy",
    form: {
      fullName: "Igama Eliphelele",
      fullNamePlaceholder: "Faka igama lakho eliphelele",
      phone: "Inombolo Yefoni",
      phonePlaceholder: "isb., 0821234567", 
      grade: "Ibanga Lamanje (Okukhethekayo)",
      gradeOptions: [
        { value: "", label: "Khetha ibanga" },
        { value: "grade_11", label: "Ibanga 11" },
        { value: "grade_12", label: "Ibanga 12" },
        { value: "matric", label: "I-Matric (Ibanga 12)" },
        { value: "gap_year", label: "Unyaka Wekhefu" },
        { value: "other", label: "Okunye" }
      ],
      consent: "Ngiyavuma Inqubomgomo Yobumfihlo Nemigomo Yenkonzo, futhi ngivumela ulwazi lwami lomuntu siqu ukuthi lucutshungulwe ngokwemigomo ye-POPIA.",
      submit: "Qalisa",
      submitting: "Kuyathumelwa..."
    },
    success: "Siyabonga! Sizoxhumana nawe maduze nge-WhatsApp noma i-SMS.",
    error: "Kukhona okungahambanga kahle. Sicela uzame futhi noma usixhumane ku-WhatsApp."
  },
  xh: {
    title: "Sele ulungele ukuqalisa?",
    subtitle: "Joyina amawaka abafundi abafumene indlela yabo nge-EduEasy",
    form: {
      fullName: "Igama Elipheleleyo",
      fullNamePlaceholder: "Ngenisa igama lakho elipheleleyo",
      phone: "Inombolo Yefowuni",
      phonePlaceholder: "umz., 0821234567",
      grade: "Ibanga Langoku (Okukhethekayo)",
      gradeOptions: [
        { value: "", label: "Khetha ibanga" },
        { value: "grade_11", label: "Ibanga 11" },
        { value: "grade_12", label: "Ibanga 12" },
        { value: "matric", label: "I-Matric (Ibanga 12)" },
        { value: "gap_year", label: "Unyaka Wekhefu" },
        { value: "other", label: "Okunye" }
      ],
      consent: "Ndiyavuma Umgaqo-nkqubo Wabucala neMigaqo Yenkonzo, kwaye ndivumela ulwazi lwam lobuqu ukuba lucutshungulwe ngokwemigaqo ye-POPIA.",
      submit: "Qalisa",
      submitting: "Kuyathunyelelwa..."
    },
    success: "Enkosi! Siza kuqhagamshelana nawe kungekudala nge-WhatsApp okanye i-SMS.",
    error: "Kukhona into engahambanga kakuhle. Nceda uzame kwakhona okanye uqhagamshelane nathi kwi-WhatsApp."
  }
};

export default function LeadForm({ locale = 'en' }: LeadFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    grade: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { title, subtitle, form, success, error } = content[locale as keyof typeof content] || content.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setErrors({});

    try {
      // Validate form data
      const validatedData = leadSchema.parse(formData);
      
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utm = {
        utm_source: urlParams.get('utm_source') || 'landing',
        utm_medium: urlParams.get('utm_medium') || 'lead_form',
        utm_campaign: urlParams.get('utm_campaign') || 'landing'
      };
      
      // Submit to API
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...validatedData,
          utm,
          source: 'landing'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: success });
        setFormData({ full_name: '', phone: '', grade: '', consent: false });
        
        // Track successful lead submission
        trackLeadSubmission({
          source: 'landing',
          utm_campaign: utm.utm_campaign || undefined,
          utm_source: utm.utm_source || undefined,
          utm_medium: utm.utm_medium || undefined
        });
      } else {
        setMessage({ type: 'error', text: result.error || error });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path.length > 0) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setMessage({ type: 'error', text: error });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <section id="lead-form" className="py-24 sm:py-32 bg-brand-600">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-brand-100">
            {subtitle}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-neutral-900 mb-2">
                  {form.fullName} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder={form.fullNamePlaceholder}
                    className={`w-full rounded-lg border px-4 py-3 pl-11 text-neutral-900 placeholder-neutral-500 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 ${
                      errors.full_name ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    required
                  />
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" aria-hidden="true" />
                </div>
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-900 mb-2">
                  {form.phone} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={form.phonePlaceholder}
                    className={`w-full rounded-lg border px-4 py-3 pl-11 text-neutral-900 placeholder-neutral-500 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 ${
                      errors.phone ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    required
                  />
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" aria-hidden="true" />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Grade */}
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-neutral-900 mb-2">
                  {form.grade}
                </label>
                <div className="relative">
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-3 pl-11 text-neutral-900 focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                  >
                    {form.gradeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <GraduationCap className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" aria-hidden="true" />
                </div>
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className={`mt-1 h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-600 ${
                    errors.consent ? 'border-red-300' : ''
                  }`}
                  required
                />
                <label htmlFor="consent" className="text-sm text-neutral-700 leading-relaxed">
                  {form.consent}
                </label>
              </div>
              {errors.consent && (
                <p className="mt-1 text-sm text-red-600">{errors.consent}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.consent}
                className="w-full bg-brand-600 text-white rounded-lg py-3 px-6 font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
              >
                {isSubmitting ? form.submitting : form.submit}
              </button>

              {/* Message */}
              {message && (
                <div className={`mt-4 p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}