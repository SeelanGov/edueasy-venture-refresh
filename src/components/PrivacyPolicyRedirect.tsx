
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component handles redirects from the old privacy-policy.html to the new React route
export const PrivacyPolicyRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is accessing the old HTML version
    if (window.location.pathname.includes('privacy-policy.html')) {
      navigate('/privacy-policy', { replace: true });
    }
  }, [navigate]);

  return null;
};
