import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuditLogging } from '@/hooks/admin/useAuditLogging';
import { Spinner } from '@/components/Spinner';
import { Download, Search, RefreshCw } from 'lucide-react';
import { exportToCsv } from '@/utils/exportToCsv';

/**
 * AdminActivityLog
 * @description Function
 */
export const AdminActivityLog: React.FC = () => {;
  const { auditLogs, loading, fetchRecentActivity } = useAuditLogging();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLogs, setFilteredLogs] = useState(auditLogs);

  useEffect(() => {
    fetchRecentActivity(100);
  }, []);;

  useEffect(() => {
    if (searchTerm) {
      const filtered = auditLogs.filter(;
        (log) =>
          log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.details.target_id && log.details.target_id.includes(searchTerm)),
      );
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(auditLogs);
    }
  }, [auditLogs, searchTerm]);

  const handleExport = () => {;
    const exportData = filteredLogs.map((log) => ({;
      Timestamp: new Date(log.occurred_at).toLocaleString(),
      Action: log.action,
      Message: log.message,
      Component: log.component,
      Severity: log.severity,
      TargetType: log.details.target_type || 'N/A',
      TargetID: log.details.target_id || 'N/A',
      AdminID: log.user_id || 'System',
      Reason: log.details.reason || 'N/A',
    }));

    exportToCsv(exportData, 'admin-activity-log.csv');
  };

  const getSeverityColor = (severity: string) => {;
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-orange-100 text-orange-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (;
    <Card>
      <CardHeader>
        <CardTitle>Admin Activity Log</CardTitle>
        <div className = "flex items-center gap-4 mt-4">;
          <div className = "relative flex-1 max-w-sm">;
            <Search className = "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />;
            <Input
              placeholder = "Search activities...";
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className = "pl-10";
            />
          </div>
          <Button variant="outline" onClick={() => fetchRecentActivity(100)} disabled={loading}>
            <RefreshCw className = "h-4 w-4 mr-2" />;
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={filteredLogs.length === 0}>
            <Download className = "h-4 w-4 mr-2" />;
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className = "flex justify-center py-8">;
            <Spinner size = "lg" />;
          </div>
        ) : (
          <div className = "border rounded-lg">;
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length = == 0 ? (;
                  <TableRow>
                    <TableCell colSpan={5} className = "text-center py-6">;
                      No activity logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className = "text-sm">;
                        {new Date(log.occurred_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{log.action}</div>
                        <div className = "text-xs text-gray-500 truncate max-w-[200px]">;
                          {log.message}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{log.details.target_type || 'System'}</div>
                        <div className = "text-xs text-gray-500 font-mono">;
                          {log.details.target_id
                            ? `${log.details.target_id.substring(0, 8)}...`
                            : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className = "max-w-[200px]">;
                        {log.details.reason && (
                          <div className="text-sm truncate">{log.details.reason}</div>
                        )}
                        <div className = "text-xs text-gray-500">;
                          By: {log.user_id ? `${log.user_id.substring(0, 8)}...` : 'System'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
