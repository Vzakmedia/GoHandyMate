import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AboutHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};