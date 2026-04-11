import { Search, PlusCircle, Calendar, MessageSquare } from "lucide-react";

interface Props {
  onTabChange: (tab: string) => void;
}

export const CustomerQuickActions = ({ onTabChange }: Props) => {
  const actions = [
    {
      title: "Find a Pro",
      description: "Browse trusted handymen",
      icon: Search,
      onClick: () => onTabChange("services"),
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-100",
    },
    {
      title: "Post a Job",
      description: "Get quotes quickly",
      icon: PlusCircle,
      onClick: () => onTabChange("services"), // Ideally opens a job modal
      color: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-100",
    },
    {
      title: "My Bookings",
      description: "View scheduled visits",
      icon: Calendar,
      onClick: () => onTabChange("bookings"),
      color: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-100",
    },
    {
      title: "Messages",
      description: "Chat with your pros",
      icon: MessageSquare,
      onClick: () => onTabChange("messages"),
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-100",
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <button
            key={i}
            onClick={action.onClick}
            className={`flex flex-col items-center text-center p-6 rounded-[2rem] border ${action.borderColor} ${action.color} transition-all duration-300 group`}
          >
            <div className={`w-12 h-12 rounded-2xl bg-white border ${action.borderColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-5 h-5 ${action.iconColor}`} />
            </div>
            <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-800 mb-1">
              {action.title}
            </h3>
            <p className="text-[10px] font-medium text-slate-500">
              {action.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};
