
import { JobHistory } from "@/components/JobHistory";
import { ReviewSystem } from "@/components/ReviewSystem";
import { Button } from "@/components/ui/button";
import { History, LogIn } from "lucide-react";
import { useAuth } from '@/features/auth';

interface HistoryTabContentProps {
  onShowAuth: () => void;
}

export const HistoryTabContent = ({ onShowAuth }: HistoryTabContentProps) => {
  const { user } = useAuth();

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <History className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold">Job History</h2>
      </div>
      
      {user ? (
        <>
          <div>
            <JobHistory />
          </div>
          
          <div>
            <ReviewSystem userType="customer" />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">View Your Job History</h3>
          <p className="text-gray-600 mb-6">Sign in to see your past bookings and reviews</p>
          <Button onClick={onShowAuth} className="bg-green-600 hover:bg-green-700">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In to Continue
          </Button>
        </div>
      )}
    </div>
  );
};
