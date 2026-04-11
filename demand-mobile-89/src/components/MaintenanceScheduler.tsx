import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, AlertTriangle, Clock, MapPin, Phone, User, Globe } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useMaintenanceSystem } from "@/hooks/useMaintenanceSystem";
import { usePropertyManagement } from "@/hooks/usePropertyManagement";
import { supabase } from "@/integrations/supabase/client";

export const MaintenanceScheduler = () => {
  const [activeTab, setActiveTab] = useState("emergency");
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    emergency_type: '',
    severity: 'high',
    property_id: '',
    unit_id: '',
    type: 'emergency',
    priority: 'medium',
    frequency: '',
    estimated_cost: '',
    scheduled_date: '',
    location_details: '',
    contact_phone: '',
    notes: '',
    assigned_handyman_id: '',
    post_publicly: false
  });

  const [availableHandymen, setAvailableHandymen] = useState<any[]>([]);

  const { maintenanceRequests, emergencyReports, loading, createMaintenanceRequest, createEmergencyReport } = useMaintenanceSystem();
  const { properties, units, fetchUnits } = usePropertyManagement();

  // Fetch available handymen
  const fetchAvailableHandymen = async () => {
    try {
      const { data: handymen, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .eq('user_role', 'handyman')
        .eq('account_status', 'active');

      if (error) throw error;
      setAvailableHandymen(handymen || []);
    } catch (error) {
      console.error('Error fetching handymen:', error);
    }
  };

  // Load handymen on component mount
  useEffect(() => {
    fetchAvailableHandymen();
  }, []);

  // Filter requests by type
  const emergencyRequests = maintenanceRequests.filter(req => req.type === 'emergency');
  const recurringMaintenance = maintenanceRequests.filter(req => req.type === 'recurring');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-indigo-100 text-indigo-800';
      case 'reported': return 'bg-yellow-100 text-yellow-800';
      case 'dispatched': return 'bg-blue-100 text-blue-800';
      case 'on_site': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEmergencySubmit = async () => {
    try {
      await createEmergencyReport({
        title: formData.title,
        description: formData.description,
        emergency_type: formData.emergency_type,
        severity: formData.severity as 'low' | 'medium' | 'high' | 'critical',
        location_details: formData.location_details,
        contact_phone: formData.contact_phone,
        notes: formData.notes
      } as any);
      setShowEmergencyForm(false);
      setFormData({
        title: '', description: '', emergency_type: '', severity: 'high',
        property_id: '', unit_id: '', type: 'emergency', priority: 'medium',
        frequency: '', estimated_cost: '', scheduled_date: '',
        location_details: '', contact_phone: '', notes: '',
        assigned_handyman_id: '', post_publicly: false
      });
    } catch (error) {
      console.error('Error submitting emergency report:', error);
    }
  };

  const handleMaintenanceSubmit = async () => {
    try {
      const maintenanceData = {
        title: formData.title,
        description: formData.description,
        type: formData.type as 'emergency' | 'recurring' | 'standard',
        priority: formData.priority as 'low' | 'medium' | 'high' | 'urgent',
        frequency: formData.frequency || undefined,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : undefined,
        scheduled_date: formData.scheduled_date || undefined,
        notes: formData.notes,
        property_id: formData.property_id || undefined,
        unit_id: formData.unit_id || undefined,
        assigned_handyman_id: formData.assigned_handyman_id || undefined,
        post_publicly: formData.post_publicly
      };

      await createMaintenanceRequest(maintenanceData as any);
      setShowMaintenanceForm(false);
      setFormData({
        title: '', description: '', emergency_type: '', severity: 'high',
        property_id: '', unit_id: '', type: 'emergency', priority: 'medium',
        frequency: '', estimated_cost: '', scheduled_date: '',
        location_details: '', contact_phone: '', notes: '',
        assigned_handyman_id: '', post_publicly: false
      });
    } catch (error) {
      console.error('Error creating maintenance request:', error);
    }
  };

  const handlePropertyChange = (propertyId: string) => {
    setFormData(prev => ({ ...prev, property_id: propertyId, unit_id: '' }));
    if (propertyId) {
      fetchUnits(propertyId);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Emergency Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Maintenance Management</h2>
          <p className="text-gray-600">Manage emergency requests and scheduled maintenance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={showMaintenanceForm} onOpenChange={setShowMaintenanceForm}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 h-8">
                <Calendar className="w-3 h-3 mr-1" />
                Schedule
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={showEmergencyForm} onOpenChange={setShowEmergencyForm}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 h-8">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Emergency
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Emergency Report Dialog */}
      <Dialog open={showEmergencyForm} onOpenChange={setShowEmergencyForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Report Emergency
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Property *</label>
                <Select value={formData.property_id} onValueChange={handlePropertyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.property_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit (Optional)</label>
                <Select value={formData.unit_id} onValueChange={(value) => setFormData(prev => ({ ...prev, unit_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        Unit {unit.unit_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Emergency Type *</label>
                <Select value={formData.emergency_type} onValueChange={(value) => setFormData(prev => ({ ...prev, emergency_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="flood">Flood/Water Damage</SelectItem>
                    <SelectItem value="gas_leak">Gas Leak</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="structural">Structural</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Severity *</label>
                <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input 
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of emergency"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <Textarea 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the emergency situation"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location Details</label>
                <Input 
                  value={formData.location_details}
                  onChange={(e) => setFormData(prev => ({ ...prev, location_details: e.target.value }))}
                  placeholder="Specific location within property"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone</label>
                <Input 
                  value={formData.contact_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                  placeholder="Emergency contact number"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowEmergencyForm(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEmergencySubmit}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={!formData.title || !formData.description || !formData.emergency_type || !formData.property_id}
              >
                Submit Emergency Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Maintenance Request Dialog */}
      <Dialog open={showMaintenanceForm} onOpenChange={setShowMaintenanceForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-blue-600">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Maintenance
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Property *</label>
                <Select value={formData.property_id} onValueChange={handlePropertyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.property_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit (Optional)</label>
                <Select value={formData.unit_id} onValueChange={(value) => setFormData(prev => ({ ...prev, unit_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        Unit {unit.unit_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority *</label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.type === 'recurring' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency</label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input 
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Maintenance task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <Textarea 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of maintenance work needed"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Estimated Cost</label>
                <Input 
                  type="number"
                  value={formData.estimated_cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimated_cost: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Scheduled Date</label>
                <Input 
                  type="datetime-local"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
                />
              </div>
            </div>

            {/* Assignment Options */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Assignment Options</h4>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="post_publicly"
                  checked={formData.post_publicly}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, post_publicly: checked === true, assigned_handyman_id: checked ? '' : prev.assigned_handyman_id }))}
                />
                <label htmlFor="post_publicly" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Post publicly for all handymen to see
                </label>
              </div>

              {!formData.post_publicly && (
                <div>
                  <label className="block text-sm font-medium mb-1">Assign to Specific Handyman</label>
                  <Select 
                    value={formData.assigned_handyman_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_handyman_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a handyman (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableHandymen.map((handyman) => (
                        <SelectItem key={handyman.id} value={handyman.id}>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{handyman.full_name}</div>
                              <div className="text-xs text-gray-500">{handyman.email}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to post publicly, or select a specific handyman to assign directly
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowMaintenanceForm(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleMaintenanceSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!formData.title || !formData.description || !formData.property_id}
              >
                Schedule Maintenance
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabs for Emergency vs Recurring */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="emergency" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Emergency Reports ({emergencyReports.length})
          </TabsTrigger>
          <TabsTrigger value="recurring" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Recurring Maintenance ({recurringMaintenance.length})
          </TabsTrigger>
          <TabsTrigger value="standard" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Standard Requests ({maintenanceRequests.filter(req => req.type === 'standard').length})
          </TabsTrigger>
        </TabsList>

        {/* Emergency Reports Tab */}
        <TabsContent value="emergency" className="space-y-4">
          {emergencyReports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <AlertTriangle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No emergency reports at this time</p>
              </CardContent>
            </Card>
          ) : (
            emergencyReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <Badge className={getPriorityColor(report.severity)}>
                          {report.severity.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{report.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {report.properties?.property_name} - {report.units?.unit_number || 'Common Area'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                        <span>Type: {report.emergency_type.replace('_', ' ')}</span>
                      </div>
                      {report.location_details && (
                        <p className="text-sm text-gray-500 mt-2">
                          Location: {report.location_details}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {report.contact_phone && (
                        <>
                          <Phone className="w-3 h-3" />
                          {report.contact_phone}
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                        Assign
                      </Button>
                      <Button size="sm" className="text-xs px-2 py-1 h-7">
                        Update
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Recurring Maintenance Tab */}
        <TabsContent value="recurring" className="space-y-4">
          {recurringMaintenance.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No recurring maintenance scheduled</p>
              </CardContent>
            </Card>
          ) : (
            recurringMaintenance.map((maintenance) => (
              <Card key={maintenance.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{maintenance.title}</h3>
                        <Badge className={getPriorityColor(maintenance.priority)}>
                          {maintenance.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(maintenance.status)}>
                          {maintenance.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{maintenance.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {maintenance.properties?.property_name} - {maintenance.units?.unit_number || 'All Units'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {maintenance.frequency}
                        </span>
                        {maintenance.next_scheduled && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Next: {new Date(maintenance.next_scheduled).toLocaleDateString()}
                          </span>
                        )}
                        {maintenance.estimated_cost && (
                          <span className="text-green-600 font-medium">
                            ${maintenance.estimated_cost}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {maintenance.completed_at 
                        ? `Last completed: ${new Date(maintenance.completed_at).toLocaleDateString()}`
                        : 'Not yet completed'
                      }
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                        Schedule
                      </Button>
                      <Button size="sm" className="text-xs px-2 py-1 h-7">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                        Pause
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Standard Maintenance Tab */}
        <TabsContent value="standard" className="space-y-4">
          {maintenanceRequests.filter(req => req.type === 'standard').length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No standard maintenance requests</p>
              </CardContent>
            </Card>
          ) : (
            maintenanceRequests.filter(req => req.type === 'standard').map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{request.title}</h3>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{request.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {request.properties?.property_name} - {request.units?.unit_number || 'Common Area'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        {request.estimated_cost && (
                          <span className="text-green-600 font-medium">
                            Est: ${request.estimated_cost}
                          </span>
                        )}
                        {request.scheduled_date && (
                          <span className="text-blue-600">
                            Scheduled: {new Date(request.scheduled_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {request.status === 'completed' && request.completed_at
                        ? `Completed: ${new Date(request.completed_at).toLocaleDateString()}`
                        : 'In progress'
                      }
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                        Assign
                      </Button>
                      <Button size="sm" className="text-xs px-2 py-1 h-7">
                        Update
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};