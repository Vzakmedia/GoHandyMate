import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Search, MapPin, Plus, Star, Filter, DollarSign, Heart } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';

interface CommunityMarketplaceProps {
  onBack: () => void;
}

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: 'services' | 'goods' | 'housing' | 'jobs' | 'vehicles';
  seller_name: string;
  seller_avatar?: string;
  seller_rating?: number;
  location: string;
  images: string[];
  created_at: string;
  is_favorite?: boolean;
  is_featured?: boolean;
}

export const CommunityMarketplace = ({ onBack }: CommunityMarketplaceProps) => {
  const { user } = useAuth();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'services' | 'goods' | 'housing' | 'jobs'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, searchQuery, filterBy]);

  const fetchMarketplaceItems = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - in real app would fetch from marketplace_items table
      const mockItems: MarketplaceItem[] = [
        {
          id: '1',
          title: 'Professional Plumbing Services',
          description: 'Licensed plumber with 10+ years experience. Available for all your plumbing needs - repairs, installations, and emergencies.',
          price: 75,
          currency: 'USD',
          category: 'services',
          seller_name: 'Mike Thompson',
          seller_avatar: '',
          seller_rating: 4.8,
          location: '2.1 miles away',
          images: [],
          created_at: '2024-01-15T00:00:00Z',
          is_favorite: false,
          is_featured: true
        },
        {
          id: '2',
          title: 'Vintage Oak Dining Table',
          description: 'Beautiful vintage oak dining table with 6 chairs. Great condition, perfect for family dinners.',
          price: 450,
          currency: 'USD',
          category: 'goods',
          seller_name: 'Sarah Johnson',
          seller_avatar: '',
          seller_rating: 4.9,
          location: '1.5 miles away',
          images: [],
          created_at: '2024-01-14T00:00:00Z',
          is_favorite: true,
          is_featured: false
        },
        {
          id: '3',
          title: '2-Bedroom Apartment for Rent',
          description: 'Cozy 2-bedroom apartment in quiet neighborhood. Recently renovated, pet-friendly, parking included.',
          price: 1200,
          currency: 'USD',
          category: 'housing',
          seller_name: 'Property Manager',
          seller_avatar: '',
          seller_rating: 4.5,
          location: 'Downtown Area',
          images: [],
          created_at: '2024-01-13T00:00:00Z',
          is_favorite: false,
          is_featured: true
        },
        {
          id: '4',
          title: 'Part-time Babysitter Needed',
          description: 'Looking for a reliable babysitter for 2 children (ages 5 and 8). Weekday evenings, references required.',
          price: 15,
          currency: 'USD',
          category: 'jobs',
          seller_name: 'Emily Chen',
          seller_avatar: '',
          seller_rating: 4.7,
          location: 'Maple Street',
          images: [],
          created_at: '2024-01-12T00:00:00Z',
          is_favorite: false,
          is_featured: false
        },
        {
          id: '5',
          title: 'Garden Maintenance Service',
          description: 'Professional garden maintenance and landscaping. Weekly or monthly service available. Free consultation.',
          price: 50,
          currency: 'USD',
          category: 'services',
          seller_name: 'Green Thumb Co.',
          seller_avatar: '',
          seller_rating: 4.6,
          location: '3.2 miles away',
          images: [],
          created_at: '2024-01-11T00:00:00Z',
          is_favorite: false,
          is_featured: false
        }
      ];

      setItems(mockItems);
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = items;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.seller_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(item => item.category === filterBy);
    }

    // Sort featured items first
    filtered.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    setFilteredItems(filtered);
  };

  const handleToggleFavorite = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, is_favorite: !item.is_favorite }
        : item
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'services': return 'bg-blue-100 text-blue-700';
      case 'goods': return 'bg-green-100 text-green-700';
      case 'housing': return 'bg-purple-100 text-purple-700';
      case 'jobs': return 'bg-orange-100 text-orange-700';
      case 'vehicles': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatPrice = (price: number, currency: string, category: string) => {
    const symbol = currency === 'USD' ? '$' : currency;
    const formattedPrice = `${symbol}${price}`;
    
    if (category === 'services' || category === 'jobs') {
      return `${formattedPrice}/hr`;
    }
    if (category === 'housing') {
      return `${formattedPrice}/mo`;
    }
    return formattedPrice;
  };

  return (
    <div className="w-full bg-background rounded-b-[2rem] sm:rounded-b-[3rem]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center space-x-3 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Marketplace</h1>
            <p className="text-xs text-muted-foreground">
              Buy, sell, and trade with your neighbors
            </p>
          </div>
          <Button size="sm" className="px-4">
            <Plus className="w-4 h-4 mr-2" />
            Sell Item
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="px-4 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="goods">Goods</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="jobs">Jobs</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="ml-auto">
              {filteredItems.length} items
            </Badge>
          </div>
        </div>
      </div>

      <div className="pb-20">
        {/* Content */}
        <div className="p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or be the first to list something!
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                List Item
              </Button>
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Item Image Placeholder */}
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-8 h-8 text-primary/50" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-foreground text-base">
                              {item.title}
                            </h3>
                            {item.is_featured && (
                              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                                Featured
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center space-x-1 text-lg font-bold text-primary">
                              <DollarSign className="w-4 h-4" />
                              <span>{formatPrice(item.price, item.currency, item.category)}</span>
                            </div>
                            <Badge variant="secondary" className={`text-xs ${getCategoryColor(item.category)}`}>
                              {item.category}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Avatar className="w-4 h-4">
                                  <AvatarImage src={item.seller_avatar} />
                                  <AvatarFallback className="bg-primary/10 text-primary text-[8px]">
                                    {item.seller_name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{item.seller_name}</span>
                              </div>
                              {item.seller_rating && (
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{item.seller_rating}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{item.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(item.id)}
                            className="p-2"
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                item.is_favorite 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'text-muted-foreground'
                              }`} 
                            />
                          </Button>
                          <Button size="sm" className="px-4">
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};