import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const SecuritySettingsSection = () => {
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      setNewPassword("");
      setIsChangingPwd(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security & Privacy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isChangingPwd ? (
          <div className="space-y-3 p-4 border rounded-md mb-4 bg-gray-50">
            <h4 className="font-medium text-sm">Update Password</h4>
            <Input 
              type="password" 
              placeholder="Enter new password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <Button onClick={handleUpdatePassword} disabled={loading} size="sm">
                {loading ? "Updating..." : "Save Password"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsChangingPwd(false)} disabled={loading}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full justify-start" onClick={() => setIsChangingPwd(true)}>
            Change Password
          </Button>
        )}
        <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Two-factor authentication coming soon")}>
          Two-Factor Authentication
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Privacy settings coming soon")}>
          Privacy Settings
        </Button>
        <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" onClick={() => toast.info("Account deletion requires contacting support")}>
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
};
