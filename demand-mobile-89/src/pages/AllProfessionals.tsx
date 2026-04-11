import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Star, MapPin, CheckCircle, Clock, DollarSign, ArrowLeft, Search, Filter, Phone, Mail, Calendar, Award, ChevronDown, Eye, MessageSquare, Heart } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  type: 'handyman' | 'contractor';
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  image: string;
  verified: boolean;
  completedTasks: number;
  responseTime: string;
  isPromoted: boolean;
  businessName?: string;
  specialties: string[];
  availability: string;
  phone: string;
  email: string;
  yearsExperience: number;
  description: string;
  certifications: string[];
  gallery: string[];
}

const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'John Williams',
    type: 'handyman',
    businessName: 'Williams Home Services',
    rating: 4.9,
    reviews: 156,
    location: 'Downtown',
    distance: '1.2 miles',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    verified: true,
    completedTasks: 324,
    responseTime: '15 min avg',
    isPromoted: true,
    specialties: ['Plumbing', 'Electrical', 'Carpentry', 'Painting'],
    availability: 'Available today',
    phone: '(555) 123-4567',
    email: 'john@williamshome.com',
    yearsExperience: 8,
    description: 'Professional handyman with 8+ years of experience in residential repairs and maintenance. Licensed and insured.',
    certifications: ['Licensed Electrician', 'Plumbing Certified', 'EPA Lead-Safe'],
    gallery: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=200&fit=crop'
    ]
  },
  {
    id: '2',
    name: 'Sarah Martinez',
    type: 'contractor',
    businessName: 'Martinez Construction LLC',
    rating: 4.8,
    reviews: 89,
    location: 'Midtown',
    distance: '2.3 miles',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    verified: true,
    completedTasks: 67,
    responseTime: '2 hours avg',
    isPromoted: false,
    specialties: ['Kitchen Remodeling', 'Bathroom Renovation', 'Flooring', 'Roofing'],
    availability: 'Available this week',
    phone: '(555) 987-6543',
    email: 'sarah@martinezconstruction.com',
    yearsExperience: 12,
    description: 'Full-service general contractor specializing in residential renovations. Family-owned business with 12 years of excellence.',
    certifications: ['General Contractor License', 'OSHA 30', 'Green Building Certified'],
    gallery: [
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1571962478258-2650d43b0cdb?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=200&fit=crop'
    ]
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    type: 'handyman',
    businessName: 'Rodriguez Repairs',
    rating: 4.7,
    reviews: 203,
    location: 'Uptown',
    distance: '3.1 miles',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    verified: true,
    completedTasks: 412,
    responseTime: '30 min avg',
    isPromoted: false,
    specialties: ['HVAC', 'Appliance Repair', 'Drywall', 'Tile Work'],
    availability: 'Available tomorrow',
    phone: '(555) 456-7890',
    email: 'mike@rodriguezrepairs.com',
    yearsExperience: 6,
    description: 'Reliable handyman services for all your home repair needs. Quick response times and quality workmanship guaranteed.',
    certifications: ['HVAC Certified', 'Appliance Repair License'],
    gallery: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1574097656146-0b43b7660cb6?w=300&h=200&fit=crop'
    ]
  }
];

const AllProfessionals = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'handyman' | 'contractor'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'experience'>('rating');
  const [activeTab, setActiveTab] = useState('all');

  const handleViewProfile = (professionalId: string) => {
    navigate(`/profile/${professionalId}`);
  };

  const filteredProfessionals = mockProfessionals
    .filter(prof => {
      const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prof.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || prof.type === filterType;
      const matchesTab = activeTab === 'all' || prof.type === activeTab;
      return matchesSearch && matchesType && matchesTab;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'experience':
          return b.yearsExperience - a.yearsExperience;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Professionals</h1>
                <p className="text-gray-600">Find trusted handymen and contractors in your area</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="handyman">Handymen</SelectItem>
                <SelectItem value="contractor">Contractors</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="distance">Nearest</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              <span>{filteredProfessionals.length} professionals found</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Professionals</TabsTrigger>
            <TabsTrigger value="handyman">Handymen</TabsTrigger>
            <TabsTrigger value="contractor">Contractors</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                {/* Professional Header */}
                <div className="flex items-start space-x-4">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={professional.image} 
                      alt={professional.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {professional.verified && (
                      <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-green-600 bg-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{professional.name}</h3>
                          {professional.isPromoted && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">Promoted</Badge>
                          )}
                        </div>
                        
                        {professional.businessName && (
                          <p className="text-green-600 font-medium mb-2 text-sm">{professional.businessName}</p>
                        )}
                        
                        <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{professional.rating}</span>
                            <span>({professional.reviews})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{professional.distance}</span>
                          </div>
                        </div>

                        <Badge 
                          variant="outline" 
                          className={professional.type === 'contractor' ? 'text-blue-600 border-blue-300' : 'text-green-600 border-green-300'}
                        >
                          {professional.type === 'contractor' ? 'Contractor' : 'Handyman'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="mt-4 space-y-3">
                  <p className="text-gray-600 text-sm line-clamp-2">{professional.description}</p>
                  
                  {/* Top Specialties */}
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {professional.specialties.slice(0, 2).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {professional.specialties.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{professional.specialties.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-500">
                      {professional.availability}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700" size="sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        Book
                      </Button>
                    </div>
                    
                    {/* Updated Dropdown Menu with View Profile action */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80 p-4" align="end">
                        <div className="space-y-4">
                          {/* Professional Info Header */}
                          <div className="flex items-center space-x-3">
                            <img 
                              src={professional.image} 
                              alt={professional.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-semibold">{professional.name}</h4>
                              <p className="text-sm text-green-600">{professional.businessName}</p>
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-3 py-3 border-y">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{professional.completedTasks}</div>
                              <div className="text-xs text-gray-500">Jobs Done</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{professional.yearsExperience}</div>
                              <div className="text-xs text-gray-500">Years Exp</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{professional.responseTime}</div>
                              <div className="text-xs text-gray-500">Response</div>
                            </div>
                          </div>

                          {/* All Specialties */}
                          <div>
                            <h5 className="font-medium text-sm mb-2">All Specialties</h5>
                            <div className="flex flex-wrap gap-1">
                              {professional.specialties.map((specialty, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Certifications */}
                          {professional.certifications.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm mb-2 flex items-center">
                                <Award className="w-4 h-4 mr-1" />
                                Certifications
                              </h5>
                              <div className="space-y-1">
                                {professional.certifications.map((cert, index) => (
                                  <div key={index} className="text-sm text-gray-600 flex items-center">
                                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                    {cert}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Contact Info */}
                          <div>
                            <h5 className="font-medium text-sm mb-2">Contact Information</h5>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{professional.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>{professional.email}</span>
                              </div>
                            </div>
                          </div>

                          {/* Gallery Preview */}
                          {professional.gallery.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm mb-2">Recent Work</h5>
                              <div className="grid grid-cols-3 gap-1">
                                {professional.gallery.slice(0, 3).map((image, index) => (
                                  <img 
                                    key={index}
                                    src={image} 
                                    alt={`Work by ${professional.name}`}
                                    className="w-full h-16 object-cover rounded"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <DropdownMenuSeparator className="my-3" />
                        
                        {/* Action Items */}
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => handleViewProfile(professional.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Heart className="w-4 h-4 mr-2" />
                          Save to Favorites
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No professionals found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProfessionals;
