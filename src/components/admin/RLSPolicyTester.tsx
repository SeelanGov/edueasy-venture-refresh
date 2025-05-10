
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { testRLSPolicies, verifyAdminAccess } from "@/utils/securityTesting";
import { useAuth } from "@/contexts/AuthContext";

export const RLSPolicyTester = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      
      // Run RLS policy tests
      const { results } = await testRLSPolicies(user.id);
      setTestResults(results);
    } catch (error) {
      console.error("Error running RLS tests:", error);
    } finally {
      setIsLoading(false);
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
    <Card>
      <CardHeader>
        <CardTitle>RLS Policy Tester</CardTitle>
        <CardDescription>
          Test the Row Level Security policies in the database
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {testResults ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Test Results</h3>
            
            {testResults.map((result, index) => (
              <div key={index} className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{result.table}</span>
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
                  <p className="mt-2 text-sm text-destructive">{result.message}</p>
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
        >
          {isLoading ? "Running Tests..." : "Run RLS Tests"}
        </Button>
      </CardFooter>
    </Card>
  );
};
