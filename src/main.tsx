import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import App from './App.tsx';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { EnvGate } from './ui/EnvGate';

import './index.css';

// Initialize Sentry for production monitoring
Sentry.init({
  // Only enable in production
  enabled: import.meta.env.PROD,
  environment: import.meta.env.MODE,
  
  // PII scrubbing by default
  beforeSend(event) {
    // Remove PII from errors
    if (event.exception) {
      event.exception.values?.forEach(exception => {
        if (exception.stacktrace?.frames) {
          exception.stacktrace.frames.forEach(frame => {
            // Remove file paths that might contain usernames
            if (frame.filename) {
              frame.filename = frame.filename.replace(/\/Users\/[^\/]+/g, '/Users/***');
            }
          });
        }
      });
    }
    
    // Remove query params that might contain tokens
    if (event.request?.url) {
      const url = new URL(event.request.url);
      url.search = '';
      event.request.url = url.toString();
    }
    
    return event;
  },
  
  // Sample rate for performance monitoring
  tracesSampleRate: 0.1,
});

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
