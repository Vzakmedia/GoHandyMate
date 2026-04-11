import { ChatManagement } from '@/components/admin/ChatManagement';

export const AdminChatDashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <ChatManagement />
      </div>
    </div>
  );
};