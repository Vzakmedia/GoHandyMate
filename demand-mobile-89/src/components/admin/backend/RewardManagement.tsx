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
import { Gift, Plus, Edit, Trash2, Award, Star, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Reward {
  id: string;
  title: string;
  description: string;
  reward_type: string;
  points_required?: number;
  cash_value?: number;
  badge_icon?: string;
  requirements: any;
  is_active: boolean;
  expiry_days?: number;
  created_at: string;
}

const REWARD_TYPES = [
  { value: 'points', label: 'Points', icon: Star },
  { value: 'badge', label: 'Badge', icon: Award },
  { value: 'discount', label: 'Discount', icon: Gift },
  { value: 'free_service', label: 'Free Service', icon: Gift },
  { value: 'cash_reward', label: 'Cash Reward', icon: DollarSign }
];

const BADGE_ICONS = [
  '🏆', '🥇', '🥈', '🥉', '⭐', '🌟', '💎', '👑', '🎯', '🔥',
  '💪', '🚀', '🎊', '🎉', '🏅', '🎖️', '🔨', '🛠️', '🏠', '⚡'
];

export const RewardManagement = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward_type: 'points',
    points_required: '',
    cash_value: '',
    badge_icon: '🏆',
    requirements: '{}',
    expiry_days: '',
    is_active: true
  });

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast.error('Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let requirements = {};
      try {
        requirements = JSON.parse(formData.requirements);
      } catch {
        requirements = {};
      }

      const rewardData = {
        title: formData.title,
        description: formData.description,
        reward_type: formData.reward_type,
        points_required: formData.points_required ? parseInt(formData.points_required) : null,
        cash_value: formData.cash_value ? parseFloat(formData.cash_value) : null,
        badge_icon: formData.reward_type === 'badge' ? formData.badge_icon : null,
        requirements,
        expiry_days: formData.expiry_days ? parseInt(formData.expiry_days) : null,
        is_active: formData.is_active
      };

      if (editingReward) {
        const { error } = await supabase
          .from('rewards')
          .update(rewardData)
          .eq('id', editingReward.id);

        if (error) throw error;
        toast.success('Reward updated successfully');
      } else {
        const { error } = await supabase
          .from('rewards')
          .insert({ ...rewardData, created_by: (await supabase.auth.getUser()).data.user?.id });

        if (error) throw error;
        toast.success('Reward created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchRewards();
    } catch (error) {
      console.error('Error saving reward:', error);
      toast.error('Failed to save reward');
    }
  };

  const resetForm = () => {
    setEditingReward(null);
    setFormData({
      title: '',
      description: '',
      reward_type: 'points',
      points_required: '',
      cash_value: '',
      badge_icon: '🏆',
      requirements: '{}',
      expiry_days: '',
      is_active: true
    });
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setFormData({
      title: reward.title,
      description: reward.description,
      reward_type: reward.reward_type,
      points_required: reward.points_required?.toString() || '',
      cash_value: reward.cash_value?.toString() || '',
      badge_icon: reward.badge_icon || '🏆',
      requirements: JSON.stringify(reward.requirements || {}, null, 2),
      expiry_days: reward.expiry_days?.toString() || '',
      is_active: reward.is_active
    });
    setIsDialogOpen(true);
  };

  const toggleRewardStatus = async (rewardId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ is_active: !isActive })
        .eq('id', rewardId);

      if (error) throw error;
      toast.success(`Reward ${!isActive ? 'activated' : 'deactivated'}`);
      fetchRewards();
    } catch (error) {
      console.error('Error updating reward status:', error);
      toast.error('Failed to update reward status');
    }
  };

  const deleteReward = async (rewardId: string) => {
    if (!confirm('Are you sure you want to delete this reward?')) return;

    try {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', rewardId);

      if (error) throw error;
      toast.success('Reward deleted successfully');
      fetchRewards();
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast.error('Failed to delete reward');
    }
  };

  const getRewardIcon = (rewardType: string) => {
    const rewardTypeData = REWARD_TYPES.find(t => t.value === rewardType);
    return rewardTypeData ? rewardTypeData.icon : Gift;
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
          <Gift className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Reward Management</h3>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Reward
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingReward ? 'Edit Reward' : 'Create New Reward'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter reward title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter reward description"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reward_type">Reward Type</Label>
                <Select value={formData.reward_type} onValueChange={(value) => setFormData(prev => ({ ...prev, reward_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REWARD_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.reward_type === 'points' && (
                <div>
                  <Label htmlFor="points_required">Points Required</Label>
                  <Input
                    id="points_required"
                    type="number"
                    value={formData.points_required}
                    onChange={(e) => setFormData(prev => ({ ...prev, points_required: e.target.value }))}
                    placeholder="Points required to redeem"
                  />
                </div>
              )}

              {(formData.reward_type === 'cash_reward' || formData.reward_type === 'discount') && (
                <div>
                  <Label htmlFor="cash_value">Cash Value ($)</Label>
                  <Input
                    id="cash_value"
                    type="number"
                    step="0.01"
                    value={formData.cash_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, cash_value: e.target.value }))}
                    placeholder="Enter cash value"
                  />
                </div>
              )}

              {formData.reward_type === 'badge' && (
                <div>
                  <Label htmlFor="badge_icon">Badge Icon</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {BADGE_ICONS.map(icon => (
                      <Button
                        key={icon}
                        type="button"
                        variant={formData.badge_icon === icon ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, badge_icon: icon }))}
                      >
                        {icon}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="requirements">Requirements (JSON)</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder='{"min_jobs": 5, "rating": 4.5}'
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JSON object defining requirements to earn this reward
                </p>
              </div>

              <div>
                <Label htmlFor="expiry_days">Expiry Days</Label>
                <Input
                  id="expiry_days"
                  type="number"
                  value={formData.expiry_days}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiry_days: e.target.value }))}
                  placeholder="Days until expiry (optional)"
                />
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
                  {editingReward ? 'Update' : 'Create'} Reward
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {rewards.map(reward => {
          const IconComponent = getRewardIcon(reward.reward_type);
          return (
            <Card key={reward.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      {reward.reward_type === 'badge' ? (
                        <span className="text-2xl">{reward.badge_icon}</span>
                      ) : (
                        <IconComponent className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-lg">{reward.title}</h4>
                        <Badge variant={reward.is_active ? 'default' : 'secondary'}>
                          {reward.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {REWARD_TYPES.find(t => t.value === reward.reward_type)?.label}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{reward.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {reward.points_required && (
                          <span>⭐ {reward.points_required} points</span>
                        )}
                        {reward.cash_value && (
                          <span>💰 ${reward.cash_value}</span>
                        )}
                        {reward.expiry_days && (
                          <span>⏰ Expires in {reward.expiry_days} days</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(reward)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant={reward.is_active ? "destructive" : "default"}
                      onClick={() => toggleRewardStatus(reward.id, reward.is_active)}
                    >
                      {reward.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteReward(reward.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};