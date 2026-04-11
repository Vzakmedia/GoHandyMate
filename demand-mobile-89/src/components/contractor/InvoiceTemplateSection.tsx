import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  description: string;
  service_category: string;
  hourly_rate?: number;
  materials_markup?: number;
  default_terms: string;
  created_at: string;
}

export const InvoiceTemplateSection = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Standard Plumbing Service',
      description: 'Basic plumbing repair and installation template',
      service_category: 'Plumbing',
      hourly_rate: 95,
      materials_markup: 15,
      default_terms: 'Payment due within 30 days. Materials markup of 15% applied.',
      created_at: new Date().toISOString()
    },
    {
      id: '2', 
      name: 'Electrical Installation',
      description: 'Standard electrical work template',
      service_category: 'Electrical',
      hourly_rate: 110,
      materials_markup: 20,
      default_terms: 'Payment due within 30 days. Licensed electrician services.',
      created_at: new Date().toISOString()
    }
  ]);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    service_category: '',
    hourly_rate: '',
    materials_markup: '',
    default_terms: ''
  });

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      description: '',
      service_category: '',
      hourly_rate: '',
      materials_markup: '',
      default_terms: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description,
      service_category: template.service_category,
      hourly_rate: template.hourly_rate?.toString() || '',
      materials_markup: template.materials_markup?.toString() || '',
      default_terms: template.default_terms
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveTemplate = () => {
    if (!templateForm.name || !templateForm.service_category) {
      toast.error('Please fill in required fields');
      return;
    }

    const templateData: Template = {
      id: editingTemplate?.id || Date.now().toString(),
      name: templateForm.name,
      description: templateForm.description,
      service_category: templateForm.service_category,
      hourly_rate: templateForm.hourly_rate ? parseFloat(templateForm.hourly_rate) : undefined,
      materials_markup: templateForm.materials_markup ? parseFloat(templateForm.materials_markup) : undefined,
      default_terms: templateForm.default_terms,
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

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      created_at: new Date().toISOString()
    };
    setTemplates(prev => [...prev, newTemplate]);
    toast.success('Template duplicated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice Templates</h2>
          <p className="text-gray-600">Create and manage reusable invoice templates for different services</p>
        </div>
        <Button onClick={handleCreateTemplate} className="bg-blue-600 hover:bg-blue-700">
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
                {template.hourly_rate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-medium">${template.hourly_rate}/hr</span>
                  </div>
                )}
                {template.materials_markup && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Materials Markup:</span>
                    <span className="font-medium">{template.materials_markup}%</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <Button size="sm" variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add New Template Card */}
        <Card 
          className="border-dashed border-2 hover:border-blue-400 cursor-pointer transition-colors"
          onClick={handleCreateTemplate}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <Plus className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="font-semibold text-gray-600 mb-2">Create New Template</h3>
            <p className="text-sm text-gray-500">Set up reusable invoice templates for your services</p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Template Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
            <DialogDescription>
              Set up a reusable template for invoicing your services
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={templateForm.name}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Standard Plumbing Service"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="service_category">Service Category *</Label>
              <Input
                id="service_category"
                value={templateForm.service_category}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, service_category: e.target.value }))}
                placeholder="e.g., Plumbing, Electrical, HVAC"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={templateForm.description}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this template..."
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
                placeholder="Payment terms, warranties, etc..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleSaveTemplate}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
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