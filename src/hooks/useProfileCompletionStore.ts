import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DocumentInfo } from '@/types/ApplicationTypes';

interface PersonalInfo {
  fullName: string;
  idNumber: string;
  gender: string;
}

interface ContactInfo {
  phoneNumber: string;
  contactEmail: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

interface AddressInfo {
  addressType: 'residential' | 'postal';
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
}

// Fixed SubjectMark interface to make properties non-optional and export it
export interface SubjectMark {
  id: string; // Required
  subject: string; // Required
  mark: number; // Required
}

interface EducationInfo {
  schoolName: string;
  province: string;
  completionYear: number;
  grade11Subjects?: SubjectMark[];
  grade12Subjects?: SubjectMark[];
}

// Extended interface with document types
interface Documents {
  applicationId?: string;
  [key: string]: DocumentInfo | string | undefined;
}

interface ProfileCompletionState {
  isDataSaved: boolean;
  currentStep: number;
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  addressInfo: AddressInfo;
  educationInfo: EducationInfo;
  documents: Documents;

  setDataSaved: (saved: boolean) => void;
  setCurrentStep: (step: number) => void;
  setPersonalInfo: (info: PersonalInfo) => void;
  setContactInfo: (info: ContactInfo) => void;
  setAddressInfo: (info: AddressInfo) => void;
  setEducationInfo: (info: EducationInfo) => void;
  setDocuments: (docs: Partial<Documents>) => void;
  resetFormData: () => void;
  loadSavedFormData: () => Promise<void>;
  hasSavedData: () => Promise<boolean>;
}

// Initial state
const initialState = {
  isDataSaved: false,
  currentStep: 0,
  personalInfo: {
    fullName: '',
    idNumber: '',
    gender: '',
  },
  contactInfo: {
    phoneNumber: '',
    contactEmail: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  },
  addressInfo: {
    addressType: 'residential' as const,
    streetAddress: '',
    suburb: '',
    city: '',
    province: '',
    postalCode: '',
  },
  educationInfo: {
    schoolName: '',
    province: '',
    completionYear: new Date().getFullYear(),
    grade11Subjects: [],
    grade12Subjects: [],
  },
  documents: {},
};


/**
 * useProfileCompletionStore
 * @description Function
 */
export const useProfileCompletionStore = create<ProfileCompletionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setDataSaved: (saved) => set({ isDataSaved: saved }),

      setCurrentStep: (step) => set({ currentStep: step }),

      setPersonalInfo: (info) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...info },
        })),

      setContactInfo: (info) =>
        set((state) => ({
          contactInfo: { ...state.contactInfo, ...info },
        })),

      setAddressInfo: (info) =>
        set((state) => ({
          addressInfo: { ...state.addressInfo, ...info },
        })),

      setEducationInfo: (info) =>
        set((state) => ({
          educationInfo: { ...state.educationInfo, ...info },
        })),

      setDocuments: (docs) =>
        set((state) => ({
          documents: { ...state.documents, ...docs },
        })),

      resetFormData: () =>
        set({
          ...initialState,
          isDataSaved: false,
        }),

      loadSavedFormData: async () => {
        // In a real app, we might fetch from an API or local storage
        // For now, just mark as loaded and use what's in the store
        set({ isDataSaved: false });
        return Promise.resolve();
      },

      hasSavedData: async () => {
        // Check if there's any saved form data
        const state = get();

        const hasPersonalInfo =
          state.personalInfo.fullName !== '' || state.personalInfo.idNumber !== '';

        const hasContactInfo =
          state.contactInfo.phoneNumber !== '' || state.contactInfo.contactEmail !== '';

        const hasAddressInfo =
          state.addressInfo.streetAddress !== '' || state.addressInfo.city !== '';

        const hasEducationInfo = state.educationInfo.schoolName !== '';

        const hasData = hasPersonalInfo || hasContactInfo || hasAddressInfo || hasEducationInfo;

        return Promise.resolve(hasData);
      },
    }),
    {
      name: 'edueasy-profile-completion',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // Don't persist file objects
        const { documents, ...rest } = state;
        return {
          ...rest,
          documents: {
            applicationId: documents.applicationId,
          },
        };
      },
    },
  ),
);
