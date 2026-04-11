
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface PortfolioItem {
  id: number;
  title: string;
  image: string;
}

interface PortfolioGalleryProps {
  portfolio: PortfolioItem[];
}

export const PortfolioGallery = ({ portfolio }: PortfolioGalleryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Work</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {portfolio.map((item) => (
            <div key={item.id} className="relative rounded-lg overflow-hidden group cursor-pointer">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-40 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-end">
                <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="font-medium">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
