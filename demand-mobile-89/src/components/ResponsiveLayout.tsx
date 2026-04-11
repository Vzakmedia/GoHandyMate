
import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveLayout = ({ children, className = '' }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`
      w-full min-h-screen
      ${className}
    `}>
      {children}
    </div>
  );
};
