
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Database, List, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import custom hooks
import { usePolicyTester } from "@/hooks/usePolicyTester";

// Import all the components we've created
import { AccessDeniedCard } from "./rls/AccessDeniedCard";
import { PolicyTestTab } from "./rls/PolicyTestTab";
import { PolicyRegistryTab } from "./rls/PolicyRegistryTab";
import { PolicyAnalysisTab } from "./rls/PolicyAnalysisTab";

export const RLSPolicyTester = () => {
  const {
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
    setScenarioName,
    runStandardTests,
    runRoleTests,
    refreshData
  } = usePolicyTester();

  if (isAdmin === false) {
    return <AccessDeniedCard />;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield size={20} />
          RLS Policy Management
        </CardTitle>
        <CardDescription>
          Test and manage Row Level Security policies in the database
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="mb-4">
            <TabsTrigger value="test" className="flex items-center gap-1">
              <Database size={16} />
              Test Policies
            </TabsTrigger>
            <TabsTrigger value="registry" className="flex items-center gap-1">
              <List size={16} />
              Policy Registry
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-1">
              <Zap size={16} />
              Analysis
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="test">
          <PolicyTestTab
            testResults={testResults}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            scenarioName={scenarioName}
            setScenarioName={setScenarioName}
            isLoading={isLoading}
            onRunStandardTests={runStandardTests}
            onRunRoleTests={runRoleTests}
          />
        </TabsContent>
        
        <TabsContent value="registry">
          <PolicyRegistryTab 
            registeredPolicies={registeredPolicies}
            onRefreshData={refreshData}
          />
        </TabsContent>
        
        <TabsContent value="analysis">
          <PolicyAnalysisTab 
            policyAnalysis={policyAnalysis}
            onRefreshData={refreshData}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
