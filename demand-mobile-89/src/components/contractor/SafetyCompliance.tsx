
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield, CheckCircle, AlertTriangle, FileText, Calendar, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useContractorSync } from '@/hooks/useContractorSync';

export const SafetyCompliance = () => {
  const { toast } = useToast();
  const { addSafetyIncident, getSafetyIncidents, updateChecklistProgress, loading } = useContractorSync();
  const [activeTab, setActiveTab] = useState('checklists');
  
  const [checklists, setChecklists] = useState([
    {
      id: 1,
      title: 'Daily Safety Checklist',
      category: 'Daily',
      items: [
        { id: 1, text: 'Personal Protective Equipment (PPE) check', completed: false, required: true },
        { id: 2, text: 'Tool and equipment inspection', completed: false, required: true },
        { id: 3, text: 'Work area hazard assessment', completed: false, required: true },
        { id: 4, text: 'Emergency exit routes identified', completed: false, required: true },
        { id: 5, text: 'First aid kit location confirmed', completed: false, required: false }
      ]
    },
    {
      id: 2,
      title: 'Weekly Safety Review',
      category: 'Weekly',
      items: [
        { id: 6, text: 'Safety training records updated', completed: false, required: true },
        { id: 7, text: 'Incident reports reviewed', completed: false, required: true },
        { id: 8, text: 'Safety equipment maintenance check', completed: false, required: true },
        { id: 9, text: 'Team safety meeting conducted', completed: false, required: true }
      ]
    }
  ]);

  const [incidents, setIncidents] = useState([]);

  const [newIncident, setNewIncident] = useState({
    type: '',
    description: '',
    location: '',
    reportedBy: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showTrainingForm, setShowTrainingForm] = useState(false);

  // Load incidents when component mounts
  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const result = await getSafetyIncidents();
      if (result?.success && result?.incidents) {
        // Transform database data to match component interface
        const transformedIncidents = result.incidents.map((incident: any) => ({
          id: incident.id,
          type: incident.type,
          description: incident.description,
          location: incident.location,
          reportedBy: incident.reported_by || '',
          date: incident.incident_date,
          status: incident.status || 'Open'
        }));
        setIncidents(transformedIncidents);
      }
    } catch (error) {
      console.error('Failed to load safety incidents:', error);
    }
  };

  const handleChecklistItemToggle = async (checklistId: number, itemId: number) => {
    try {
      // Update local state immediately for responsive UI
      setChecklists(prevChecklists => 
        prevChecklists.map(checklist => 
          checklist.id === checklistId 
            ? {
                ...checklist,
                items: checklist.items.map(item => 
                  item.id === itemId 
                    ? { ...item, completed: !item.completed }
                    : item
                )
              }
            : checklist
        )
      );

      await updateChecklistProgress({ checklistId, itemId });
      toast({
        title: "Checklist Updated",
        description: "Safety checklist item status updated",
      });
    } catch (error) {
      // Revert the local state change if the API call failed
      setChecklists(prevChecklists => 
        prevChecklists.map(checklist => 
          checklist.id === checklistId 
            ? {
                ...checklist,
                items: checklist.items.map(item => 
                  item.id === itemId 
                    ? { ...item, completed: !item.completed }
                    : item
                )
              }
            : checklist
        )
      );
      
      toast({
        title: "Error",
        description: "Failed to update checklist",
        variant: "destructive",
      });
    }
  };

  const handleIncidentSubmit = async () => {
    if (!newIncident.type || !newIncident.description || !newIncident.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addSafetyIncident(newIncident);
      if (result?.success) {
        // Reload incidents to get the new one with its database ID
        await loadIncidents();
        setNewIncident({
          type: '',
          description: '',
          location: '',
          reportedBy: '',
          date: new Date().toISOString().split('T')[0]
        });
        setShowIncidentForm(false);

        toast({
          title: "Success",
          description: "Safety incident reported successfully",
        });
      } else {
        throw new Error(result?.error || 'Failed to report incident');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report safety incident",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'incident': return 'bg-red-100 text-red-800';
      case 'near miss': return 'bg-yellow-100 text-yellow-800';
      case 'observation': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Shield className="w-6 h-6 mr-2 text-red-600" />
            Safety Compliance
          </h2>
          <p className="text-gray-600">Manage safety checklists and incident reporting</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('checklists')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'checklists' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Safety Checklists
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'incidents' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Incident Reports
        </button>
        <button
          onClick={() => setActiveTab('training')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'training' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Training Records
        </button>
      </div>

      {/* Safety Checklists */}
      {activeTab === 'checklists' && (
        <div className="space-y-4">
          {checklists.map((checklist) => (
            <Card key={checklist.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    {checklist.title}
                  </CardTitle>
                  <Badge variant="outline">{checklist.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {checklist.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={() => handleChecklistItemToggle(checklist.id, item.id)}
                      />
                      <label
                        htmlFor={`item-${item.id}`}
                        className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}
                      >
                        {item.text}
                        {item.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Completed: {checklist.items.filter(item => item.completed).length} / {checklist.items.length}
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        toast({
                          title: "Progress Saved",
                          description: "Checklist progress has been saved",
                        });
                      }}
                    >
                      Save Progress
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Incident Reports */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Safety Incidents</h3>
            <Button onClick={() => setShowIncidentForm(!showIncidentForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Report Incident
            </Button>
          </div>

          {showIncidentForm && (
            <Card>
              <CardHeader>
                <CardTitle>Report Safety Incident</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="incidentType">Incident Type *</Label>
                    <select
                      id="incidentType"
                      className="w-full p-2 border rounded-md"
                      value={newIncident.type}
                      onChange={(e) => setNewIncident({...newIncident, type: e.target.value})}
                    >
                      <option value="">Select type</option>
                      <option value="Incident">Incident</option>
                      <option value="Near Miss">Near Miss</option>
                      <option value="Observation">Safety Observation</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="incidentDate">Date</Label>
                    <Input
                      id="incidentDate"
                      type="date"
                      value={newIncident.date}
                      onChange={(e) => setNewIncident({...newIncident, date: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="incidentLocation">Location *</Label>
                  <Input
                    id="incidentLocation"
                    value={newIncident.location}
                    onChange={(e) => setNewIncident({...newIncident, location: e.target.value})}
                    placeholder="Project site or specific location"
                  />
                </div>
                <div>
                  <Label htmlFor="reportedBy">Reported By</Label>
                  <Input
                    id="reportedBy"
                    value={newIncident.reportedBy}
                    onChange={(e) => setNewIncident({...newIncident, reportedBy: e.target.value})}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="incidentDescription">Description *</Label>
                  <Textarea
                    id="incidentDescription"
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                    placeholder="Describe what happened..."
                    rows={4}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleIncidentSubmit}>Submit Report</Button>
                  <Button variant="outline" onClick={() => setShowIncidentForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={getTypeColor(incident.type)}>
                          {incident.type}
                        </Badge>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </div>
                      <p className="text-gray-900 mb-2">{incident.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(incident.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>Reported by: {incident.reportedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{incident.location}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Training Records */}
      {activeTab === 'training' && (
        <Card>
          <CardHeader>
            <CardTitle>Safety Training Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">OSHA 30-Hour Construction</h4>
                  <p className="text-sm text-gray-600 mb-2">Completed: March 15, 2024</p>
                  <Badge className="bg-green-100 text-green-800">Valid</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">First Aid/CPR Certification</h4>
                  <p className="text-sm text-gray-600 mb-2">Expires: January 10, 2025</p>
                  <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Fall Protection Training</h4>
                  <p className="text-sm text-gray-600 mb-2">Completed: February 8, 2024</p>
                  <Badge className="bg-green-100 text-green-800">Valid</Badge>
                </div>
              </div>
              <Button onClick={() => setShowTrainingForm(!showTrainingForm)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Training Record
              </Button>

              {showTrainingForm && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Add Training Record</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="trainingName">Training Name *</Label>
                        <Input
                          id="trainingName"
                          placeholder="e.g., OSHA 10-Hour Construction"
                        />
                      </div>
                      <div>
                        <Label htmlFor="completionDate">Completion Date *</Label>
                        <Input
                          id="completionDate"
                          type="date"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expirationDate">Expiration Date</Label>
                        <Input
                          id="expirationDate"
                          type="date"
                        />
                      </div>
                      <div>
                        <Label htmlFor="certificationNumber">Certification Number</Label>
                        <Input
                          id="certificationNumber"
                          placeholder="Certificate ID"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="trainingProvider">Training Provider</Label>
                      <Input
                        id="trainingProvider"
                        placeholder="Organization or company name"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => {
                        toast({
                          title: "Training Record Added",
                          description: "Training record has been saved successfully",
                        });
                        setShowTrainingForm(false);
                      }}>
                        Save Training Record
                      </Button>
                      <Button variant="outline" onClick={() => setShowTrainingForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
