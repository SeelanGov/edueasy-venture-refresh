import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * RLSPolicyTester
 * @description Function
 */
export const RLSPolicyTester = (): JSX.Element => {
  const [testQuery, setTestQuery] = useState('');
  const [userId, setUserId] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    if (!testQuery.trim()) {
      toast.error('Please enter a test query');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('test_rls_policies_with_role', {
        p_role: 'user',
        p_scenario: 'test',
      });

      if (error) throw error;

      if (Array.isArray(data)) {
        setResults(data);
        toast.success('Test completed successfully');
      } else {
        setResults([]);
        toast.error('No data returned from test');
      }
    } catch (error) {
      console.error('RLS test error:', error);
      toast.error('Test failed: ' + (error as Error).message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>RLS Policy Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="userId">Test User ID (optional)</Label>
          <Input
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID to test with"
          />
        </div>

        <div>
          <Label htmlFor="testQuery">Test Query</Label>
          <Textarea
            id="testQuery"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="SELECT * FROM applications WHERE user_id = auth.uid()"
            rows={4}
          />
        </div>

        <Button onClick={runTest} disabled={loading}>
          {loading ? 'Running Test...' : 'Run Test'}
        </Button>

        {results.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.success ? 'Passed' : 'Failed'}
                  </Badge>
                  <pre className="text-xs mt-1">{JSON.stringify(result, null, 2)}</pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
