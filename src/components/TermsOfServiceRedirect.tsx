import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component handles redirects from the old terms-of-service.html to the new React route

/**
 * TermsOfServiceRedirect
 * @description Function
 */
export const TermsOfServiceRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is accessing the old HTML version
    if (window.location.pathname.includes('terms-of-service.html')) {
      navigate('/terms-of-service', { replace: true });
    }
  }, [navigate]);

  return null;
};
