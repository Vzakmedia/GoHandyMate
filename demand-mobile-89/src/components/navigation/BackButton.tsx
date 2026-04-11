
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  label?: string;
  onClick?: () => void;
}

export const BackButton = ({ to, label = "Back", onClick }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="flex items-center space-x-2"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  );
};
