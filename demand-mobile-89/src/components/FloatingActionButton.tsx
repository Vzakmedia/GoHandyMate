
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export const FloatingActionButton = ({ onClick, className = "" }: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`
        fixed bottom-24 right-4 
        w-16 h-16 
        bg-gradient-to-r from-green-600 to-orange-500 
        hover:from-green-700 hover:to-orange-600
        text-white 
        rounded-full 
        shadow-lg hover:shadow-xl 
        transition-all duration-300 
        z-40
        group
        ${className}
      `}
      size="lg"
    >
      <div className="flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors" />
        <Logo size="sm" showText={false} className="relative z-10" />
        <Plus className="w-4 h-4 absolute bottom-0 right-0 bg-white text-green-600 rounded-full p-0.5" />
      </div>
    </Button>
  );
};
