import { useState } from "react";
import { CommunityFeed } from "@/components/CommunityFeed";
import { ProfileView } from "@/components/community/ProfileView";
import { GroupsView } from "@/components/community/GroupsView";
import { ConnectionsView } from "@/components/community/ConnectionsView";
import { PeopleDiscovery } from "@/components/community/PeopleDiscovery";
import { CommunityEvents } from "@/components/community/CommunityEvents";
import { CommunityMarketplace } from "@/components/community/CommunityMarketplace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, LogIn, User, UserCheck, Calendar, ShoppingBag, Compass, TrendingUp } from "lucide-react";
import { useAuth } from '@/features/auth';

interface CommunityTabContentProps {
  onShowAuth: () => void;
}

type CommunityView = 'feed' | 'profile' | 'groups' | 'connections' | 'discover' | 'events' | 'marketplace';

export const CommunityTabContent = ({ onShowAuth }: CommunityTabContentProps) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<CommunityView>('feed');

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center bg-card rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">Join the Community</h3>
          <p className="text-muted-foreground mb-6">Connect with neighbors, share experiences, and discover local businesses in your area.</p>
          <Button onClick={onShowAuth} className="w-full">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'profile':
        return (
          <ProfileView
            onBack={() => setCurrentView('feed')}
            onNavigateToConnections={() => setCurrentView('connections')}
            onNavigateToGroups={() => setCurrentView('groups')}
          />
        );
      case 'groups':
        return <GroupsView onBack={() => setCurrentView('feed')} />;
      case 'connections':
        return <ConnectionsView onBack={() => setCurrentView('feed')} />;
      case 'discover':
        return <PeopleDiscovery onBack={() => setCurrentView('feed')} />;
      case 'events':
        return <CommunityEvents onBack={() => setCurrentView('feed')} />;
      case 'marketplace':
        return <CommunityMarketplace onBack={() => setCurrentView('feed')} />;
      default:
      case 'feed':
        return <CommunityFeed />;
    }
  };

  return (
    <div className="w-full bg-transparent">
      {/* Refined Sub-Navigation Bar */}
      <div className="mb-6 sm:mb-8 -mx-4 sm:mx-0">
        <div className="overflow-x-auto scrollbar-hide px-4 sm:px-0 pb-2 flex">
          <div className="flex w-max items-center gap-1.5 sm:gap-2 p-1.5 bg-white/50 backdrop-blur-sm border border-black/5 rounded-[2rem]">
          <Button
            variant={currentView === 'feed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('feed')}
            className={`rounded-full px-6 transition-all duration-300 ${currentView === 'feed' ? 'bg-[#166534] text-white' : 'text-slate-500 hover:text-[#166534]'}`}
          >
            <TrendingUp className="w-3.5 h-3.5 mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Feed</span>
          </Button>

          <Button
            variant={currentView === 'discover' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('discover')}
            className={`rounded-full px-6 transition-all duration-300 ${currentView === 'discover' ? 'bg-[#166534] text-white' : 'text-slate-500 hover:text-[#166534]'}`}
          >
            <Compass className="w-3.5 h-3.5 mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Discover</span>
          </Button>

          <Button
            variant={currentView === 'connections' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('connections')}
            className={`rounded-full px-6 transition-all duration-300 ${currentView === 'connections' ? 'bg-[#166534] text-white' : 'text-slate-500 hover:text-[#166534]'}`}
          >
            <UserCheck className="w-3.5 h-3.5 mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">People</span>
          </Button>

          <Button
            variant={currentView === 'groups' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('groups')}
            className={`rounded-full px-6 transition-all duration-300 ${currentView === 'groups' ? 'bg-[#166534] text-white' : 'text-slate-500 hover:text-[#166534]'}`}
          >
            <Users className="w-3.5 h-3.5 mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Groups</span>
          </Button>

          <Button
            variant={currentView === 'events' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('events')}
            className={`rounded-full px-6 transition-all duration-300 ${currentView === 'events' ? 'bg-[#166534] text-white' : 'text-slate-500 hover:text-[#166534]'}`}
          >
            <Calendar className="w-3.5 h-3.5 mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Events</span>
          </Button>

          <Button
            variant={currentView === 'marketplace' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('marketplace')}
            className={`rounded-full px-6 transition-all duration-300 ${currentView === 'marketplace' ? 'bg-[#166534] text-white' : 'text-slate-500 hover:text-[#166534]'}`}
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Market</span>
          </Button>

          <Button
            variant={currentView === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('profile')}
            className={`rounded-full px-6 transition-all duration-300 ${currentView === 'profile' ? 'bg-[#166534] text-white' : 'text-slate-500 hover:text-[#166534]'}`}
          >
            <User className="w-3.5 h-3.5 mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
          </Button>
        </div>
       </div>
      </div>

      <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-black/5 shadow-sm overflow-hidden mb-20 sm:mb-0">
        {renderCurrentView()}
      </div>
    </div>
  );
};
