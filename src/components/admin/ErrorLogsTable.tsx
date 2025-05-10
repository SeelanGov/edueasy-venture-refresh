import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, Clock, XCircle, ExternalLink } from "lucide-react";
import { ErrorSeverity } from "@/utils/errorLogging";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ErrorLogEntry } from "@/types/database.types";

interface ErrorLogEntry {
  id: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  component?: string;
  action?: string;
  user_id?: string;
  details?: Record<string, unknown>;
  occurred_at: string;
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
}

interface ErrorLogsTableProps {
  errors: ErrorLogEntry[];
  loading: boolean;
  onRefresh: () => void;
  onResolve: (id: string, notes: string) => Promise<boolean>;
}

export const ErrorLogsTable = ({
  errors,
  loading,
  onRefresh,
  onResolve
}: ErrorLogsTableProps) => {
  const [filter, setFilter] = useState<{
    severity?: ErrorSeverity;
    category?: ErrorCategory;
    component?: string;
    search: string;
    showResolved: boolean;
  }>({
    search: '',
    showResolved: false
  });
  
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});
  const [resolvingIds, setResolvingIds] = useState<string[]>([]);
  
  const toggleRowExpanded = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleResolve = async (id: string) => {
    setResolvingIds(prev => [...prev, id]);
    
    try {
      const notes = resolutionNotes[id] || "Marked as resolved by admin";
      const success = await onResolve(id, notes);
      
      if (success) {
        setExpandedRows(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        
        setResolutionNotes(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }
    } finally {
      setResolvingIds(prev => prev.filter(itemId => itemId !== id));
    }
  };
  
  const filteredErrors = errors.filter(error => {
    // Filter by resolved status
    if (!filter.showResolved && error.is_resolved) return false;
    
    // Filter by severity if specified
    if (filter.severity && error.severity !== filter.severity) return false;
    
    // Filter by category if specified
    if (filter.category && error.category !== filter.category) return false;
    
    // Filter by component if specified
    if (filter.component && error.component !== filter.component) return false;
    
    // Filter by search term
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesMessage = error.message.toLowerCase().includes(searchLower);
      const matchesAction = error.action?.toLowerCase().includes(searchLower);
      
      if (!matchesMessage && !matchesAction) return false;
    }
    
    return true;
  });
  
  const getSeverityIcon = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.INFO:
        return <Info className="h-4 w-4 text-blue-500" />;
      case ErrorSeverity.WARNING:
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case ErrorSeverity.ERROR:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case ErrorSeverity.CRITICAL:
        return <AlertOctagon className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  const getSeverityBadge = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.INFO:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Info</Badge>;
      case ErrorSeverity.WARNING:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Warning</Badge>;
      case ErrorSeverity.ERROR:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
      case ErrorSeverity.CRITICAL:
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getCategoryBadge = (category: ErrorCategory) => {
    switch (category) {
      case ErrorCategory.NETWORK:
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Network</Badge>;
      case ErrorCategory.DATABASE:
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Database</Badge>;
      case ErrorCategory.AUTHENTICATION:
        return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">Auth</Badge>;
      case ErrorCategory.VALIDATION:
        return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">Validation</Badge>;
      case ErrorCategory.FILE:
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">File</Badge>;
      case ErrorCategory.UNKNOWN:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Unknown</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };
  
  // Extract unique components for filter
  const components = Array.from(new Set(errors.map(e => e.component).filter(Boolean)));
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">System Error Logs</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search by message or action..."
            value={filter.search}
            onChange={e => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="w-full"
          />
        </div>
        
        <Select
          value={filter.severity}
          onValueChange={(value) => setFilter(prev => ({ 
            ...prev, 
            severity: value ? value as ErrorSeverity : undefined 
          }))}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Severities</SelectItem>
            <SelectItem value={ErrorSeverity.INFO}>Info</SelectItem>
            <SelectItem value={ErrorSeverity.WARNING}>Warning</SelectItem>
            <SelectItem value={ErrorSeverity.ERROR}>Error</SelectItem>
            <SelectItem value={ErrorSeverity.CRITICAL}>Critical</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={filter.category}
          onValueChange={(value) => setFilter(prev => ({ 
            ...prev, 
            category: value ? value as ErrorCategory : undefined 
          }))}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value={ErrorCategory.NETWORK}>Network</SelectItem>
            <SelectItem value={ErrorCategory.DATABASE}>Database</SelectItem>
            <SelectItem value={ErrorCategory.AUTHENTICATION}>Auth</SelectItem>
            <SelectItem value={ErrorCategory.VALIDATION}>Validation</SelectItem>
            <SelectItem value={ErrorCategory.FILE}>File</SelectItem>
            <SelectItem value={ErrorCategory.UNKNOWN}>Unknown</SelectItem>
          </SelectContent>
        </Select>
        
        {components.length > 0 && (
          <Select
            value={filter.component}
            onValueChange={(value) => setFilter(prev => ({ 
              ...prev, 
              component: value || undefined 
            }))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Component" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Components</SelectItem>
              {components.map(comp => (
                <SelectItem key={comp} value={comp}>{comp}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="show-resolved" 
            checked={filter.showResolved} 
            onChange={e => setFilter(prev => ({ ...prev, showResolved: e.target.checked }))}
            className="mr-2" 
          />
          <label htmlFor="show-resolved" className="text-sm">Show Resolved</label>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredErrors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No error logs matching your criteria
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: '5%' }} className="text-center">Type</TableHead>
                <TableHead style={{ width: '60%' }}>Message</TableHead>
                <TableHead style={{ width: '15%' }}>Component</TableHead>
                <TableHead style={{ width: '15%' }}>Time</TableHead>
                <TableHead style={{ width: '5%' }} className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredErrors.map((error) => (
                <React.Fragment key={error.id}>
                  <TableRow className={error.is_resolved ? 'bg-gray-50' : ''}>
                    <TableCell className="text-center">
                      {getSeverityIcon(error.severity)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {error.message}
                          {error.is_resolved && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                              <Check className="h-3 w-3 mr-1" /> Resolved
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex gap-2">
                          {getSeverityBadge(error.severity)}
                          {getCategoryBadge(error.category)}
                          {error.action && (
                            <span className="text-gray-600">
                              Action: {error.action}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{error.component || 'Unknown'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(error.occurred_at), 'dd MMM yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(error.occurred_at), 'HH:mm:ss')}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpanded(error.id)}
                      >
                        {expandedRows[error.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {expandedRows[error.id] && (
                    <TableRow className={error.is_resolved ? 'bg-gray-50' : ''}>
                      <TableCell colSpan={5}>
                        <div className="p-4 space-y-4">
                          {error.details && (
                            <div>
                              <h4 className="text-sm font-semibold mb-1">Details:</h4>
                              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                {JSON.stringify(error.details, null, 2)}
                              </pre>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p><span className="font-medium">Error ID:</span> {error.id}</p>
                              {error.user_id && <p><span className="font-medium">User ID:</span> {error.user_id}</p>}
                              <p><span className="font-medium">Occurred At:</span> {format(new Date(error.occurred_at), 'PPpp')}</p>
                            </div>
                            
                            {error.is_resolved && (
                              <div>
                                {error.resolved_at && <p><span className="font-medium">Resolved At:</span> {format(new Date(error.resolved_at), 'PPpp')}</p>}
                                {error.resolved_by && <p><span className="font-medium">Resolved By:</span> {error.resolved_by}</p>}
                                {error.resolution_notes && (
                                  <div>
                                    <p className="font-medium">Resolution Notes:</p>
                                    <p className="text-gray-600">{error.resolution_notes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {!error.is_resolved && (
                            <div>
                              <div className="mb-2">
                                <label htmlFor={`resolution-${error.id}`} className="text-sm font-medium block mb-1">
                                  Resolution Notes:
                                </label>
                                <textarea
                                  id={`resolution-${error.id}`}
                                  value={resolutionNotes[error.id] || ''}
                                  onChange={(e) => setResolutionNotes(prev => ({
                                    ...prev,
                                    [error.id]: e.target.value
                                  }))}
                                  className="w-full p-2 border rounded-md text-sm resize-none"
                                  rows={2}
                                  placeholder="Describe how this error was resolved..."
                                />
                              </div>
                              
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleResolve(error.id)}
                                disabled={resolvingIds.includes(error.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {resolvingIds.includes(error.id) ? (
                                  <>
                                    <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                                    Resolving...
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-3 w-3 mr-2" />
                                    Mark as Resolved
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
