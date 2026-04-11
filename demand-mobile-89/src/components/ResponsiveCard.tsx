
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResponsiveCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const ResponsiveCard = ({ 
  title, 
  children, 
  className = '',
  headerClassName = '',
  contentClassName = ''
}: ResponsiveCardProps) => {
  return (
    <Card className={`w-full ${className}`}>
      {title && (
        <CardHeader className={`pb-3 sm:pb-4 md:pb-6 ${headerClassName}`}>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={`p-3 sm:p-4 md:p-6 ${contentClassName}`}>
        {children}
      </CardContent>
    </Card>
  );
};
