
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw, Database, TrendingUp } from 'lucide-react';

interface QuickActionsProps {
  triggeringJobs: Set<string>;
  onTriggerJob: (jobName: string, functionName: string) => void;
  onTriggerDatabaseCleanup: () => void;
  onGenerateReports: () => void;
}

export const QuickActions = ({
  triggeringJobs,
  onTriggerJob,
  onTriggerDatabaseCleanup,
  onGenerateReports
}: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Manually trigger system operations and maintenance tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => onTriggerJob('Monthly Job Reset', 'reset-monthly-jobs')}
            disabled={triggeringJobs.has('Monthly Job Reset')}
            className="flex items-center gap-2"
          >
            {triggeringJobs.has('Monthly Job Reset') ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Trigger Monthly Reset
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onTriggerDatabaseCleanup}
            disabled={triggeringJobs.has('database-cleanup')}
          >
            {triggeringJobs.has('database-cleanup') ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            Clean Database
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onGenerateReports}
            disabled={triggeringJobs.has('generate-reports')}
          >
            {triggeringJobs.has('generate-reports') ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            Generate Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
