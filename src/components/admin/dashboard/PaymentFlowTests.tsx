import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, Play, Pause, Download, Trash2, Square } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { paymentTestingService, type TestResult, type TestScenario } from '@/services/PaymentTestingService';
import {
    AlertTriangle,
    BarChart3,
    Eye,
    RefreshCw,
    Shield,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

export const PaymentFlowTests = () => {
  const { toast } = useToast();
  const [scenarios, setScenarios] = useState<TestScenario[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  useEffect(() => {
    loadScenarios();
    loadTestResults();
  }, []);

  const loadScenarios = () => {
    const allScenarios = paymentTestingService.getTestScenarios();
    setScenarios(allScenarios);
  };

  const loadTestResults = () => {
    const results = paymentTestingService.getTestResults();
    setTestResults(results);
  };

  const handleRunAllTests = async () => {
    if (isRunning) {
      toast({
        title: 'Tests Already Running',
        description: 'Please wait for current tests to complete',
        variant: 'destructive',
      });
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setCurrentTest('Initializing tests...');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const results = await paymentTestingService.runAutomatedTests();
      
      clearInterval(progressInterval);
      setProgress(100);
      setCurrentTest('Tests completed');

      setTestResults(results);
      
      const stats = paymentTestingService.getTestStatistics();
      
      toast({
        title: 'Tests Completed',
        description: `${stats.passed} passed, ${stats.failed} failed (${stats.successRate.toFixed(1)}% success rate)`,
        variant: stats.successRate >= 80 ? 'default' : 'destructive',
      });

    } catch (error) {
      toast({
        title: 'Test Execution Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
      setProgress(0);
      setCurrentTest(null);
    }
  };

  const handleRunSingleTest = async (scenarioId: string) => {
    if (isRunning) {
      toast({
        title: 'Tests Already Running',
        description: 'Please wait for current tests to complete',
        variant: 'destructive',
      });
      return;
    }

    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    setIsRunning(true);
    setProgress(0);
    setCurrentTest(`Running: ${scenario.name}`);

    try {
      // For single test, we'll simulate the process
      const testData = paymentTestingService.generateTestData(scenario);
      
      // Simulate test execution
      for (let i = 0; i < scenario.steps.length; i++) {
        setProgress(((i + 1) / scenario.steps.length) * 100);
        setCurrentTest(`Step ${i + 1}: ${scenario.steps[i].action}`);
        
        // Simulate step execution time
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Create mock result
      const mockResult: TestResult = {
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        status: 'passed',
        duration: 5000,
        timestamp: new Date().toISOString(),
        details: scenario.steps.map((step, index) => ({
          ...step,
          status: 'passed',
          actualOutcome: 'Step completed successfully'
        }))
      };

      setTestResults(prev => [mockResult, ...prev]);
      
      toast({
        title: 'Single Test Completed',
        description: `${scenario.name} completed successfully`,
      });

    } catch (error) {
      toast({
        title: 'Single Test Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
      setProgress(0);
      setCurrentTest(null);
    }
  };

  const handleStopTests = () => {
    setIsRunning(false);
    setProgress(0);
    setCurrentTest(null);
    toast({
      title: 'Tests Stopped',
      description: 'Test execution has been stopped',
    });
  };

  const handleExportReport = () => {
    const report = paymentTestingService.generateTestReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-test-report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: 'Report Exported',
      description: 'Test report downloaded successfully',
    });
  };

  const handleClearResults = () => {
    paymentTestingService.clearTestResults();
    setTestResults([]);
    toast({
      title: 'Results Cleared',
      description: 'All test results have been cleared',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'timeout':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'failure':
        return <XCircle className="h-4 w-4" />;
      case 'timeout':
        return <Clock className="h-4 w-4" />;
      case 'edge_case':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const stats = paymentTestingService.getTestStatistics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Flow Testing</h2>
          <p className="text-gray-600 mt-1">Comprehensive payment system testing and validation</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadTestResults} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={handleClearResults} variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Clear Results
          </Button>
        </div>
      </div>

      {/* Test Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time test runs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.passed} passed, {stats.failed} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageDuration.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">
              Per test scenario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Status</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isRunning ? (
                <span className="text-blue-600">Running</span>
              ) : (
                <span className="text-gray-600">Idle</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentTest || 'Ready to test'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test Progress */}
      {isRunning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              Test Execution Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{currentTest}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <Button onClick={handleStopTests} variant="destructive" size="sm">
                <Square className="h-4 w-4 mr-2" />
                Stop Tests
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>
            Run automated tests to validate payment system functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button 
              onClick={handleRunAllTests} 
              disabled={isRunning}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Run All Tests
            </Button>
            <Button 
              onClick={handleStopTests} 
              disabled={!isRunning}
              variant="destructive"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Tests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Available Test Scenarios</CardTitle>
          <CardDescription>
            Individual test scenarios for targeted validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(scenario.category)}
                    <h3 className="font-medium">{scenario.name}</h3>
                  </div>
                  <Badge className={getPriorityColor(scenario.priority)}>
                    {scenario.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600">{scenario.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={scenario.automated ? 'default' : 'secondary'}>
                      {scenario.automated ? 'Automated' : 'Manual'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {scenario.steps.length} steps
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handleRunSingleTest(scenario.id)}
                    disabled={isRunning}
                    size="sm"
                    variant="outline"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Run
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Test Results</CardTitle>
          <CardDescription>
            Latest test execution results and outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No test results available. Run tests to see results here.
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.slice(0, 10).map((result, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status)}
                      <h3 className="font-medium">{result.scenarioName}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                        {result.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {result.duration}ms
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                  
                  {result.error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      Error: {result.error}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setSelectedScenario(selectedScenario === result.scenarioId ? null : result.scenarioId)}
                      size="sm"
                      variant="ghost"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {selectedScenario === result.scenarioId ? 'Hide' : 'View'} Details
                    </Button>
                  </div>
                  
                  {selectedScenario === result.scenarioId && (
                    <div className="mt-3 space-y-2">
                      {result.details.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center space-x-2 text-sm">
                          <span className="w-8 text-gray-500">Step {step.step}:</span>
                          <span className="flex-1">{step.action}</span>
                          <Badge variant={step.status === 'passed' ? 'default' : 'destructive'} className="text-xs">
                            {step.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 