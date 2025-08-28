import { type Partner } from '@/types/PartnerTypes';
import { CheckCircle2, Circle } from 'lucide-react';
import React from 'react';

interface PartnerIntegrationChecklistProps {
  partner: Partner;
  onUpdate: (partner: Partner) => void;
}

export const PartnerIntegrationChecklist: React.FC<PartnerIntegrationChecklistProps> = ({
  partner,
  onUpdate,
}) => {
  const steps = [
    {
      title: 'API Integration',
      description: 'Connect to partner API endpoints',
      completed: partner.api_integration_status === 'completed',
      help: 'Configure API keys and endpoints',
    },
    {
      title: 'Data Mapping',
      description: 'Map data fields between systems',
      completed: partner.data_mapping_status === 'completed',
      help: 'Define field mappings and transformations',
    },
    {
      title: 'Testing',
      description: 'Test integration functionality',
      completed: partner.testing_status === 'completed',
      help: 'Run integration tests and validate data flow',
    },
    {
      title: 'Production Deployment',
      description: 'Deploy to production environment',
      completed: partner.production_status === 'completed',
      help: 'Monitor production performance and errors',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Integration Checklist</h3>
      
      {steps.map((step, index) => (
        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {step.completed ? (
              <CheckCircle2 className="text-success mr-2 h-5 w-5" />
            ) : (
              <Circle className="text-muted-foreground mr-2 h-5 w-5" />
            )}
    <div>
              <h4 className="font-medium">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              <div className="text-xs text-muted-foreground ml-1">{step.help}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {step.completed ? 'Completed' : 'Pending'}
    </div>
              </div>
      ))}
  </div>
);
};
