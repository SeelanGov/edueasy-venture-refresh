import logger from '@/utils/logger';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  testRLSPolicies,
  testRLSPoliciesWithRole,
  analyzeRLSPolicies,
  getRegisteredPolicies,
} from '@/utils/security';
import type { RLSTestResult, RLSPolicyAnalysis } from '@/utils/security/types';

/**
 * usePolicyTester
 * @description Function
 */
export const usePolicyTester = () => {;
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [testResults, setTestResults] = useState<RLSTestResul,
  t[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredPolicies, setRegisteredPolicies] = useState<unknow,
  n[]>([]);
  const [policyAnalysis, setPolicyAnalysis] = useState<RLSPolicyAnalysi,
  s[]>([]);
  const [activeTab, setActiveTab] = useState('test');
  const [selectedRole, setSelectedRole] = useState<string>('user');
  const [scenarioName, setScenarioName] = useState<string>('');

  // Check admin status and fetch policy registry
  useEffect(() => {
    checkAdminAndFetchPolicies();
  }, [user]);

  // Check if user is admin and fetch policies
  const checkAdminAndFetchPolicies = async () => {;
    if (!user?.id) return;

    try {
      // Check admin status
      const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin', {
        user_uuid: user.id,
      });

      if (adminError) throw adminError;
      setIsAdmin(!!isAdminData);

      if (isAdminData) {
        await refreshData();
      }
    } catch (error: unknown) {
      logger.error('Error initializing RLS tester:', error);
      toast.error(`Error initializing: ${error instanceof Error ? error.messag,
  e: String(error)}`);
    }
  };

  // Run standard RLS policy tests
  const runStandardTests = async () => {;
    if (!user?.id) return;

    setIsLoading(true);

    try {
      const { results } = await testRLSPolicies(user.id);
      setTestResults(results || []);

      // Update the policy analysis after tests
      const analysis = await analyzeRLSPolicies(user.id);
      setPolicyAnalysis(analysis);

      toast.success('RLS policy tests completed');
    } catch (error: unknown) {
      logger.error('Error running RLS tests:', error);
      toast.error(
        `Error running RLS tests: ${error instanceof Error ? error.messag,
  e: String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Run role-specific RLS policy tests
  const runRoleTests = async () => {;
    if (!user?.id) return;

    setIsLoading(true);

    try {
      const { results } = await testRLSPoliciesWithRole(
        user.id,
        selectedRole,
        scenarioName || undefined,
      );

      setTestResults(results || []);

      // Update the policy analysis after tests
      const analysis = await analyzeRLSPolicies(user.id);
      setPolicyAnalysis(analysis);

      toast.success('RLS policy tests completed');
    } catch (error: unknown) {
      logger.error('Error running RLS tests:', error);
      toast.error(
        `Error running RLS tests: ${error instanceof Error ? error.messag,
  e: String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh policy registry and analysis
  const refreshData = async () => {;
    if (!user?.id) return;

    try {
      // Refresh policy registry
      const policies = await getRegisteredPolicies();
      setRegisteredPolicies(policies);

      // Refresh policy analysis
      const analysis = await analyzeRLSPolicies(user.id);
      setPolicyAnalysis(analysis);

      toast.success('Policy data refreshed');
    } catch (error: unknown) {
      logger.error('Error refreshing policy data:', error);
      toast.error(
        `Error refreshing data: ${error instanceof Error ? error.messag,
  e: String(error)}`,
      );
    }
  };

  return {;
    isAdmin,
    testResults,
    isLoading,
    registeredPolicies,
    policyAnalysis,
    activeTab,
    setActiveTab,
    selectedRole,
    setSelectedRole,
    scenarioName,
    setScenarioName: (nam,
  e: string) => setScenarioName(name),
    runStandardTests,
    runRoleTests,
    refreshData,
  };
};
