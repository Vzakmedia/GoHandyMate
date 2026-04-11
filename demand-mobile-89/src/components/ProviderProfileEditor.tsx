import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const ProviderProfileEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [handyman, setHandyman] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: pData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      const { data: hData } = await supabase.from('handymen').select('*').eq('user_id', user.id).single();
      
      if (pData) setProfile(pData);
      if (hData) setHandyman(hData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Update profiles
      const { error: pErr } = await supabase.from('profiles').update({ 
        full_name: profile.full_name,
        phone: profile.phone
      }).eq('id', user.id);
      if (pErr) throw pErr;

      // Update handymen
      if (handyman) {
        const { error: hErr } = await supabase.from('handymen').update({
           hourly_rate: handyman.hourly_rate,
           bio: handyman.bio
        }).eq('id', handyman.id);
        if (hErr) throw hErr;
      }
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading profile data...</div>;
  if (!profile) return <div className="text-sm text-red-500">Profile not found.</div>;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-gray-700 font-semibold mb-1 block">Full Name</Label>
          <Input 
            value={profile.full_name || ''} 
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} 
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label className="text-gray-700 font-semibold mb-1 block">Phone Number</Label>
          <Input 
            value={profile.phone || ''} 
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })} 
            placeholder="+123456789"
          />
        </div>

        {handyman && (
          <>
            <div>
              <Label className="text-gray-700 font-semibold mb-1 block">Hourly Rate ($)</Label>
              <Input 
                type="number" 
                value={handyman.hourly_rate || ''} 
                onChange={(e) => setHandyman({ ...handyman, hourly_rate: parseFloat(e.target.value) || 0 })} 
              />
            </div>
            <div>
              <Label className="text-gray-700 font-semibold mb-1 block">Bio</Label>
              <Textarea 
                value={handyman.bio || ''} 
                onChange={(e) => setHandyman({ ...handyman, bio: e.target.value })} 
                placeholder="Tell clients about your experience..."
                rows={4}
              />
            </div>
          </>
        )}
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
        {saving ? 'Saving...' : 'Save Profile Changes'}
      </Button>
    </div>
  );
};
