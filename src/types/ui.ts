export type StepStatus = 'pending' | 'active' | 'complete';
export type Step = { id: string; label: string; status: StepStatus };

// Adapter function for legacy interfaces
export const toStep = (flowStep: { id: string; title: string; completed?: boolean; state?: string }): Step => ({
  id: flowStep.id,
  label: flowStep.title,
  status: flowStep.completed ? 'complete' : (flowStep.state === 'active' ? 'active' : 'pending'),
});