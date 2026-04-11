
import { useProfile } from './ProfileProvider';
import { SkillsManager } from '../SkillsManager';
import { ProfileBio } from '../ProfileBio';
import { useHandymanData } from '@/hooks/useHandymanData';
import { User, MapPin, Briefcase, Star, Clock } from 'lucide-react';

export const OverviewTab = () => {
  const { profileData, isEditing, setProfileData } = useProfile();
  const { data: handymanData, loading } = useHandymanData();

  // Count ALL active services including subcategories for total count
  const allActiveServices = handymanData.servicePricing?.filter(service => 
    service.is_active
  ) || [];

  // Count only main service categories (no subcategories) for category count
  const activeMainServices = handymanData.servicePricing?.filter(service => 
    service.is_active && !service.subcategory_id
  ) || [];

  const totalActiveServices = allActiveServices.length;
  const totalMainCategories = activeMainServices.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-[24px] p-6 border border-black/5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in outline-none">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Experience', value: profileData.experience, icon: Clock, color: 'blue' },
          { label: 'Location', value: profileData.location, icon: MapPin, color: 'emerald' },
          { label: 'Active Services', value: totalActiveServices, icon: Briefcase, color: 'amber' },
          { label: 'Main Categories', value: totalMainCategories, icon: Star, color: 'indigo' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[24px] p-6 border border-black/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
              <div className="p-2 rounded-[12px] bg-slate-50 border border-black/5">
                <stat.icon className="w-4 h-4 text-[#166534]" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Profile Bio */}
      <div className="bg-white rounded-[24px] border border-black/5 overflow-hidden">
        <ProfileBio
          profileData={profileData}
          isEditing={isEditing}
          onProfileDataChange={setProfileData}
        />
      </div>

      {/* Service Categories Info */}
      <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
        <SkillsManager isEditing={isEditing} />
      </div>
    </div>
  );
};
