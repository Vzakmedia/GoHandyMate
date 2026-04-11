import { ArrowLeft } from "lucide-react";

interface ProHeaderProps {
  onBack: () => void;
}

export const ProHeader = ({ onBack }: ProHeaderProps) => {
  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};