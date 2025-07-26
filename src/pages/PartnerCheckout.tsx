import { Button } from '@/components/ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PartnerCheckout: React.FC = () => {
  const navigate = useNavigate();

  // Replace these details with actual bank account & 3rd party info as needed!
  const eftDetails = {
    bank: 'FNB',
    accountNumber: '62830500000',
    branchCode: '250655',
    accountName: 'EduEasy (Pty) Ltd',
    reference: 'Your Institute Name',
  };

  // Third-party info (stubbed here, describe for real app)
  const thirdPartyAppLink = 'https://app-link-to-banking-platform.com/';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-subtle">
      <div className="relative w-full">
        {/* Back to Home Button */}
        <div className="container mx-auto px-4 mt-8 mb-0 flex items-center">
          <Button
            type="button"
            variant="ghost"
            className="bg-transparent px-3 py-1 rounded-lg flex items-center text-cap-teal hover:bg-cap-teal/10"
            onClick={() => navigate('/')}
          >
            <span className="mr-2 text-lg">&#8592;</span>
            Back to Home
          </Button>
        </div>
      </div>
      <Card className="bg-card p-8 rounded-xl shadow-lg w-full max-w-lg mt-0">
        <h1 className="text-2xl font-bold mb-4 text-primary text-center">
          Institution Subscription Payment
        </h1>
        <p className="text-foreground-muted text-center mb-4">
          Please use one of the following methods to complete your institution’s payment. Once paid,
          allow up to 1 business day for verification.
        </p>
        <div className="bg-cap-teal/10 border border-cap-teal rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-1">Manual EFT Details</h2>
          <div className="text-sm mb-2">Use online banking/mobile app to transfer payment:</div>
          <div className="space-y-1 ml-2 text-cap-teal">
            <div>
              <span className="font-medium">Bank:</span> {eftDetails.bank}
            </div>
            <div>
              <span className="font-medium">Account Number:</span> {eftDetails.accountNumber}
            </div>
            <div>
              <span className="font-medium">Branch Code:</span> {eftDetails.branchCode}
            </div>
            <div>
              <span className="font-medium">Account Name:</span> {eftDetails.accountName}
            </div>
            <div>
              <span className="font-medium">Reference:</span> {eftDetails.reference}
            </div>
          </div>
        </div>
        <div className="bg-cap-coral/10 border border-cap-coral rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-1">Pay via Banking App Gateway</h2>
          <div className="text-sm mb-2">Connect to your banking app for faster payment:</div>
          <a
            href={thirdPartyAppLink}
            target="_blank"
            rel="noopener"
            className="underline text-cap-coral font-medium"
          >
            Launch Secure Bank Payment App
          </a>
        </div>
        <div className="mb-4">
          <Button
            className="bg-cap-teal text-white rounded-lg px-5 py-2 mr-2"
            onClick={() => navigate('/partner/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
        <div className="text-xs text-center text-gray-400">
          Once you have paid, EduEasy will confirm your payment and unlock your full dashboard
          access.
          <br />
          Need urgent help? Email{' '}
          <a href="mailto:partners@edueasy.co.za" className="underline">
            partners@edueasy.co.za
          </a>
        </div>
      </Card>
    </div>
  );
};

export default PartnerCheckout;
