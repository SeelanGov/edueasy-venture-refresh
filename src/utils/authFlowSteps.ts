export interface FlowStep {
  id: string;
  title: string;
  completed: boolean;
}

export const createAuthFlowSteps = (currentStep: string): FlowStep[] => {
  const steps = [
    { id: 'register', title: 'Create Account' },
    { id: 'payment', title: 'Choose Plan' },
    { id: 'dashboard', title: 'Access Dashboard' },
  ];

  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  return steps.map((step, index) => ({
    ...step,
    completed: index < currentIndex,
  }));
};