import { Button } from '@/components/ui/button';
import React from 'react';

export const HelpWidget: React.FC = () => (
  <div className="fixed bottom-6 right-6 z-50">
    <Button className="btn btn-primary rounded-full shadow-lg">Help</Button>
    {/* Integrate Intercom or custom chat here */}
  </div>
);

export default HelpWidget;
