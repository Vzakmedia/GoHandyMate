
import { CustomerProfile } from "@/components/CustomerProfile";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";
import { useAuth } from '@/features/auth';

interface ProfileTabContentProps {
  onShowAuth: () => void;
}

export const ProfileTabContent = ({ onShowAuth }: ProfileTabContentProps) => {
  const { user } = useAuth();

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8 pb-24 sm:pb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold">Profile & Settings</h2>
      </div>

      {user ? (
        <CustomerProfile />
      ) : (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Manage Your Profile</h3>
          <p className="text-gray-600 mb-6">Sign in to view and edit your profile settings</p>
          <Button onClick={onShowAuth} className="bg-green-600 hover:bg-green-700">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In to Continue
          </Button>
        </div>
      )}
    </div>
  );
};
