
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye, Mail, Phone, Globe, MapPin, Star, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdSubmission {
  id: string;
  businessName: string;
  contactEmail: string;
  phone: string;
  website: string;
  serviceCategory: string;
  adTitle: string;
  adDescription: string;
  targetLocation: string;
  planId: string;
  planName: string;
  planPrice: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewNotes?: string;
  adImage?: string;
}

const mockSubmissions: AdSubmission[] = [
  {
    id: '1',
    businessName: 'Pro Plumbing Solutions',
    contactEmail: 'contact@proplumbing.com',
    phone: '(555) 123-4567',
    website: 'https://proplumbing.com',
    serviceCategory: 'Plumbing',
    adTitle: 'Professional Plumbing Services - 24/7 Emergency Repairs',
    adDescription: 'Licensed plumbers with 15+ years experience. Emergency services available 24/7. Free estimates, quality workmanship guaranteed.',
    targetLocation: 'San Francisco, CA',
    planId: 'professional',
    planName: 'Professional',
    planPrice: 75,
    status: 'pending',
    submittedAt: new Date('2024-01-15T10:30:00Z'),
    adImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop'
  },
  {
    id: '2',
    businessName: 'Elite Landscaping',
    contactEmail: 'info@elitelandscaping.com',
    phone: '(555) 987-6543',
    website: 'https://elitelandscaping.com',
    serviceCategory: 'Landscaping',
    adTitle: 'Transform Your Outdoor Space - Professional Landscaping',
    adDescription: 'Complete landscaping services including design, installation, and maintenance. Creating beautiful outdoor spaces for over 10 years.',
    targetLocation: 'Austin, TX',
    planId: 'premium',
    planName: 'Premium Boost',
    planPrice: 150,
    status: 'approved',
    submittedAt: new Date('2024-01-14T14:20:00Z'),
    reviewedAt: new Date('2024-01-15T09:15:00Z'),
    reviewNotes: 'Excellent content and professional presentation. Approved.',
    adImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop'
  },
  {
    id: '3',
    businessName: 'QuickFix Electrical',
    contactEmail: 'service@quickfixelectric.com',
    phone: '(555) 456-7890',
    website: '',
    serviceCategory: 'Electrical',
    adTitle: 'Same Day Electrical Repairs - Licensed & Insured',
    adDescription: 'Fast, reliable electrical services. Same-day appointments available.',
    targetLocation: 'Miami, FL',
    planId: 'basic',
    planName: 'Basic Visibility',
    planPrice: 25,
    status: 'rejected',
    submittedAt: new Date('2024-01-13T16:45:00Z'),
    reviewedAt: new Date('2024-01-14T11:30:00Z'),
    reviewNotes: 'Description too brief. Please provide more details about services and qualifications.'
  }
];

const AdminAdvertising = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<AdSubmission[]>(mockSubmissions);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<AdSubmission | null>(null);

  const filteredSubmissions = submissions.filter(sub => 
    filterStatus === 'all' || sub.status === filterStatus
  );

  const handleApprove = (id: string, notes?: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id 
        ? { ...sub, status: 'approved' as const, reviewedAt: new Date(), reviewNotes: notes }
        : sub
    ));
    
    toast({
      title: "Ad Approved",
      description: "The advertisement has been approved and will go live soon.",
    });
    
    setSelectedSubmission(null);
  };

  const handleReject = (id: string, notes: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id 
        ? { ...sub, status: 'rejected' as const, reviewedAt: new Date(), reviewNotes: notes }
        : sub
    ));
    
    toast({
      title: "Ad Rejected",
      description: "The advertisement has been rejected. The business will be notified.",
      variant: "destructive"
    });
    
    setSelectedSubmission(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    revenue: submissions.filter(s => s.status === 'approved').reduce((sum, s) => sum + s.planPrice, 0)
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Advertising Admin</h1>
                <p className="text-gray-600">Review and manage business advertisement submissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Submissions</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-xl font-bold">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-xl font-bold">${stats.revenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Filter by status:</label>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Submissions</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredSubmissions.length} of {submissions.length} submissions
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{submission.businessName}</h3>
                      {getStatusBadge(submission.status)}
                      <Badge variant="outline">{submission.serviceCategory}</Badge>
                    </div>
                    
                    <h4 className="text-md font-medium text-blue-600 mb-2">{submission.adTitle}</h4>
                    <p className="text-gray-600 mb-3 line-clamp-2">{submission.adDescription}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{submission.contactEmail}</span>
                      </div>
                      {submission.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{submission.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{submission.targetLocation}</span>
                      </div>
                    </div>
                  </div>
                  
                  {submission.adImage && (
                    <div className="ml-4 flex-shrink-0">
                      <img 
                        src={submission.adImage} 
                        alt="Ad preview"
                        className="w-24 h-16 object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Plan: </span>
                      <span className="font-medium">{submission.planName} (${submission.planPrice})</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Submitted: </span>
                      <span>{submission.submittedAt.toLocaleDateString()}</span>
                    </div>
                    {submission.reviewedAt && (
                      <div className="text-sm">
                        <span className="text-gray-600">Reviewed: </span>
                        <span>{submission.reviewedAt.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                    
                    {submission.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(submission.id, 'Approved - meets all requirements')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleReject(submission.id, 'Please review and resubmit with more details')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {submission.reviewNotes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Review Notes: </span>
                      {submission.reviewNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Eye className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-600">
              {filterStatus === 'all' 
                ? 'No advertisement submissions yet'
                : `No ${filterStatus} submissions found`
              }
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Review Advertisement</h2>
                <Button variant="ghost" onClick={() => setSelectedSubmission(null)}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold">{selectedSubmission.businessName}</h3>
                  {getStatusBadge(selectedSubmission.status)}
                </div>

                {selectedSubmission.adImage && (
                  <img 
                    src={selectedSubmission.adImage} 
                    alt="Ad preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}

                <div>
                  <h4 className="font-medium text-blue-600 mb-2">{selectedSubmission.adTitle}</h4>
                  <p className="text-gray-700">{selectedSubmission.adDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Contact Email:</span>
                    <p>{selectedSubmission.contactEmail}</p>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>
                    <p>{selectedSubmission.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Website:</span>
                    <p>{selectedSubmission.website || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Service Category:</span>
                    <p>{selectedSubmission.serviceCategory}</p>
                  </div>
                  <div>
                    <span className="font-medium">Target Location:</span>
                    <p>{selectedSubmission.targetLocation}</p>
                  </div>
                  <div>
                    <span className="font-medium">Selected Plan:</span>
                    <p>{selectedSubmission.planName} (${selectedSubmission.planPrice})</p>
                  </div>
                </div>

                {selectedSubmission.status === 'pending' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      onClick={() => handleApprove(selectedSubmission.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Advertisement
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleReject(selectedSubmission.id, 'Please review and resubmit')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Advertisement
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdvertising;
