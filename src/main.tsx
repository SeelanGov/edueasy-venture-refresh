import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { EnvGate } from './ui/EnvGate';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <EnvGate>
          <App />
        </EnvGate>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
