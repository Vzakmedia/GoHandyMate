
import { Mail, Phone } from "lucide-react";

interface ContactInfoProps {
  email?: string;
  phone?: string;
}

export const ContactInfo = ({ email, phone }: ContactInfoProps) => {
  return (
    <div className="bg-slate-50/50 rounded-[20px] p-2.5 border border-black/5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-8 text-[11px] font-black uppercase tracking-widest">
        {email && (
          <div className="flex items-center justify-center gap-2.5 text-slate-500 hover:text-[#166534] transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-black/5 group-hover:border-emerald-100 transition-colors">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <span className="break-all">{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center justify-center gap-2.5 text-slate-500 hover:text-[#166534] transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-black/5 group-hover:border-emerald-100 transition-colors">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <span>{phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};
