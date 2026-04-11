
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SecondaryMetricProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
}

export const SecondaryMetric = ({ title, value, icon: Icon, description }: SecondaryMetricProps) => {
  return (
    <Card className="bg-white border border-black/5 rounded-[1.5rem] group transition-all duration-500">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 rounded-xl border border-black/5 flex items-center justify-center transition-colors group-hover:bg-[#166534]/5 group-hover:text-[#166534]">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{title}</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900 tracking-tight">{value}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-80">{description}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
