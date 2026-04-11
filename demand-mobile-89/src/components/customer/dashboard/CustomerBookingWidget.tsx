import { CalendarClock, MapPin, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MockTask {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  timeAgo: string;
  taskerCount: number;
  urgency: string;
}

interface Props {
  mockTasks: MockTask[];
  onTabChange: (tab: string) => void;
}

export const CustomerBookingWidget = ({ mockTasks, onTabChange }: Props) => {
  const activeBookings = mockTasks.slice(0, 1); // Mock 1 active booking

  return (
    <div className="bg-white border border-black/5 rounded-[3rem] p-8 sm:p-10 animate-fade-in relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-black/5 flex items-center justify-center">
            <CalendarClock className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Bookings</h3>
            <p className="text-[12px] font-medium text-slate-400">Your upcoming service appointments</p>
          </div>
        </div>
        
        {activeBookings.length > 0 && (
          <Button
            variant="ghost" 
            onClick={() => onTabChange('bookings')}
            className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold uppercase tracking-widest text-[10px]"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <div className="relative z-10">
        {activeBookings.length > 0 ? (
          <div className="space-y-4">
            {activeBookings.map((task, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-all duration-300">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-slate-900 leading-tight">
                      {task.title}
                    </h4>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest leading-none border border-emerald-200">
                      Confirmed
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                      <Wrench className="w-4 h-4 text-slate-400" />
                      {task.category}
                    </div>
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
                    <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {task.location}
                    </div>
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-[#166534]">
                      ${task.price}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-6">
                  <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shrink-0">
                    <img src={`https://i.pravatar.cc/150?u=${task.id}`} alt="Pro" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Pro</span>
                    <span className="text-sm font-bold text-slate-800">Available Pro</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-black/5">
              <CalendarClock className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-800 mb-1">No Active Bookings</p>
            <p className="text-[12px] font-medium text-slate-400 max-w-[200px]">
              Ready to get something fixed? Post a job or browse pros.
            </p>
            <Button
              onClick={() => onTabChange('services')}
              className="mt-6 bg-[#166534] hover:bg-[#14532d] text-white rounded-full font-black text-[11px] uppercase tracking-widest px-6"
            >
              Find a Professional
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
