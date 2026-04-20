import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Edit, Trash2, Tag, Users, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Promotion {
  id: string;
  title: string;
  description: string;
  promotion_type: string;
  value_type: string;
  value_amount: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number;
  code?: string;
  target_audience: string;
  usage_limit?: number;
  usage_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

const PROMOTION_TYPES = [
  { value: 'discount', label: 'Discount' },
  { value: 'bogo', label: 'Buy One Get One' },
  { value: 'free_service', label: 'Free Service' },
  { value: 'cashback', label: 'Cashback' },
  { value: 'referral', label: 'Referral Bonus' }
];

const VALUE_TYPES = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed_amount', label: 'Fixed Amount' },
  { value: 'free', label: 'Free' }
];

const TARGET_AUDIENCES = [
  { value: 'all', label: 'All Users' },
  { value: 'new_customers', label: 'New Customers' },
  { value: 'existing_customers', label: 'Existing Customers' },
  { value: 'handymen', label: 'Handymen' }
  // contractors and property_managers removed — those roles are archived
];

export const PromotionManagement = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    promotion_type: 'discount',
    value_type: 'percentage',
    value_amount: 0,
    minimum_order_amount: 0,
    maximum_discount_amount: '',
    code: '',
    target_audience: 'all',
    usage_limit: '',
    is_active: true
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Failed to fetch promotions');
    } finally {
      setLoading(false);
    }
  };

  const generatePromoCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    try {
      const promotionData = {
        title: formData.title,
        description: formData.description,
        promotion_type: formData.promotion_type,
        value_type: formData.value_type,
        value_amount: formData.value_amount,
        minimum_order_amount: formData.minimum_order_amount,
        maximum_discount_amount: formData.maximum_discount_amount ? parseFloat(formData.maximum_discount_amount) : null,
        code: formData.code || null,
        target_audience: formData.target_audience,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        is_active: formData.is_active
      };

      if (editingPromotion) {
        const { error } = await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', editingPromotion.id);

        if (error) throw error;
        toast.success('Promotion updated successfully');
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert({ ...promotionData, created_by: (await supabase.auth.getUser()).data.user?.id });

        if (error) throw error;
        toast.success('Promotion created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPromotions();
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error('Failed to save promotion');
    }
  };

  const resetForm = () => {
    setEditingPromotion(null);
    setFormData({
      title: '',
      description: '',
      promotion_type: 'discount',
      value_type: 'percentage',
      value_amount: 0,
      minimum_order_amount: 0,
      maximum_discount_amount: '',
      code: '',
      target_audience: 'all',
      usage_limit: '',
      is_active: true
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      promotion_type: promotion.promotion_type,
      value_type: promotion.value_type,
      value_amount: promotion.value_amount,
      minimum_order_amount: promotion.minimum_order_amount,
      maximum_discount_amount: promotion.maximum_discount_amount?.toString() || '',
      code: promotion.code || '',
      target_audience: promotion.target_audience,
      usage_limit: promotion.usage_limit?.toString() || '',
      is_active: promotion.is_active
    });
    setStartDate(new Date(promotion.start_date));
    setEndDate(new Date(promotion.end_date));
    setIsDialogOpen(true);
  };

  const togglePromotionStatus = async (promotionId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ is_active: !isActive })
        .eq('id', promotionId);

      if (error) throw error;
      toast.success(`Promotion ${!isActive ? 'activated' : 'deactivated'}`);
      fetchPromotions();
    } catch (error) {
      console.error('Error updating promotion status:', error);
      toast.error('Failed to update promotion status');
    }
  };

  const deletePromotion = async (promotionId: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionId);

      if (error) throw error;
      toast.success('Promotion deleted successfully');
      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast.error('Failed to delete promotion');
    }
  };

  const getPromotionValue = (promotion: Promotion) => {
    if (promotion.value_type === 'percentage') {
      return `${promotion.value_amount}%`;
    } else if (promotion.value_type === 'fixed_amount') {
      return `$${promotion.value_amount}`;
    } else {
      return 'Free';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Promotion Management</h3>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter promotion title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter promotion description"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="promotion_type">Promotion Type</Label>
                  <Select value={formData.promotion_type} onValueChange={(value) => setFormData(prev => ({ ...prev, promotion_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROMOTION_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="value_type">Value Type</Label>
                  <Select value={formData.value_type} onValueChange={(value) => setFormData(prev => ({ ...prev, value_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select value type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VALUE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.value_type !== 'free' && (
                <div>
                  <Label htmlFor="value_amount">
                    Value Amount {formData.value_type === 'percentage' ? '(%)' : '($)'}
                  </Label>
                  <Input
                    id="value_amount"
                    type="number"
                    step="0.01"
                    value={formData.value_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, value_amount: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minimum_order_amount">Minimum Order Amount ($)</Label>
                  <Input
                    id="minimum_order_amount"
                    type="number"
                    step="0.01"
                    value={formData.minimum_order_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimum_order_amount: parseFloat(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="maximum_discount_amount">Maximum Discount Amount ($)</Label>
                  <Input
                    id="maximum_discount_amount"
                    type="number"
                    step="0.01"
                    value={formData.maximum_discount_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, maximum_discount_amount: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="code">Promo Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="Enter or generate code"
                  />
                  <Button type="button" variant="outline" onClick={generatePromoCode}>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Select value={formData.target_audience} onValueChange={(value) => setFormData(prev => ({ ...prev, target_audience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_AUDIENCES.map(audience => (
                        <SelectItem key={audience.value} value={audience.value}>
                          {audience.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="usage_limit">Usage Limit</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPromotion ? 'Update' : 'Create'} Promotion
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {promotions.map(promotion => (
          <Card key={promotion.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="font-semibold text-lg">{promotion.title}</h4>
                    <Badge variant={promotion.is_active ? 'default' : 'secondary'}>
                      {promotion.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {PROMOTION_TYPES.find(t => t.value === promotion.promotion_type)?.label}
                    </Badge>
                    <Badge variant="outline">
                      {getPromotionValue(promotion)} off
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">{promotion.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>📅 {format(new Date(promotion.start_date), 'MMM dd')} - {format(new Date(promotion.end_date), 'MMM dd, yyyy')}</span>
                    {promotion.code && <span>🏷️ Code: {promotion.code}</span>}
                    <span>👥 {TARGET_AUDIENCES.find(a => a.value === promotion.target_audience)?.label}</span>
                    {promotion.usage_limit && (
                      <span>📊 {promotion.usage_count}/{promotion.usage_limit} used</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(promotion)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={promotion.is_active ? "destructive" : "default"}
                    onClick={() => togglePromotionStatus(promotion.id, promotion.is_active)}
                  >
                    {promotion.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deletePromotion(promotion.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};