
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Search, CheckCircle, Clock, X, Star, Shield } from 'lucide-react';

export const TechnicianRecruiting = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');

  const candidates = [
    {
      id: '1',
      name: 'Alex Thompson',
      email: 'alex.thompson@email.com',
      phone: '(555) 123-4567',
      zone: 'Northern CA',
      skills: ['Plumbing', 'Electrical', 'HVAC'],
      experience: '8 years',
      rating: 4.8,
      status: 'Screening',
      backgroundCheck: 'Pending',
      references: 3,
      certifications: ['Licensed Contractor', 'EPA Certified'],
      availability: 'Full-time'
    },
    {
      id: '2',
      name: 'Sarah Martinez',
      email: 'sarah.martinez@email.com',
      phone: '(555) 234-5678',
      zone: 'Southern TX',
      skills: ['Cleaning', 'Organization', 'Move-out Services'],
      experience: '5 years',
      rating: 4.9,
      status: 'Interview',
      backgroundCheck: 'Approved',
      references: 4,
      certifications: ['Bonded', 'Insured'],
      availability: 'Part-time'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '(555) 345-6789',
      zone: 'Metro Atlanta',
      skills: ['Handyman', 'Carpentry', 'Painting'],
      experience: '12 years',
      rating: 4.7,
      status: 'Approved',
      backgroundCheck: 'Approved',
      references: 5,
      certifications: ['General Contractor', 'Safety Certified'],
      availability: 'Full-time'
    }
  ];

  const screeningSteps = [
    { step: 'Application Review', status: 'completed', description: 'Initial application screening' },
    { step: 'Skill Assessment', status: 'completed', description: 'Technical skills evaluation' },
    { step: 'Background Check', status: 'in-progress', description: 'Criminal and credit verification' },
    { step: 'Reference Check', status: 'pending', description: 'Contact previous employers' },
    { step: 'Interview', status: 'pending', description: 'Video or phone interview' },
    { step: 'Final Approval', status: 'pending', description: 'Management approval' }
  ];

  const zones = ['All Zones', 'Northern CA', 'Southern TX', 'Metro Atlanta', 'Central FL'];
  const skillCategories = ['Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Handyman', 'Moving', 'Landscaping'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Interview': return 'bg-blue-100 text-blue-800';
      case 'Screening': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepStatus = (status: string) => {
    switch (status) {
      case 'completed': return { color: 'text-green-600', icon: CheckCircle };
      case 'in-progress': return { color: 'text-blue-600', icon: Clock };
      case 'pending': return { color: 'text-gray-400', icon: Clock };
      default: return { color: 'text-gray-400', icon: Clock };
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesZone = selectedZone === 'all' || candidate.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Technician Recruiting & Screening</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Post New Opening
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search candidates by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedZone} onValueChange={setSelectedZone}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            {zones.slice(1).map(zone => (
              <SelectItem key={zone} value={zone}>{zone}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Screening Process Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Screening Process</span>
          </CardTitle>
          <CardDescription>Standardized vetting process for all technicians</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {screeningSteps.map((step, index) => {
              const { color, icon: StatusIcon } = getStepStatus(step.status);
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <StatusIcon className={`w-5 h-5 ${color}`} />
                    <h4 className="font-semibold">{step.step}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  <div className="mt-2">
                    <Progress 
                      value={step.status === 'completed' ? 100 : step.status === 'in-progress' ? 50 : 0}
                      className="h-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Candidate Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-green-600" />
            <span>Candidate Pipeline</span>
          </CardTitle>
          <CardDescription>
            {filteredCandidates.length} candidates found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="p-6 border rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{candidate.name}</h3>
                    <p className="text-gray-600">{candidate.email} • {candidate.phone}</p>
                    <p className="text-sm text-gray-500">{candidate.zone} • {candidate.availability}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(candidate.status)}>
                      {candidate.status}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{candidate.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Experience</Label>
                    <p className="font-semibold">{candidate.experience}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Background Check</Label>
                    <Badge variant={candidate.backgroundCheck === 'Approved' ? 'default' : 'secondary'}>
                      {candidate.backgroundCheck}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">References</Label>
                    <p className="font-semibold">{candidate.references} provided</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Certifications</Label>
                    <p className="font-semibold">{candidate.certifications.length}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Certifications</Label>
                  <div className="flex flex-wrap gap-2">
                    {candidate.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Last updated: 2 hours ago
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">View Profile</Button>
                    <Button variant="outline" size="sm">Schedule Interview</Button>
                    {candidate.status === 'Approved' ? (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Hire
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recruiting Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Active Applications</span>
            </div>
            <p className="text-2xl font-bold">24</p>
            <p className="text-sm text-gray-600">+6 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Hired This Month</span>
            </div>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-gray-600">67% approval rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium">Avg. Time to Hire</span>
            </div>
            <p className="text-2xl font-bold">12 days</p>
            <p className="text-sm text-gray-600">-2 days vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium">Avg. Candidate Rating</span>
            </div>
            <p className="text-2xl font-bold">4.7</p>
            <p className="text-sm text-gray-600">Quality score</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
