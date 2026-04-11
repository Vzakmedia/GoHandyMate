import { SearchTabContent } from "@/components/customer-tabs/SearchTabContent";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Services = () => {
  const navigate = useNavigate();

  const handleProtectedAction = (action: () => void) => {
    action();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] pt-[100px]">
      {/* Search Header Container */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="lg:w-8/12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-green-800 text-[10px] font-black tracking-[0.15em] uppercase border border-green-100 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-green-600" />
              EXPLORE OUR NETWORK
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
              Premium Home Services, <br />
              <span className="text-green-800">Expertly Handled.</span>
            </h2>
          </div>
        </div>

        {/* Services Content */}
        <div className="-mt-8">
          <SearchTabContent onProtectedAction={handleProtectedAction} />
        </div>
      </div>
    </div>
  );
};