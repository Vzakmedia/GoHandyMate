
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calculator, 
  FileText, 
  Calendar, 
  Users, 
  Truck, 
  Shield, 
  Camera, 
  MapPin,
  DollarSign,
  Clock,
  Wrench,
  Building,
  Package
} from "lucide-react";
import { QuoteCalculator } from "./contractor/QuoteCalculator";
import { MaterialsCalculator } from "./contractor/MaterialsCalculator";
import { TeamManagement } from "./contractor/TeamManagement";
import { ScheduleManager } from "./contractor/ScheduleManager";
import { InvoiceGenerator } from "./contractor/InvoiceGenerator";
import { SafetyCompliance } from "./contractor/SafetyCompliance";
import { PhotoDocumentation } from "./contractor/PhotoDocumentation";
import { QuoteAutomationSettings } from "./contractor/QuoteAutomationSettings";
import { BusinessSettingsForm } from "./contractor/BusinessSettingsForm";

export const ContractorTools = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tools = [
    {
      id: "quote-calculator",
      title: "Quote Calculator",
      description: "Create professional quotes with detailed cost breakdowns",
      icon: Calculator,
      category: "Estimation",
      status: "available",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      component: "QuoteCalculator"
    },
    {
      id: "materials-calculator",
      title: "Materials Calculator",
      description: "Calculate material costs and quantities for projects",
      icon: Package,
      category: "Estimation",
      status: "available",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      component: "MaterialsCalculator"
    },
    {
      id: "team-management",
      title: "Team Management",
      description: "Manage subcontractors and team members",
      icon: Users,
      category: "Management",
      status: "available",
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
      component: "TeamManagement"
    },
    {
      id: "invoice-generator",
      title: "Invoice Generator",
      description: "Create professional invoices and estimates",
      icon: FileText,
      category: "Billing",
      status: "available",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      component: "InvoiceGenerator"
    },
    {
      id: "schedule-manager",
      title: "Schedule Manager",
      description: "Manage project timelines and worker schedules",
      icon: Calendar,
      category: "Planning",
      status: "available",
      color: "bg-indigo-50 border-indigo-200",
      iconColor: "text-indigo-600",
      component: "ScheduleManager"
    },
    {
      id: "equipment-tracker",
      title: "Equipment Tracker",
      description: "Track tools, machinery, and equipment location",
      icon: Truck,
      category: "Logistics",
      status: "coming_soon",
      color: "bg-gray-50 border-gray-200",
      iconColor: "text-gray-600"
    },
    {
      id: "safety-compliance",
      title: "Safety Compliance",
      description: "Safety checklists and compliance tracking",
      icon: Shield,
      category: "Safety",
      status: "available",
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
      component: "SafetyCompliance"
    },
    {
      id: "photo-documentation",
      title: "Photo Documentation",
      description: "Before/after photos and progress tracking",
      icon: Camera,
      category: "Documentation",
      status: "available",
      color: "bg-teal-50 border-teal-200",
      iconColor: "text-teal-600",
      component: "PhotoDocumentation"
    }
  ];

  // Quick actions that match the main tools
  const quickActions = [
    {
      title: "Create Quote",
      icon: Calculator,
      action: () => setActiveTab("quote-calculator"),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Calculate Materials",
      icon: Package,
      action: () => setActiveTab("materials-calculator"),
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Manage Team",
      icon: Users,
      action: () => setActiveTab("team-management"),
      color: "bg-orange-600 hover:bg-orange-700"
    },
    {
      title: "Schedule Projects",
      icon: Calendar,
      action: () => setActiveTab("schedule-manager"),
      color: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
      title: "Generate Invoice",
      icon: FileText,
      action: () => setActiveTab("invoice-generator"),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Safety Check",
      icon: Shield,
      action: () => setActiveTab("safety-compliance"),
      color: "bg-red-600 hover:bg-red-700"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'coming_soon':
        return <Badge variant="outline" className="text-gray-600">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const handleToolClick = (tool: typeof tools[0]) => {
    if (tool.status === 'available' && tool.component) {
      setActiveTab(tool.id);
    }
  };

  const renderToolComponent = () => {
    switch (activeTab) {
      case 'quote-calculator':
        return <QuoteCalculator onBack={() => setActiveTab("overview")} />;
      case 'materials-calculator':
        return <MaterialsCalculator />;
      case 'team-management':
        return <TeamManagement onBack={() => setActiveTab("overview")} />;
      case 'schedule-manager':
        return <ScheduleManager />;
      case 'invoice-generator':
        return <InvoiceGenerator />;
      case 'safety-compliance':
        return <SafetyCompliance />;
      case 'photo-documentation':
        return <PhotoDocumentation />;
    case 'automation':
      return <QuoteAutomationSettings />;
    case 'business-settings':
      return <BusinessSettingsForm />;
      default:
        return null;
    }
  };

  // Tab options for dropdown
  const tabOptions = [
    { value: "overview", label: "Overview" },
    { value: "quote-calculator", label: "Quote Calculator" },
    { value: "materials-calculator", label: "Materials Calculator" },
    { value: "team-management", label: "Team Management" },
    { value: "schedule-manager", label: "Schedule Manager" },
    { value: "invoice-generator", label: "Invoice Generator" },
    { value: "safety-compliance", label: "Safety Compliance" },
    { value: "photo-documentation", label: "Photo Documentation" },
    { value: "automation", label: "Automation" },
    { value: "business-settings", label: "Business Settings" }
  ];

  const getCurrentTabLabel = () => {
    const currentTab = tabOptions.find(tab => tab.value === activeTab);
    return currentTab ? currentTab.label : "Select Tool";
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mobile Dropdown Layout */}
        <div className="block sm:hidden mb-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full h-12 bg-background border-2 border-muted text-left font-medium shadow-sm">
              <SelectValue>
                {getCurrentTabLabel()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="z-50 bg-background border-2 border-muted shadow-lg">
              {tabOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer py-3 px-4 hover:bg-muted focus:bg-muted"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Desktop Tab Layout - Properly fitted for all screen sizes */}
        <TabsList className="hidden sm:flex w-full overflow-x-auto bg-muted/50 p-2 rounded-xl shadow-sm mb-4 scrollbar-hide">
          <div className="flex min-w-full gap-1">
            <TabsTrigger value="overview" className="flex-1 min-w-fit text-xs lg:text-sm px-2 lg:px-3 py-2 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
            <TabsTrigger value="quote-calculator" className="flex-1 min-w-fit text-xs lg:text-sm px-2 lg:px-3 py-2 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Quote</TabsTrigger>
            <TabsTrigger value="materials-calculator" className="flex-1 min-w-fit text-xs lg:text-sm px-2 lg:px-3 py-2 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Materials</TabsTrigger>
            <TabsTrigger value="team-management" className="flex-1 min-w-fit text-xs lg:text-sm px-2 lg:px-3 py-2 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Team</TabsTrigger>
            <TabsTrigger value="schedule-manager" className="flex-1 min-w-fit text-xs lg:text-sm px-2 lg:px-3 py-2 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Schedule</TabsTrigger>
            <TabsTrigger value="invoice-generator" className="flex-1 min-w-fit text-xs lg:text-sm px-2 lg:px-3 py-2 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Invoice</TabsTrigger>
            <TabsTrigger value="safety-compliance" className="flex-1 min-w-fit text-xs lg:text-sm px-2 lg:px-3 py-2 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Safety</TabsTrigger>
            <TabsTrigger value="photo-documentation" className="flex-1 min-w-fit text-xs lg:text-sm px-2 lg:px-3 py-2 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Photos</TabsTrigger>
            <TabsTrigger value="automation" className="flex-1 min-w-fit text-xs lg:text-sm px-2 lg:px-3 py-2 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Automation</TabsTrigger>
            <TabsTrigger value="business-settings" className="flex-1 min-w-fit text-xs lg:text-sm px-2 lg:px-3 py-2 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Business</TabsTrigger>
          </div>
        </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* Quick Actions - Properly Aligned */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="w-5 h-5 mr-2 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white flex flex-col items-center justify-center min-h-[88px] space-y-2 transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation rounded-xl shadow-md hover:shadow-lg`}
                >
                  <action.icon className="w-6 h-6 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-xs text-center leading-tight font-medium">{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tools Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tools.map((tool) => (
            <Card 
              key={tool.id} 
              className={`${tool.color} hover:shadow-lg transition-all duration-200 cursor-pointer touch-manipulation border-2 rounded-xl ${
                tool.status === 'coming_soon' ? 'opacity-75' : 'hover:scale-105 active:scale-95'
              }`}
              onClick={() => handleToolClick(tool)}
            >
              <CardHeader className="pb-3 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`p-3 rounded-xl bg-white shadow-sm flex-shrink-0`}>
                      <tool.icon className={`w-6 h-6 ${tool.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg font-semibold truncate">{tool.title}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1 bg-white/80">
                        {tool.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(tool.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tool.description}</p>
                <Button 
                  variant={tool.status === 'available' ? 'default' : 'outline'}
                  className="w-full min-h-[44px] rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                  disabled={tool.status === 'coming_soon'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToolClick(tool);
                  }}
                >
                  {tool.status === 'available' ? 'Open Tool' : 'Coming Soon'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Resources & Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium mb-2">Safety Guidelines</h4>
                <p className="text-sm text-gray-600 mb-3">OSHA compliance and safety protocols</p>
                <Button variant="outline" size="sm">View Guidelines</Button>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium mb-2">Industry Standards</h4>
                <p className="text-sm text-gray-600 mb-3">Building codes and industry best practices</p>
                <Button variant="outline" size="sm">Browse Standards</Button>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium mb-2">Training Videos</h4>
                <p className="text-sm text-gray-600 mb-3">Professional development and skills training</p>
                <Button variant="outline" size="sm">Watch Videos</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="quote-calculator">
        {renderToolComponent()}
      </TabsContent>

      <TabsContent value="materials-calculator">
        {renderToolComponent()}
      </TabsContent>

      <TabsContent value="team-management">
        {renderToolComponent()}
      </TabsContent>

      <TabsContent value="schedule-manager">
        {renderToolComponent()}
      </TabsContent>

      <TabsContent value="invoice-generator">
        {renderToolComponent()}
      </TabsContent>

      <TabsContent value="safety-compliance">
        {renderToolComponent()}
      </TabsContent>

      <TabsContent value="photo-documentation">
        {renderToolComponent()}
      </TabsContent>

      <TabsContent value="automation">
        {renderToolComponent()}
      </TabsContent>

      <TabsContent value="business-settings">
        {renderToolComponent()}
      </TabsContent>
      </Tabs>
    </div>
  );
};
