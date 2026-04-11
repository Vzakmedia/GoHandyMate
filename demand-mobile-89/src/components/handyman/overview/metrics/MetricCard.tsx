
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  subtitle: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  gradientColors: string;
  borderColor: string;
  footerText: string;
  footerIcon: LucideIcon;
  badgeText: string;
  badgeColors: string;
}

export const MetricCard = ({
  title,
  subtitle,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  gradientColors,
  borderColor,
  footerText,
  footerIcon: FooterIcon,
  badgeText,
  badgeColors
}: MetricCardProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden border border-black/5 bg-white rounded-[2rem] transition-all duration-500 group",
    )}>
      <CardContent className="p-7">
        <div className="flex justify-between items-start mb-6">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
            iconBgColor
          )}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
          <Badge className={cn("px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border-none", badgeColors)}>
            {badgeText}
          </Badge>
        </div>

        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{value}</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">{subtitle}</p>
        </div>

        <div className="mt-8 flex items-center gap-2.5 text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] pt-5 border-t border-black/5">
          <div className="p-1.5 rounded-lg bg-slate-50">
            <FooterIcon className="w-3.5 h-3.5" />
          </div>
          <span>{footerText}</span>
        </div>
      </CardContent>

      {/* Premium accent bar */}
      <div className={cn("absolute bottom-0 left-0 right-0 h-1.5 opacity-40", iconBgColor)} />
    </Card>
  );
};
