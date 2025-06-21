
import React from 'react';

const faqs = [
  {
    q: 'How do I reset my password?',
    a: "Go to your profile settings and click 'Reset Password'.",
  },
  {
    q: 'How do I contact support?',
    a: 'Click the Help button at the bottom right or email info@edueasy.co.',
  },
  // Add more FAQs here
];

export const FAQPage: React.FC = () => (
  <div className="max-w-2xl mx-auto p-8">
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
);

export default FAQPage;
