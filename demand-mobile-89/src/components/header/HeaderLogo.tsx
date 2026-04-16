import { useNavigate } from "react-router-dom";

export const HeaderLogo = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity group"
      onClick={() => navigate('/app')}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
        <img
          src="/gohandymate-logo.png"
          alt="GoHandyMate Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-xl sm:text-2xl font-bold text-green-900 tracking-tight hidden xs:inline-block">
        GoHandyMate
      </span>
    </div>
  );
};
