export type Step = { 
  id: string; 
  label: string; 
  status: 'completed' | 'current' | 'upcoming' 
};

// Temporary alias for compatibility
export type FlowStep = Step;

// Adapter function for legacy FlowStep interface
export const toStep = (flowStep: { id: string; title: string; completed: boolean }): Step => ({
  id: flowStep.id,
  label: flowStep.title,
  status: flowStep.completed ? 'completed' : 'upcoming'
});