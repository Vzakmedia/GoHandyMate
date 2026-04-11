import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  AlertTriangle, 
  UserX, 
  Trash2, 
  Mail, 
  Calendar, 
  Shield,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SpamUser {
  id: string;
  full_name: string;
  email: string;
  user_role: string;
  account_status: string;
  created_at: string;
  phone?: string;
  subscription_plan?: string;
  subscription_status?: string;
  spam_score: number;
  spam_reasons: string[];
}

export const SpamUserManager = () => {
  const [spamUsers, setSpamUsers] = useState<SpamUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpamUsers();
  }, []);

  const fetchSpamUsers = async () => {
    try {
      setLoading(true);
      
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, user_role, account_status, created_at, phone, subscription_plan, subscription_status')
        .neq('account_status', 'suspended'); // Don't show already suspended users

      if (error) throw error;

      // Analyze users for spam indicators
      const analyzedUsers = users?.map(user => {
        const spamIndicators = analyzeSpamIndicators(user);
        return {
          ...user,
          spam_score: spamIndicators.score,
          spam_reasons: spamIndicators.reasons
        };
      }).filter(user => user.spam_score > 0)
        .sort((a, b) => b.spam_score - a.spam_score) || [];

      setSpamUsers(analyzedUsers);
    } catch (error) {
      console.error('Error fetching spam users:', error);
      toast.error('Failed to fetch spam users');
    } finally {
      setLoading(false);
    }
  };

  const analyzeSpamIndicators = (user: any) => {
    let score = 0;
    const reasons: string[] = [];
    const joinDate = new Date(user.created_at);
    const daysSinceJoin = (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24);

    // Check for missing phone
    if (!user.phone && user.user_role !== 'customer') {
      score += 2;
      reasons.push('No phone number provided');
    }

    // Check for generic/test names
    const name = user.full_name?.toLowerCase() || '';
    if (name.includes('test') || name.includes('user') || name === 'n/a' || name.length < 3) {
      score += 3;
      reasons.push('Suspicious name pattern');
    }

    // Check recent join with no activity
    if (daysSinceJoin < 7 && !user.subscription_plan) {
      score += 2;
      reasons.push('Recently joined with no subscription');
    }

    // Check for incomplete profiles
    if (!user.phone && (!user.full_name || user.full_name === 'N/A')) {
      score += 3;
      reasons.push('Incomplete profile information');
    }

    // Check for suspicious email patterns
    const email = user.email?.toLowerCase() || '';
    if (email.includes('test') || email.includes('spam') || email.includes('temp')) {
      score += 4;
      reasons.push('Suspicious email pattern');
    }

    // Multiple accounts with similar patterns
    if (daysSinceJoin < 1) {
      score += 1;
      reasons.push('Very recently created');
    }

    return { score, reasons };
  };

  const handleSuspendUsers = async (userIds: string[]) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_status: 'suspended',
          updated_at: new Date().toISOString()
        })
        .in('id', userIds);

      if (error) throw error;

      toast.success(`${userIds.length} user(s) suspended successfully`);
      setSelectedUsers(new Set());
      await fetchSpamUsers();
    } catch (error) {
      console.error('Error suspending users:', error);
      toast.error('Failed to suspend users');
    }
  };

  const handleDeleteUsers = async (userIds: string[]) => {
    try {
      // Delete users one by one using the secure admin RPC function
      for (const userId of userIds) {
        const { error } = await supabase.rpc('admin_delete_user', {
          user_id_to_delete: userId
        });
        
        if (error) throw error;
      }

      toast.success(`${userIds.length} user(s) deleted successfully`);
      setSelectedUsers(new Set());
      await fetchSpamUsers();
    } catch (error) {
      console.error('Error deleting users:', error);
      toast.error('Failed to delete users: ' + (error as any).message);
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const selectAllHighRisk = () => {
    const highRiskUsers = spamUsers.filter(user => user.spam_score >= 5);
    setSelectedUsers(new Set(highRiskUsers.map(user => user.id)));
  };

  const getSpamRiskColor = (score: number) => {
    if (score >= 7) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (score >= 4) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  };

  const getSpamRiskLabel = (score: number) => {
    if (score >= 7) return 'High Risk';
    if (score >= 4) return 'Medium Risk';
    return 'Low Risk';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Suspected Spam Users
            </CardTitle>
            <CardDescription>
              Users flagged for potential spam activity based on profile analysis
            </CardDescription>
          </div>
          <Button onClick={fetchSpamUsers} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {spamUsers.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No suspected spam users found</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={selectAllHighRisk} 
                  size="sm" 
                  variant="outline"
                  disabled={spamUsers.filter(u => u.spam_score >= 5).length === 0}
                >
                  Select High Risk ({spamUsers.filter(u => u.spam_score >= 5).length})
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedUsers.size} of {spamUsers.length} selected
                </span>
              </div>
              
              {selectedUsers.size > 0 && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSuspendUsers(Array.from(selectedUsers))}
                    size="sm"
                    variant="outline"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend Selected
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-background border shadow-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Selected Users</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to permanently delete {selectedUsers.size} selected user(s)?
                          <br /><br />
                          <span className="text-destructive font-semibold">
                            This action cannot be undone. All user data will be permanently removed.
                          </span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUsers(Array.from(selectedUsers))}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {spamUsers.map((user) => (
                <div key={user.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{user.full_name}</h4>
                          <Badge className={getSpamRiskColor(user.spam_score)}>
                            {getSpamRiskLabel(user.spam_score)} ({user.spam_score})
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {user.user_role}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                        {user.subscription_plan && (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            <span>Plan: {user.subscription_plan}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {user.spam_reasons.map((reason, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};