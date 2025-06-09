
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const faqs = [
  {
    q: 'How do I reset my password?',
    a: "Go to your profile settings and click 'Reset Password'.",
  },
  {
    q: 'How do I contact support?',
    a: 'Click the Help button at the bottom right or email support@edueasy.com.',
  },
  // Add more FAQs here
];

export const FAQPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-cap-teal hover:text-cap-teal/80 transition-colors font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>
      <ul className="space-y-4">
        {faqs.map((faq, idx) => (
          <li key={idx}>
            <h2 className="font-semibold">Q: {faq.q}</h2>
            <p className="ml-4 text-gray-700">A: {faq.a}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default FAQPage;
