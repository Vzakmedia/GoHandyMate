
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Database } from 'lucide-react';
import { CronLog } from '../types/automation';
import { getStatusIcon, formatDateTime } from '../utils/statusUtils';

interface ExecutionLogsProps {
  cronLogs: CronLog[];
  loading: boolean;
  onRefresh: () => void;
}

export const ExecutionLogs = ({ cronLogs, loading, onRefresh }: ExecutionLogsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Execution Logs
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Recent system job executions and their results
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2">Loading logs...</span>
          </div>
        ) : cronLogs.length === 0 ? (
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Logs Found</h3>
            <p className="text-gray-600">No execution logs are available at the moment.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Job Name</TableHead>
                <TableHead>Execution Time</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cronLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <Badge 
                        variant={
                          log.status === 'completed' ? 'default' : 
                          log.status === 'failed' ? 'destructive' : 'secondary'
                        }
                      >
                        {log.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.job_name}</TableCell>
                  <TableCell className="text-sm">
                    {formatDateTime(log.execution_time)}
                  </TableCell>
                  <TableCell>
                    {log.details && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                          View Details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
