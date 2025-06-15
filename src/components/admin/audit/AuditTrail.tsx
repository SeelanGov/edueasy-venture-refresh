
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Shield, AlertCircle } from "lucide-react";
import { useAuditLogging, AuditLogEntry } from "@/hooks/admin/useAuditLogging";
import { Spinner } from "@/components/Spinner";

interface AuditTrailProps {
  targetId?: string;
  targetType?: string;
  title?: string;
  limit?: number;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({
  targetId,
  targetType,
  title = "Audit Trail",
  limit = 20
}) => {
  const { auditLogs, loading, fetchAuditLogs, fetchRecentActivity } = useAuditLogging();

  useEffect(() => {
    if (targetId && targetType) {
      fetchAuditLogs(targetId, targetType);
    } else {
      fetchRecentActivity(limit);
    }
  }, [targetId, targetType, limit]);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "error":
        return "bg-orange-100 text-orange-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("verify") || action.includes("approve")) {
      return <Shield className="h-4 w-4" />;
    }
    if (action.includes("reject") || action.includes("delete")) {
      return <AlertCircle className="h-4 w-4" />;
    }
    return <User className="h-4 w-4" />;
  };

  const formatDetails = (details: Record<string, any>) => {
    const relevantDetails = Object.entries(details)
      .filter(([key]) => !["timestamp", "admin_id"].includes(key))
      .slice(0, 3);
    
    return relevantDetails.map(([key, value]) => (
      <span key={key} className="text-xs text-gray-500">
        {key}: {typeof value === "string" ? value : JSON.stringify(value)}
      </span>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No audit logs found
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="border-l-2 border-blue-200 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getActionIcon(log.action)}
                    <span className="font-medium text-sm">{log.message}</span>
                    <Badge 
                      variant="secondary" 
                      className={getSeverityColor(log.severity)}
                    >
                      {log.severity}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(log.occurred_at).toLocaleString()}
                  </span>
                </div>
                
                <div className="mt-1 text-sm text-gray-600">
                  Action: <span className="font-mono text-xs">{log.action}</span>
                </div>
                
                {log.details.reason && (
                  <div className="mt-1 text-sm text-gray-600">
                    Reason: {log.details.reason}
                  </div>
                )}
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {formatDetails(log.details)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
