
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Hammer, Home, Paintbrush, TreePine, Car,
  Wrench, Zap, Droplets, ShieldCheck, Bath,
  ChevronDown, ChevronRight, Calculator, FileText, UtensilsCrossed, Users,
  Clock, Check, Star
} from 'lucide-react';
import { ContractorSelectionModal } from '@/components/contractor/ContractorSelectionModal';
import { CustomQuoteRequestModal } from '@/components/quotes/CustomQuoteRequestModal';

interface ProjectScope {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
  timeline: string;
  description: string;
  includes: string[];
}

interface ContractorCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  projects: ProjectScope[];
  propertyTypes: string[];
  sizeOptions: string[];
  budgetRanges: { min: number; max: number; label: string }[];
}

const contractorCategories: ContractorCategory[] = [
  {
    id: 'kitchen-remodel',
    name: 'Kitchen Remodeling',
    icon: UtensilsCrossed,
    color: 'bg-orange-100 text-orange-600',
    projects: [
      {
        id: 'full-kitchen',
        name: 'Complete Kitchen Renovation',
        basePrice: 25000,
        unit: 'per project',
        timeline: '4-8 weeks',
        description: 'Full kitchen transformation including layout changes',
        includes: ['Design consultation', 'Demolition', 'Electrical & plumbing updates', 'Cabinets & countertops', 'Appliance installation', 'Flooring', 'Painting']
      },
      {
        id: 'cabinet-refresh',
        name: 'Cabinet Refacing & Countertops',
        basePrice: 12000,
        unit: 'per project',
        timeline: '2-3 weeks',
        description: 'Update cabinets and countertops without major construction',
        includes: ['Cabinet door replacement', 'New hardware', 'Countertop installation', 'Backsplash', 'Minor plumbing updates']
      },
      {
        id: 'kitchen-island',
        name: 'Kitchen Island Addition',
        basePrice: 8000,
        unit: 'per island',
        timeline: '1-2 weeks',
        description: 'Custom kitchen island with storage and seating',
        includes: ['Custom design', 'Electrical work', 'Plumbing (if needed)', 'Countertop', 'Storage solutions']
      }
    ],
    propertyTypes: ['Single Family Home', 'Townhouse', 'Condo', 'Apartment'],
    sizeOptions: ['Small (< 100 sq ft)', 'Medium (100-200 sq ft)', 'Large (200-300 sq ft)', 'Extra Large (300+ sq ft)'],
    budgetRanges: [
      { min: 10000, max: 25000, label: '$10K - $25K' },
      { min: 25000, max: 50000, label: '$25K - $50K' },
      { min: 50000, max: 100000, label: '$50K - $100K' },
      { min: 100000, max: 999999, label: '$100K+' }
    ]
  },
  {
    id: 'bathroom-remodel',
    name: 'Bathroom Renovation',
    icon: Bath,
    color: 'bg-blue-100 text-blue-600',
    projects: [
      {
        id: 'full-bathroom',
        name: 'Complete Bathroom Renovation',
        basePrice: 18000,
        unit: 'per bathroom',
        timeline: '3-5 weeks',
        description: 'Full bathroom transformation with modern fixtures',
        includes: ['Design & permits', 'Demolition', 'Plumbing & electrical', 'Tile work', 'Fixtures installation', 'Vanity & mirror', 'Lighting']
      },
      {
        id: 'shower-remodel',
        name: 'Shower/Tub Renovation',
        basePrice: 8000,
        unit: 'per shower',
        timeline: '1-2 weeks',
        description: 'Update shower or tub area with new tile and fixtures',
        includes: ['Tile removal & installation', 'Waterproofing', 'New fixtures', 'Glass doors/curtain', 'Plumbing updates']
      },
      {
        id: 'powder-room',
        name: 'Powder Room Makeover',
        basePrice: 6000,
        unit: 'per room',
        timeline: '1 week',
        description: 'Complete half-bath renovation',
        includes: ['New vanity', 'Toilet replacement', 'Lighting', 'Flooring', 'Paint & fixtures']
      }
    ],
    propertyTypes: ['Single Family Home', 'Townhouse', 'Condo', 'Apartment'],
    sizeOptions: ['Half Bath', 'Full Bath', 'Master Bath', 'Multiple Bathrooms'],
    budgetRanges: [
      { min: 5000, max: 15000, label: '$5K - $15K' },
      { min: 15000, max: 30000, label: '$15K - $30K' },
      { min: 30000, max: 60000, label: '$30K - $60K' },
      { min: 60000, max: 999999, label: '$60K+' }
    ]
  },
  {
    id: 'flooring',
    name: 'Flooring Installation',
    icon: Home,
    color: 'bg-green-100 text-green-600',
    projects: [
      {
        id: 'hardwood-install',
        name: 'Hardwood Flooring Installation',
        basePrice: 8,
        unit: 'per sq ft',
        timeline: '3-5 days',
        description: 'Premium hardwood flooring installation',
        includes: ['Material delivery', 'Subfloor preparation', 'Installation', 'Finishing', 'Cleanup']
      },
      {
        id: 'luxury-vinyl',
        name: 'Luxury Vinyl Plank (LVP)',
        basePrice: 5,
        unit: 'per sq ft',
        timeline: '2-3 days',
        description: 'Waterproof luxury vinyl plank flooring',
        includes: ['Material supply', 'Subfloor prep', 'Installation', 'Trim work', 'Cleanup']
      },
      {
        id: 'tile-flooring',
        name: 'Tile Flooring Installation',
        basePrice: 12,
        unit: 'per sq ft',
        timeline: '4-6 days',
        description: 'Ceramic or porcelain tile flooring',
        includes: ['Tile & materials', 'Subfloor preparation', 'Installation', 'Grouting', 'Sealing']
      }
    ],
    propertyTypes: ['Single Family Home', 'Townhouse', 'Condo', 'Apartment', 'Business Space'],
    sizeOptions: ['Single Room', 'Multiple Rooms', 'Whole Floor', 'Entire Home'],
    budgetRanges: [
      { min: 2000, max: 8000, label: '$2K - $8K' },
      { min: 8000, max: 20000, label: '$8K - $20K' },
      { min: 20000, max: 40000, label: '$20K - $40K' },
      { min: 40000, max: 999999, label: '$40K+' }
    ]
  },
  {
    id: 'roofing',
    name: 'Roofing & Exterior',
    icon: Home,
    color: 'bg-red-100 text-red-600',
    projects: [
      {
        id: 'roof-replacement',
        name: 'Complete Roof Replacement',
        basePrice: 15000,
        unit: 'per project',
        timeline: '3-7 days',
        description: 'Full roof replacement with new materials',
        includes: ['Permit acquisition', 'Old roof removal', 'Deck inspection/repair', 'New shingles/materials', 'Gutters & cleanup']
      },
      {
        id: 'roof-repair',
        name: 'Roof Repair & Maintenance',
        basePrice: 800,
        unit: 'per repair',
        timeline: '1-2 days',
        description: 'Targeted roof repairs and maintenance',
        includes: ['Leak detection', 'Shingle replacement', 'Flashing repair', 'Gutter cleaning', 'Inspection report']
      },
      {
        id: 'siding-install',
        name: 'Siding Installation',
        basePrice: 12,
        unit: 'per sq ft',
        timeline: '1-2 weeks',
        description: 'New siding installation for home exterior',
        includes: ['Material supply', 'House wrap', 'Siding installation', 'Trim work', 'Caulking & finishing']
      }
    ],
    propertyTypes: ['Single Family Home', 'Townhouse', 'Business Space'],
    sizeOptions: ['Small Home (< 1500 sq ft)', 'Medium Home (1500-2500 sq ft)', 'Large Home (2500-4000 sq ft)', 'Extra Large (4000+ sq ft)'],
    budgetRanges: [
      { min: 5000, max: 15000, label: '$5K - $15K' },
      { min: 15000, max: 35000, label: '$15K - $35K' },
      { min: 35000, max: 70000, label: '$35K - $70K' },
      { min: 70000, max: 999999, label: '$70K+' }
    ]
  },
  {
    id: 'additions',
    name: 'Home Additions',
    icon: Hammer,
    color: 'bg-purple-100 text-purple-600',
    projects: [
      {
        id: 'room-addition',
        name: 'Room Addition',
        basePrice: 40000,
        unit: 'per room',
        timeline: '8-12 weeks',
        description: 'Add a new room to your existing home',
        includes: ['Architectural plans', 'Permits', 'Foundation work', 'Framing', 'Electrical & plumbing', 'Insulation & drywall', 'Flooring & finishing']
      },
      {
        id: 'second-story',
        name: 'Second Story Addition',
        basePrice: 80000,
        unit: 'per project',
        timeline: '12-16 weeks',
        description: 'Add a complete second floor to your home',
        includes: ['Structural engineering', 'Permits', 'Roof removal', 'New framing', 'Complete build-out', 'Stairs installation']
      },
      {
        id: 'garage-conversion',
        name: 'Garage Conversion',
        basePrice: 20000,
        unit: 'per conversion',
        timeline: '4-6 weeks',
        description: 'Convert garage into livable space',
        includes: ['Insulation installation', 'Electrical upgrade', 'Plumbing (if needed)', 'Flooring', 'Drywall & painting', 'Windows & doors']
      }
    ],
    propertyTypes: ['Single Family Home', 'Townhouse'],
    sizeOptions: ['Small Addition (< 200 sq ft)', 'Medium Addition (200-500 sq ft)', 'Large Addition (500-1000 sq ft)', 'Major Addition (1000+ sq ft)'],
    budgetRanges: [
      { min: 20000, max: 50000, label: '$20K - $50K' },
      { min: 50000, max: 100000, label: '$50K - $100K' },
      { min: 100000, max: 200000, label: '$100K - $200K' },
      { min: 200000, max: 999999, label: '$200K+' }
    ]
  },
  {
    id: 'basement',
    name: 'Basement Finishing',
    icon: Hammer,
    color: 'bg-gray-100 text-gray-600',
    projects: [
      {
        id: 'basement-finish',
        name: 'Complete Basement Finishing',
        basePrice: 25000,
        unit: 'per basement',
        timeline: '6-10 weeks',
        description: 'Transform unfinished basement into livable space',
        includes: ['Moisture control', 'Insulation & framing', 'Electrical & plumbing', 'Drywall & painting', 'Flooring installation', 'Ceiling & lighting']
      },
      {
        id: 'basement-bathroom',
        name: 'Basement Bathroom Addition',
        basePrice: 15000,
        unit: 'per bathroom',
        timeline: '3-4 weeks',
        description: 'Add a full bathroom to basement',
        includes: ['Rough plumbing', 'Electrical work', 'Tile installation', 'Fixtures & vanity', 'Ventilation system']
      },
      {
        id: 'basement-bar',
        name: 'Basement Bar/Entertainment Area',
        basePrice: 12000,
        unit: 'per area',
        timeline: '3-5 weeks',
        description: 'Custom bar and entertainment space',
        includes: ['Custom bar construction', 'Electrical for appliances', 'Plumbing (if needed)', 'Lighting design', 'Flooring & finishes']
      }
    ],
    propertyTypes: ['Single Family Home', 'Townhouse'],
    sizeOptions: ['Partial Basement', 'Full Basement', 'Walkout Basement'],
    budgetRanges: [
      { min: 15000, max: 35000, label: '$15K - $35K' },
      { min: 35000, max: 60000, label: '$35K - $60K' },
      { min: 60000, max: 100000, label: '$60K - $100K' },
      { min: 100000, max: 999999, label: '$100K+' }
    ]
  }
];

