
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, RefreshCw } from 'lucide-react';
import { SystemJob } from '../types/automation';
import { getStatusBadge } from '../utils/statusUtils';

interface SystemJobsTableProps {
  jobs: SystemJob[];
  triggeringJobs: Set<string>;
  onTriggerJob: (jobName: string, functionName: string) => void;
}

export const SystemJobsTable = ({ jobs, triggeringJobs, onTriggerJob }: SystemJobsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Jobs</CardTitle>
        <CardDescription>
          Automated tasks and their schedules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{job.name}</TableCell>
                <TableCell className="text-sm text-gray-600">{job.description}</TableCell>
                <TableCell>
                  <Badge variant="outline">{job.frequency}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(job.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => job.functionName && onTriggerJob(job.name, job.functionName)}
                      disabled={!job.functionName || triggeringJobs.has(job.name)}
                    >
                      {triggeringJobs.has(job.name) ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
