import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useContractorQuotes } from '@/hooks/useContractorQuotes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send, Building, User, Lightbulb } from 'lucide-react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { toast } from 'sonner';

interface Professional {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  business_name?: string;
  company_name?: string;
  user_role: string;
  business_profiles?: {
    business_name: string;
    contact_email: string;
    services_offered?: string[];
  }[];
}

// Common service suggestions
const SERVICE_SUGGESTIONS = [
  'Plumbing Repair',
  'Electrical Work',
  'Kitchen Remodel',
  'Bathroom Renovation',
  'Painting',
  'Flooring Installation',
  'Roofing',
  'HVAC Installation/Repair',
  'Carpentry',
  'Drywall Installation',
  'Tile Installation',
  'Landscaping',
  'Deck/Patio Construction',
  'Window Installation',
  'Door Installation',
  'Fence Installation',
  'Concrete Work',
  'Insulation',
  'Gutter Installation',
  'Home Security System'
];

export const QuoteRequestPage = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createQuoteRequest } = useContractorQuotes();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    serviceRequired: '',
    projectDescription: '',
    location: '',
    estimatedBudget: '',
    preferredDate: '',
    urgency: 'flexible'
  });

  useEffect(() => {
    const fetchProfessional = async () => {
      if (!professionalId) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            business_profiles (*)
          `)
          .eq('id', professionalId)
          .single();

        if (error) {
          console.error('Error fetching professional:', error);
          toast.error('Failed to load professional information');
          return;
        }

        setProfessional(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred while loading professional information');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [professionalId]);

  // Get filtered service suggestions
  const getFilteredSuggestions = () => {
    if (!formData.serviceRequired) return SERVICE_SUGGESTIONS.slice(0, 6);
    return SERVICE_SUGGESTIONS.filter(service => 
      service.toLowerCase().includes(formData.serviceRequired.toLowerCase())
    ).slice(0, 6);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!professional || !user?.id) {
      toast.error('You must be logged in to request a quote');
      return;
    }

    if (!formData.serviceRequired || !formData.projectDescription || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      // Use contractor quote system - this creates a quote request from customer to contractor
      await createQuoteRequest({
        customer_id: user.id,
        contractor_id: professional.id,
        service_name: formData.serviceRequired,
        service_description: formData.projectDescription,
        location: formData.location,
        preferred_date: formData.preferredDate || undefined,
        budget_range: formData.estimatedBudget || undefined,
        urgency: formData.urgency,
        quote_type: 'customer_request'
      });

      toast.success('Quote request sent successfully! The contractor will respond soon.');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while submitting your request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Professional Not Found</h2>
          <p className="text-gray-600 mb-4">The professional you're trying to request a quote from doesn't exist.</p>
          <Button onClick={() => navigate('/professionals')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Professionals
          </Button>
        </Card>
      </div>
    );
  }

  const displayName = professional.business_profiles?.[0]?.business_name || 
                     professional.business_name || 
                     professional.company_name || 
                     professional.full_name;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/professionals')} 
            variant="outline" 
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Professionals
          </Button>
        </div>

        {/* Professional Info Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <img
                src={professional.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.id}`}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  {professional.user_role === 'contractor' ? (
                    <Building className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="capitalize">{professional.user_role}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>Request a Quote</CardTitle>
            <p className="text-gray-600">Fill out the details below to get a personalized quote from {displayName}.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Location */}
              <div>
                <Label htmlFor="location">Project Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State or ZIP code"
                  required
                />
              </div>

              {/* Service Required with Suggestions */}
              <div className="space-y-2">
                <Label htmlFor="serviceRequired">Service Required *</Label>
                <div className="relative">
                  <Input
                    id="serviceRequired"
                    value={formData.serviceRequired}
                    onChange={(e) => {
                      handleInputChange('serviceRequired', e.target.value);
                      setShowServiceSuggestions(true);
                    }}
                    onFocus={() => setShowServiceSuggestions(true)}
                    placeholder="Start typing or click to see suggestions..."
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                    onClick={() => setShowServiceSuggestions(!showServiceSuggestions)}
                  >
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                  </Button>
                </div>
                
                {/* Service Suggestions */}
                {showServiceSuggestions && (
                  <div className="bg-white border rounded-md shadow-sm p-3 space-y-2">
                    <div className="text-sm font-medium text-gray-700 mb-2">Popular Services:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {getFilteredSuggestions().map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => {
                            handleInputChange('serviceRequired', service);
                            setShowServiceSuggestions(false);
                          }}
                          className="text-left text-sm px-3 py-2 rounded bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                    {/* Show professional's offered services if available */}
                    {professional?.business_profiles?.[0]?.services_offered && professional.business_profiles[0].services_offered.length > 0 && (
                      <>
                        <div className="text-sm font-medium text-gray-700 mt-3 mb-2">Services offered by {displayName}:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {professional.business_profiles[0].services_offered.map((service) => (
                            <button
                              key={service}
                              type="button"
                              onClick={() => {
                                handleInputChange('serviceRequired', service);
                                setShowServiceSuggestions(false);
                              }}
                              className="text-left text-sm px-3 py-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                            >
                              {service}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="projectDescription">Project Description *</Label>
                <Textarea
                  id="projectDescription"
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  placeholder="Please describe your project in detail, including materials needed, timeline, and any specific requirements..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedBudget">Estimated Budget</Label>
                  <Select onValueChange={(value) => handleInputChange('estimatedBudget', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Under $1,000">Under $1,000</SelectItem>
                      <SelectItem value="$1,000 - $5,000">$1,000 - $5,000</SelectItem>
                      <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="$10,000 - $25,000">$10,000 - $25,000</SelectItem>
                      <SelectItem value="$25,000 - $50,000">$25,000 - $50,000</SelectItem>
                      <SelectItem value="Over $50,000">Over $50,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preferredDate">Preferred Start Date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="urgency">Project Urgency</Label>
                <Select 
                  value={formData.urgency} 
                  onValueChange={(value) => handleInputChange('urgency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">Flexible - No rush</SelectItem>
                    <SelectItem value="same_day">Same Day - ASAP</SelectItem>
                    <SelectItem value="emergency">Emergency - Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-blue-700 text-sm">
                  <Send className="w-4 h-4" />
                  <span className="font-medium">Ready to send your quote request?</span>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  {displayName} will receive your request and respond with a detailed quote.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                size="lg"
                disabled={submitting || !user}
              >
                {submitting ? (
                  'Sending Request...'
                ) : !user ? (
                  'Please log in to send request'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Quote Request to {displayName}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};