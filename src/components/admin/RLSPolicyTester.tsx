
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, XCircle, Shield, Database, RefreshCw, List } from "lucide-react";
import { testRLSPolicies, verifyAdminAccess } from "@/utils/securityTesting";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const RLSPolicyTester = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredPolicies, setRegisteredPolicies] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("test");
  
  // Fetch admin status and policy registry on component mount
  useEffect(() => {
    const checkAdminAndFetchPolicies = async () => {
      if (!user?.id) return;
      
      // Check admin status
      const adminStatus = await verifyAdminAccess(user.id);
      setIsAdmin(adminStatus);
      
      if (adminStatus) {
        // Fetch registered policies
        fetchPolicyRegistry();
      }
    };
    
    checkAdminAndFetchPolicies();
  }, [user]);
  
  // Fetch policies from the registry
  const fetchPolicyRegistry = async () => {
    try {
      const { data, error } = await supabase
        .from('rls_policy_registry')
        .select('*')
        .order('table_name', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setRegisteredPolicies(data || []);
    } catch (error: any) {
      console.error("Error fetching policy registry:", error);
      toast.error(`Failed to load policy registry: ${error.message}`);
    }
  };

  // Run enhanced RLS policy tests
  const runTests = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // First check if user is admin
      const adminStatus = await verifyAdminAccess(user.id);
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        return;
      }
      
      // Run enhanced RLS policy tests
      const { results, success } = await testRLSPolicies(user.id);
      
      setTestResults(results || []);
      toast.success("RLS policy tests completed");
    } catch (error: any) {
      console.error("Error running RLS tests:", error);
      toast.error(`Error running RLS tests: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Register a new policy (simplified mock implementation)
  const refreshPolicyRegistry = async () => {
    if (!user?.id) return;
    
    try {
      await fetchPolicyRegistry();
      toast.success("Policy registry refreshed");
    } catch (error: any) {
      console.error("Error refreshing policy registry:", error);
      toast.error(`Error refreshing registry: ${error.message}`);
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
          </TabsList>
        </div>
        
        <TabsContent value="test">
          <CardContent>
            {testResults ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Test Results</h3>
                
                {testResults.map((result, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{result.table_name}</span>
                        <span className="mx-2 text-gray-500">|</span>
                        <span className="font-mono text-sm">{result.operation}</span>
                      </div>
                      
                      <Badge variant={result.success ? "default" : "destructive"} className="flex items-center gap-1">
                        {result.success ? (
                          <>
                            <CheckCircle size={14} />
                            <span>Passed</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            <span>Failed</span>
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    {!result.success && (
                      <p className="mt-2 text-sm text-destructive">{result.details}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>Click the button below to test RLS policies</p>
            )}
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={runTests} 
              disabled={isLoading}
              className="mr-2"
            >
              {isLoading ? "Running Tests..." : "Run RLS Tests"}
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
                onClick={refreshPolicyRegistry}
                className="flex items-center gap-1"
              >
                <RefreshCw size={14} />
                Refresh
              </Button>
            </div>
            
            {registeredPolicies.length > 0 ? (
              <div className="space-y-4">
                {/* Group policies by table name */}
                {Array.from(new Set(registeredPolicies.map(policy => policy.table_name))).map(tableName => (
                  <div key={tableName as string} className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">{tableName}</h4>
                    <Separator className="mb-3" />
                    
                    <div className="space-y-2">
                      {registeredPolicies
                        .filter(policy => policy.table_name === tableName)
                        .map((policy, idx) => (
                          <div key={idx} className="flex justify-between items-center px-2 py-1 hover:bg-muted rounded">
                            <div>
                              <span className="font-medium">{policy.policy_name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({policy.policy_type})
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground max-w-[60%] truncate">
                              {policy.description || "No description"}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No registered policies found. Run tests to discover policies.</p>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
