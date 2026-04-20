
import { Crown, Building2, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Props {
    compact?: boolean;
}

export const PropertyManagerUpgradePrompt = ({ compact = false }: Props) => {
    const navigate = useNavigate();

    const features = [
        'Multi-property tracking & work orders',
        'Maintenance scheduling across units',
        'Tenant-related job management',
        'Priority support',
        'Advanced analytics',
    ];

    if (compact) {
        return (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem] border border-amber-200/50 p-6 flex flex-col transition-all">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black tracking-widest uppercase border border-amber-200 mb-1">
                            <Crown className="w-3 h-3" />
                            Premium
                        </div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">Property Management</h3>
                    </div>
                </div>
                <p className="text-xs font-medium text-slate-600 mb-5 leading-relaxed">
                    Track work orders, manage multiple units, and schedule maintenance.
                </p>
                <Button
                    onClick={() => navigate('/subscription')}
                    className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    Upgrade Now
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black tracking-[0.15em] uppercase border border-amber-200 mb-6">
                        <Crown className="w-3.5 h-3.5" />
                        Premium Feature
                    </div>
                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6">
                        <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-[#0A0A0A] tracking-tight mb-3">
                        Property Manager Tools
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Upgrade your account to unlock full property management capabilities — track work orders, manage multiple units, and keep maintenance on schedule.
                    </p>
                </div>

                {/* Features list */}
                <div className="bg-[#FAFAF5] rounded-[2rem] border border-black/5 p-8 mb-8 space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                        What you unlock
                    </p>
                    {features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <span className="text-sm font-semibold text-[#0A0A0A]">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <Button
                    onClick={() => navigate('/subscription')}
                    className="w-full h-14 bg-[#166534] hover:bg-[#14532d] text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                    <Crown className="w-5 h-5" />
                    Upgrade to Access
                    <ArrowRight className="w-5 h-5" />
                </Button>
                <p className="text-center text-[11px] font-medium text-slate-400 mt-4">
                    Cancel anytime · Instant access after upgrade
                </p>
            </div>
        </div>
    );
};
