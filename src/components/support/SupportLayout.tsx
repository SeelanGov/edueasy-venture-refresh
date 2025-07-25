import React from 'react';
import HelpWidget from './HelpWidget';
import FAQPage from './FAQPage';


/**
 * SupportLayout
 * @description Function
 */
export const SupportLayout: React.FC = () => (
  <div className="relative min-h-screen bg-gray-50">
    <FAQPage />
    <HelpWidget />
  </div>
);

export default SupportLayout;
