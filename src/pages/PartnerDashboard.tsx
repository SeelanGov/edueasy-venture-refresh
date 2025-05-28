import React from 'react';

const PartnerDashboard: React.FC = () => {
  // In a real app, fetch partner's applications/data here
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-subtle">
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Partner Dashboard</h1>
        <p className="mb-4 text-foreground-muted text-center">
          Welcome! Here you will see all your applications and data once your partnership is
          established.
        </p>
        <div className="border border-border rounded-lg p-6 bg-background-subtle text-foreground">
          <h2 className="text-lg font-semibold mb-2">Applications Overview</h2>
          <div className="text-muted">(API integration coming soon)</div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