export const ContractorServiceCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState<string>('');
  const [propertySize, setPropertySize] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [showContractorModal, setShowContractorModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const selectedCategoryData = contractorCategories.find(cat => cat.id === selectedCategory);

  const handleProjectToggle = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const calculateEstimate = () => {
    if (!selectedCategoryData) return { min: 0, max: 0 };

    const total = selectedProjects.reduce((sum, projectId) => {
      const project = selectedCategoryData.projects.find(p => p.id === projectId);
      return sum + (project?.basePrice || 0);
    }, 0);

    return { min: total * 0.8, max: total * 1.5 };
  };

  const generateServiceDescription = () => {
    if (!selectedCategoryData || selectedProjects.length === 0) return '';

    const projectNames = selectedProjects.map(projectId =>
      selectedCategoryData.projects.find(p => p.id === projectId)?.name
    ).filter(Boolean);

    let description = `${selectedCategoryData.name} - ${projectNames.join(', ')}`;

    if (propertyType) description += `\nProperty Type: ${propertyType}`;
    if (propertySize) description += `\nProject Scale: ${propertySize}`;
    if (timeline) description += `\nPreferred Timeline: ${timeline}`;
    if (projectDescription) description += `\nAdditional Details: ${projectDescription}`;

    return description;
  };

  const getQuoteData = () => ({
    service_name: selectedCategoryData?.name || '',
    service_description: generateServiceDescription(),
    location: '',
    budget_range: budgetRange,
    urgency: timeline.includes('asap') ? 'emergency' : 'flexible'
  });

  return (
    <div className="space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Contractor & Renovation Services</h2>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
          Transform your space with certified experts. Get custom quotes tailored to your specific project scope and requirements.
        </p>
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-black/5 rounded-full shadow-sm text-[10px] font-black uppercase tracking-widest text-[#166534]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#166534] animate-pulse"></span>
            Verified Professionals
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {contractorCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(isSelected ? null : category.id)}
              className={`
                group relative p-6 rounded-[2rem] transition-all duration-300 border-2
                ${isSelected
                  ? 'bg-[#166534] text-white border-[#166534] shadow-xl shadow-[#166534]/20 scale-[1.05] z-10'
                  : 'bg-white hover:bg-slate-50 border-black/5 hover:border-[#166534]/30'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${isSelected ? 'bg-white/20' : 'bg-slate-50'}`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-[#166534]'}`} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest text-center leading-tight ${isSelected ? 'text-white' : 'text-slate-600 group-hover:text-[#166534]'}`}>
                  {category.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Category Details */}
      {selectedCategoryData && (
        <div className="bg-slate-50/50 rounded-[3rem] border border-black/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 sm:p-10">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10">
              {/* Project Options */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Project Types</h3>
                  <Badge className="bg-orange-50 text-orange-600 rounded-full font-black uppercase text-[10px] tracking-widest px-3 border border-orange-100">Custom Quote</Badge>
                </div>

                <div className="space-y-3">
                  {selectedCategoryData.projects.map((project) => (
                    <div
                      key={project.id}
                      className={`group relative border rounded-[2rem] p-6 transition-all duration-300 cursor-pointer ${selectedProjects.includes(project.id)
                        ? 'bg-white border-[#166534] shadow-md ring-4 ring-[#166534]/5'
                        : 'bg-white/50 border-black/5 hover:border-[#166534]/20'
                        }`}
                      onClick={() => handleProjectToggle(project.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          <Checkbox
                            checked={selectedProjects.includes(project.id)}
                            onCheckedChange={() => { }} // Controlled by card click
                            className="w-5 h-5 border-2 rounded-lg border-black/10 data-[state=checked]:bg-[#166534] data-[state=checked]:border-[#166534] transition-all"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#166534] transition-colors">{project.name}</h4>
                            <div className="text-right">
                              <p className="text-xs font-black text-[#166534]">
                                FR. ${project.basePrice.toLocaleString()}
                              </p>
                              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{project.unit}</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{project.description}</p>
                          <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {project.timeline}</span>
                          </div>
                          <div className="pt-2">
                            <p className="text-[10px] text-slate-400 font-medium">
                              <span className="font-bold text-slate-600">INCLUDES:</span> {project.includes.join(' • ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Configuration */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Requirements</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Property Type</label>
                      <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger className="h-12 rounded-[1.25rem] border-black/5 bg-white shadow-sm focus:ring-[#166534]/5 focus:border-[#166534] transition-all">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-black/5 shadow-xl">
                          {selectedCategoryData.propertyTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Project Scale</label>
                      <Select value={propertySize} onValueChange={setPropertySize}>
                        <SelectTrigger className="h-12 rounded-[1.25rem] border-black/5 bg-white shadow-sm focus:ring-[#166534]/5 focus:border-[#166534] transition-all">
                          <SelectValue placeholder="Select scale" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-black/5 shadow-xl">
                          {selectedCategoryData.sizeOptions.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Budget Range</label>
                      <Select value={budgetRange} onValueChange={setBudgetRange}>
                        <SelectTrigger className="h-12 rounded-[1.25rem] border-black/5 bg-white shadow-sm focus:ring-[#166534]/5 focus:border-[#166534] transition-all">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-black/5 shadow-xl">
                          {selectedCategoryData.budgetRanges.map((range) => (
                            <SelectItem key={range.label} value={range.label}>{range.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Timeline</label>
                      <Select value={timeline} onValueChange={setTimeline}>
                        <SelectTrigger className="h-12 rounded-[1.25rem] border-black/5 bg-white shadow-sm focus:ring-[#166534]/5 focus:border-[#166534] transition-all">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-black/5 shadow-xl">
                          <SelectItem value="asap">ASAP (Rush job)</SelectItem>
                          <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                          <SelectItem value="1-2-months">1-2 months</SelectItem>
                          <SelectItem value="flexible">Flexible timing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Additional Details</label>
                    <Textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Special materials, specific requirements, etc..."
                      className="min-h-[120px] rounded-[1.5rem] border-black/5 bg-white shadow-sm focus:ring-[#166534]/5 focus:border-[#166534] resize-none p-4 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Rough Estimate Box */}
                {selectedProjects.length > 0 && (
                  <div className="bg-white rounded-[2rem] border border-[#166534]/10 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#166534]">
                        <Calculator className="w-4 h-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Project Estimate</h4>
                      </div>
                      <Badge className="bg-[#166534]/5 text-[#166534] rounded-full border-none font-black text-[10px] px-3">Preliminary</Badge>
                    </div>

                    <div className="space-y-3 py-2 border-y border-black/5">
                      {selectedProjects.map(projectId => {
                        const project = selectedCategoryData.projects.find(p => p.id === projectId);
                        return project ? (
                          <div key={projectId} className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">{project.name}</span>
                            <span className="text-slate-900 font-bold">${project.basePrice.toLocaleString()}</span>
                          </div>
                        ) : null;
                      })}
                    </div>

                    <div className="flex justify-between items-baseline pt-2">
                      <span className="text-xs font-bold text-slate-900">Estimated Range</span>
                      <span className="text-2xl font-black text-[#166534]">
                        ${Math.round(calculateEstimate().min).toLocaleString()} - ${Math.round(calculateEstimate().max).toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                      <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                        <span className="font-bold">NOTE:</span> Final pricing determined after site inspection and material selection.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedProjects.length > 0 && (
              <div className="mt-10 pt-8 border-t border-black/5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => setShowQuoteModal(true)}
                    className="flex-1 h-14 bg-[#166534] hover:bg-[#166534]/90 text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#166534]/20 transition-all active:scale-95"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Post to All Contractors
                  </Button>
                  <Button
                    onClick={() => setShowContractorModal(true)}
                    variant="ghost"
                    className="flex-1 h-14 border border-black/10 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white text-slate-600 transition-all active:scale-95"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Select Specific Pros
                  </Button>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-8">
                  {[
                    { label: 'Free Consultation', icon: Check },
                    { label: 'Licensed Pros', icon: ShieldCheck },
                    { label: 'Project Guarantees', icon: Star }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 text-center text-[10px] font-black uppercase tracking-tighter text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-black/5">
                        <item.icon className="w-3.5 h-3.5 text-[#166534]" />
                      </div>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quote Request Modal */}
      <CustomQuoteRequestModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        initialServiceName={selectedCategoryData?.name + ' - ' + selectedProjects.map(id =>
          selectedCategoryData?.projects.find(p => p.id === id)?.name
        ).join(', ')}
      />

      {/* Contractor Selection Modal */}
      <ContractorSelectionModal
        isOpen={showContractorModal}
        onClose={() => setShowContractorModal(false)}
        quoteData={getQuoteData()}
      />
    </div>
  );
};
