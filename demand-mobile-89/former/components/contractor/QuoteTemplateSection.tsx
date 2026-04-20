import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface QuoteTemplate {
  id: string;
  name: string;
  description: string;
  service_category: string;
  base_price: number;
  hourly_rate?: number;
  materials_markup?: number;
  estimated_hours?: number;
  default_terms: string;
  urgency_multipliers: {
    same_day: number;
    emergency: number;
  };
  created_at: string;
}

export const QuoteTemplateSection = () => {
  const [templates, setTemplates] = useState<QuoteTemplate[]>([
    {
      id: '1',
      name: 'Basic Plumbing Repair',
      description: 'Standard plumbing repair services including leak fixes, pipe repairs',
      service_category: 'Plumbing',
      base_price: 150,
      hourly_rate: 95,
      materials_markup: 15,
      estimated_hours: 2,
      default_terms: 'Labor and materials included. 90-day warranty on workmanship.',
      urgency_multipliers: {
        same_day: 1.5,
        emergency: 2.0
      },
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Electrical Installation',
      description: 'New electrical installations and upgrades',
      service_category: 'Electrical',
      base_price: 200,
      hourly_rate: 110,
      materials_markup: 20,
      estimated_hours: 3,
      default_terms: 'Licensed electrician. Code compliant installation. 1-year warranty.',
      urgency_multipliers: {
        same_day: 1.3,
        emergency: 1.8
      },
      created_at: new Date().toISOString()
    }
  ]);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<QuoteTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    service_category: '',
    base_price: '',
    hourly_rate: '',
    materials_markup: '',
    estimated_hours: '',
    default_terms: '',
    same_day_multiplier: '1.5',
    emergency_multiplier: '2.0'
  });

  const serviceCategories = [
    'Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 
    'Roofing', 'Landscaping', 'Cleaning', 'Handyman', 'Other'
  ];

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      description: '',
      service_category: '',
      base_price: '',
      hourly_rate: '',
      materials_markup: '',
      estimated_hours: '',
      default_terms: '',
      same_day_multiplier: '1.5',
      emergency_multiplier: '2.0'
    });
    setIsCreateModalOpen(true);
  };

  const handleEditTemplate = (template: QuoteTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description,
      service_category: template.service_category,
      base_price: template.base_price.toString(),
      hourly_rate: template.hourly_rate?.toString() || '',
      materials_markup: template.materials_markup?.toString() || '',
      estimated_hours: template.estimated_hours?.toString() || '',
      default_terms: template.default_terms,
      same_day_multiplier: template.urgency_multipliers.same_day.toString(),
      emergency_multiplier: template.urgency_multipliers.emergency.toString()
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveTemplate = () => {
    if (!templateForm.name || !templateForm.service_category || !templateForm.base_price) {
      toast.error('Please fill in required fields');
      return;
    }

    const templateData: QuoteTemplate = {
      id: editingTemplate?.id || Date.now().toString(),
      name: templateForm.name,
      description: templateForm.description,
      service_category: templateForm.service_category,
      base_price: parseFloat(templateForm.base_price),
      hourly_rate: templateForm.hourly_rate ? parseFloat(templateForm.hourly_rate) : undefined,
      materials_markup: templateForm.materials_markup ? parseFloat(templateForm.materials_markup) : undefined,
      estimated_hours: templateForm.estimated_hours ? parseFloat(templateForm.estimated_hours) : undefined,
      default_terms: templateForm.default_terms,
      urgency_multipliers: {
        same_day: parseFloat(templateForm.same_day_multiplier),
        emergency: parseFloat(templateForm.emergency_multiplier)
      },
      created_at: editingTemplate?.created_at || new Date().toISOString()
    };

    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? templateData : t));
      toast.success('Template updated successfully!');
    } else {
      setTemplates(prev => [...prev, templateData]);
      toast.success('Template created successfully!');
    }

    setIsCreateModalOpen(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success('Template deleted successfully!');
  };

  const handleDuplicateTemplate = (template: QuoteTemplate) => {
    const newTemplate: QuoteTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      created_at: new Date().toISOString()
    };
    setTemplates(prev => [...prev, newTemplate]);
    toast.success('Template duplicated successfully!');
  };

  const handleUseTemplate = (template: QuoteTemplate) => {
    // This would typically open a quote creation form pre-filled with template data
    toast.success(`Using template: ${template.name}`);
    // You could emit an event or call a callback to open the quote form
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quote Templates</h2>
          <p className="text-gray-600">Create reusable quote templates to speed up your quoting process</p>
        </div>
        <Button onClick={handleCreateTemplate} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {template.service_category}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleEditTemplate(template)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDuplicateTemplate(template)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium text-green-600">${template.base_price}</span>
                </div>
                {template.hourly_rate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-medium">${template.hourly_rate}/hr</span>
                  </div>
                )}
                {template.estimated_hours && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Hours:</span>
                    <span className="font-medium">{template.estimated_hours}h</span>
                  </div>
                )}
                {template.materials_markup && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Materials:</span>
                    <span className="font-medium">+{template.materials_markup}%</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <Button 
                  size="sm" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleUseTemplate(template)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    Same Day: +{((template.urgency_multipliers.same_day - 1) * 100).toFixed(0)}%
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Emergency: +{((template.urgency_multipliers.emergency - 1) * 100).toFixed(0)}%
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add New Template Card */}
        <Card 
          className="border-dashed border-2 hover:border-green-400 cursor-pointer transition-colors"
          onClick={handleCreateTemplate}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[250px] text-center">
            <Plus className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="font-semibold text-gray-600 mb-2">Create New Template</h3>
            <p className="text-sm text-gray-500">Speed up quoting with reusable templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Template Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Quote Template' : 'Create New Quote Template'}
            </DialogTitle>
            <DialogDescription>
              Set up a reusable template for quick quote generation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Basic Plumbing Repair"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="service_category">Service Category *</Label>
                <Select
                  value={templateForm.service_category}
                  onValueChange={(value) => setTemplateForm(prev => ({ ...prev, service_category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={templateForm.description}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this template covers..."
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="base_price">Base Price ($) *</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  value={templateForm.base_price}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, base_price: e.target.value }))}
                  placeholder="150.00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  step="0.01"
                  value={templateForm.hourly_rate}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, hourly_rate: e.target.value }))}
                  placeholder="95.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimated_hours">Estimated Hours</Label>
                <Input
                  id="estimated_hours"
                  type="number"
                  step="0.5"
                  value={templateForm.estimated_hours}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, estimated_hours: e.target.value }))}
                  placeholder="2.0"
                />
              </div>
              
              <div>
                <Label htmlFor="materials_markup">Materials Markup (%)</Label>
                <Input
                  id="materials_markup"
                  type="number"
                  step="0.1"
                  value={templateForm.materials_markup}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, materials_markup: e.target.value }))}
                  placeholder="15"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="default_terms">Default Terms & Conditions</Label>
              <Textarea
                id="default_terms"
                value={templateForm.default_terms}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, default_terms: e.target.value }))}
                placeholder="Warranty, payment terms, etc..."
                rows={3}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Urgency Multipliers</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="same_day_multiplier" className="text-xs">Same Day (multiplier)</Label>
                  <Input
                    id="same_day_multiplier"
                    type="number"
                    step="0.1"
                    value={templateForm.same_day_multiplier}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, same_day_multiplier: e.target.value }))}
                    placeholder="1.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emergency_multiplier" className="text-xs">Emergency (multiplier)</Label>
                  <Input
                    id="emergency_multiplier"
                    type="number"
                    step="0.1"
                    value={templateForm.emergency_multiplier}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, emergency_multiplier: e.target.value }))}
                    placeholder="2.0"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleSaveTemplate}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};