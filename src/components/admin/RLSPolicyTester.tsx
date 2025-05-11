
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, XCircle, Shield, Database, RefreshCw, List, Zap } from "lucide-react";
import { 
  testRLSPolicies, 
  testRLSPoliciesWithRole, 
  analyzeRLSPolicies,
  getRegisteredPolicies 
} from "@/utils/security";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RLSTestResult, RLSPolicyAnalysis } from "@/utils/security";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PolicyTestResults } from "./rls/PolicyTestResults";
import { PolicyRegistry } from "./rls/PolicyRegistry";
import { PolicyAnalysis } from "./rls/PolicyAnalysis";

export const RLSPolicyTester = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [testResults, setTestResults] = useState<RLSTestResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredPolicies, setRegisteredPolicies] = useState<any[]>([]);
  const [policyAnalysis, setPolicyAnalysis] = useState<RLSPolicyAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState("test");
  const [selectedRole, setSelectedRole] = useState<string>("user");
  const [scenarioName, setScenarioName] = useState<string>("");
  
  // Fetch admin status and policy registry on component mount
  useEffect(() => {
    const checkAdminAndFetchPolicies = async () => {
      if (!user?.id) return;
      
      try {
        // Check admin status
        const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin', {
          user_uuid: user.id
        });
        
        if (adminError) throw adminError;
        setIsAdmin(!!isAdminData);
        
        if (isAdminData) {
          // Fetch registered policies
          const policies = await getRegisteredPolicies();
          setRegisteredPolicies(policies);
          
          // Fetch policy analysis
          const analysis = await analyzeRLSPolicies(user.id);
          setPolicyAnalysis(analysis);
        }
      } catch (error: any) {
        console.error("Error initializing RLS tester:", error);
        toast.error(`Error initializing: ${error.message}`);
      }
    };
    
    checkAdminAndFetchPolicies();
  }, [user]);
  
  // Run enhanced RLS policy tests
  const runTests = async (withRole: boolean = false) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      let results;
      
      if (withRole) {
        // Run tests with specified role
        const { results: roleResults } = await testRLSPoliciesWithRole(
          user.id, 
          selectedRole, 
          scenarioName || undefined
        );
        results = roleResults;
      } else {
        // Run standard tests
        const { results: stdResults } = await testRLSPolicies(user.id);
        results = stdResults;
      }
      
      setTestResults(results || []);
      
      // Update the policy analysis after tests
      const analysis = await analyzeRLSPolicies(user.id);
      setPolicyAnalysis(analysis);
      
      toast.success("RLS policy tests completed");
    } catch (error: any) {
      console.error("Error running RLS tests:", error);
      toast.error(`Error running RLS tests: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh policy registry and analysis
  const refreshData = async () => {
    if (!user?.id) return;
    
    try {
      // Refresh policy registry
      const policies = await getRegisteredPolicies();
      setRegisteredPolicies(policies);
      
      // Refresh policy analysis
      const analysis = await analyzeRLSPolicies(user.id);
      setPolicyAnalysis(analysis);
      
      toast.success("Policy data refreshed");
    } catch (error: any) {
      console.error("Error refreshing policy data:", error);
      toast.error(`Error refreshing data: ${error.message}`);
    }
  };

  if (isAdmin === false) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle size={18} />
            Access Denied
          </CardTitle>
          <CardDescription>
            You need admin privileges to access this tool.
          </CardDescription>
        </CardHeader>
      </Card>
    );
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
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Policy Test Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Test As Role</label>
                  <Select 
                    value={selectedRole} 
                    onValueChange={setSelectedRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Regular User</SelectItem>
                      <SelectItem value="admin">Admin User</SelectItem>
                      <SelectItem value="anon">Anonymous User</SelectItem>
                      <SelectItem value="authenticated">Any Authenticated User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Scenario Name (Optional)</label>
                  <Input 
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    placeholder="Enter a test scenario name"
                  />
                </div>
              </div>
            </div>
            
            {testResults ? (
              <PolicyTestResults results={testResults} />
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                Configure test parameters and click "Run RLS Tests" to begin testing policies
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => runTests()} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? "Running..." : "Run Standard Tests"}
            </Button>
            
            <Button 
              onClick={() => runTests(true)} 
              disabled={isLoading || !selectedRole}
              className="flex items-center gap-2"
            >
              {isLoading ? "Running..." : "Test with Role"} {!isLoading && <Shield size={16} />}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="registry">
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Registered Policies</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                className="flex items-center gap-1"
              >
                <RefreshCw size={14} />
                Refresh
              </Button>
            </div>
            
            <PolicyRegistry policies={registeredPolicies} />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="analysis">
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Policy Coverage Analysis</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                className="flex items-center gap-1"
              >
                <RefreshCw size={14} />
                Refresh Analysis
              </Button>
            </div>
            
            <PolicyAnalysis analysis={policyAnalysis} />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
