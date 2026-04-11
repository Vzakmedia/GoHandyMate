
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wrench, MessageSquare, Download, FileText, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';

interface QuickActionsCardProps {
  onAddUnit: () => void;
  onPostJob: () => void;
}

export const QuickActionsCard = ({ onAddUnit, onPostJob }: QuickActionsCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [downloadingReport, setDownloadingReport] = useState(false);

  const handleMessageSupport = () => {
    // Navigate to support page
    navigate('/support');
  };

  const handleViewReports = () => {
    // Navigate to analytics/reports page
    navigate('/analytics');
  };

  const handleScheduleMaintenance = () => {
    // Navigate to maintenance scheduler
    navigate('/maintenance');
  };

  const handleDownloadReport = async () => {
    if (!user) return;
    
    setDownloadingReport(true);
    try {
      // Fetch data for report
      const [unitsResponse, jobsResponse] = await Promise.all([
        supabase
          .from('units')
          .select('*')
          .eq('manager_id', user.id),
        supabase
          .from('job_requests')
          .select(`
            *,
            units (
              unit_number,
              property_address
            )
          `)
          .eq('manager_id', user.id)
      ]);

      const units = unitsResponse.data || [];
      const jobs = jobsResponse.data || [];

      // Create report content
      const reportData = {
        generatedAt: new Date().toISOString(),
        summary: {
          totalUnits: units.length,
          totalJobs: jobs.length,
          activeJobs: jobs.filter(j => j.status === 'pending' || j.status === 'in_progress').length,
          completedJobs: jobs.filter(j => j.status === 'completed').length,
        },
        units: units.map(unit => ({
          id: unit.id,
          unitNumber: unit.unit_number,
          property: unit.property_address,
          status: unit.status,
          createdAt: unit.created_at
        })),
        jobs: jobs.map(job => ({
          id: job.id,
          title: job.title,
          status: job.status,
          budget: job.budget,
          unit: job.units?.unit_number,
          property: job.units?.property_address,
          createdAt: job.created_at
        }))
      };

      // Create and download CSV
      const csvContent = generateCSVReport(reportData);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `property-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setDownloadingReport(false);
    }
  };

  const generateCSVReport = (data: any) => {
    let csv = 'Property Management Report\n\n';
    csv += `Generated: ${new Date(data.generatedAt).toLocaleString()}\n\n`;
    
    // Summary
    csv += 'SUMMARY\n';
    csv += `Total Units,${data.summary.totalUnits}\n`;
    csv += `Total Jobs,${data.summary.totalJobs}\n`;
    csv += `Active Jobs,${data.summary.activeJobs}\n`;
    csv += `Completed Jobs,${data.summary.completedJobs}\n\n`;
    
    // Units
    csv += 'UNITS\n';
    csv += 'Unit Number,Property Address,Status,Created Date\n';
    data.units.forEach((unit: any) => {
      csv += `"${unit.unitNumber}","${unit.property}","${unit.status}","${new Date(unit.createdAt).toLocaleDateString()}"\n`;
    });
    
    csv += '\nJOBS\n';
    csv += 'Title,Unit,Property,Status,Budget,Created Date\n';
    data.jobs.forEach((job: any) => {
      csv += `"${job.title}","${job.unit || 'N/A'}","${job.property || 'N/A'}","${job.status}","${job.budget || 0}","${new Date(job.createdAt).toLocaleDateString()}"\n`;
    });
    
    return csv;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700" 
          onClick={onAddUnit}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Unit
        </Button>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={onPostJob}
        >
          <Wrench className="w-4 h-4 mr-2" />
          Post Job
        </Button>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleScheduleMaintenance}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Maintenance
        </Button>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleMessageSupport}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Message Support
        </Button>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleViewReports}
        >
          <FileText className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleDownloadReport}
          disabled={downloadingReport}
        >
          <Download className="w-4 h-4 mr-2" />
          {downloadingReport ? 'Generating...' : 'Download Report'}
        </Button>
      </CardContent>
    </Card>
  );
};
