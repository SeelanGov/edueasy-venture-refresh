import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component handles redirects from the old refund-policy.html to the new React route

/**
 * RefundPolicyRedirect
 * @description Function
 */
export const RefundPolicyRedirect = () => {;
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is accessing the old HTML version
    if (window.location.pathname.includes('refund-policy.html')) {
      navigate('/refund-policy', { replace: true });
    }
  }, [navigate]);

  return null;
};
