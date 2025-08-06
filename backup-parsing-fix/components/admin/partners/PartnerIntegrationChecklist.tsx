import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Demo: define milestones - in a real app, this would be backend-driven/configurable
const INTEGRATION_STEPS = [
  {
    key: 'signed_mou',
    label: 'Signed MoU Uploaded',
    help: 'Upload the signed memorandum of understanding (MoU) to start integration.',
  },
  {
    key: 'integration_details',
    label: 'API Integration Details Provided',
    help: 'Partner provided technical details needed for API setup.',
  },
  {
    key: 'test_api',
    label: 'API Test Successful',
    help: 'API connection tested between partner and EduEasy.',
  },
  {
    key: 'onboarded',
    label: 'Onboarding Session Complete',
    help: 'Partner has completed the onboarding session.',
  },
];

const getStepStatus = (partner: unknown, key: string) => {
  // Simulated logic: in production, fields like `mou_uploaded_at`, `api_connected`, etc. would exist
  switch (key) {
    case 'signed_mou':
      return partner.mou_uploaded_at ? 'done' : 'pending';
    case 'integration_details':
      return partner.integration_status === 'integration_details' ||
        partner.integration_status === 'test_api' ||
        partner.integration_status === 'completed'
        ? 'done'
        : 'pending';
    case 'test_api':
      return partner.integration_status === 'test_api' || partner.integration_status === 'completed'
        ? 'done'
        : 'pending';
    case 'onboarded':
      return partner.integration_status === 'completed' ? 'done' : 'pending';
    default:
      return 'pending';
  }
};

const statusToIcon = (status: string) =>
  status === 'done' ? (
    <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
  ) : (
    <Circle className="text-gray-300 mr-2 h-5 w-5" />
  );

const PartnerIntegrationChecklist: React.FC<{ partner: unknown }> = ({ partner }) => (
  <div className="rounded border p-4 bg-white shadow text-gray-700 space-y-4">
    <div className="font-semibold mb-2">Integration Progress</div>
    <div>
      Integration Status:{' '}
      <span className="font-mono bg-gray-100 px-2 rounded">
        {partner.integration_status || '-'}
      </span>
      {partner.integration_status === 'completed' && (
        <Badge variant="default" className="ml-2 bg-green-100 text-green-800 border-success/20">
          Integration Complete
        </Badge>
      )}
      {partner.integration_status === 'pending' && (
        <Badge variant="destructive" className="ml-2">
          Pending
        </Badge>
      )}
      {partner.integration_status === 'in_progress' && (
        <Badge variant="secondary" className="ml-2">
          In Progress
        </Badge>
      )}
    </div>
    <div>
      <ul className="space-y-3">
        {INTEGRATION_STEPS.map((step) => {
          const status = getStepStatus(partner, step.key);
          return (
            <li className="flex items-start" key={step.key}>
              {statusToIcon(status)}
              <div>
                <span
                  className={`font-medium ${status === 'done' ? 'text-green-700' : 'text-gray-700'}`}
                >
                  {step.label}
                </span>
                <div className="text-xs text-gray-400 ml-1">{step.help}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
);

export default PartnerIntegrationChecklist;
