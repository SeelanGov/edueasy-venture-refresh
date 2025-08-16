import { Step } from '@/types/ui';

export const createAuthFlowSteps = (currentStep: string): Step[] => {
  const steps = [
    { id: 'register', title: 'Create Account' },
    { id: 'payment', title: 'Choose Plan' },
    { id: 'dashboard', title: 'Access Dashboard' },
  ];

  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  return steps.map((step, index) => ({
    id: step.id,
    label: step.title,
    status: index < currentIndex ? 'completed' as const : (index === currentIndex ? 'current' as const : 'upcoming' as const),
  }));
};