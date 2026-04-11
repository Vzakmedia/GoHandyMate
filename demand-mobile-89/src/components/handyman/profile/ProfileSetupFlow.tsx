import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useHandymanData } from '@/hooks/useHandymanData';
import { SkillsManager } from '../SkillsManager';
import { ServicePricingManager } from '../ServicePricingManager';
import { WorkAreaManager } from '../WorkAreaManager';
import { toast } from 'sonner';

export const ProfileSetupFlow = () => {
  const { data: handymanData, loading, refreshData } = useHandymanData();
  const [currentStep, setCurrentStep] = useState(1);
  const [setupProgress, setSetupProgress] = useState(0);

  // Calculate setup completion in real-time
  useEffect(() => {
    if (!handymanData || loading) return;

    const hasSkills = handymanData.skillRates?.length > 0;
    const hasServicePricing = handymanData.servicePricing?.length > 0;
    const hasWorkAreas = handymanData.workAreas?.length > 0;
    const hasWorkSettings = handymanData.workSettings !== null;

    const completedSteps = [hasSkills, hasServicePricing, hasWorkAreas, hasWorkSettings].filter(Boolean).length;
    const progress = (completedSteps / 4) * 100;
    
    setSetupProgress(progress);
    
    // Auto-advance to next incomplete step
    if (hasSkills && !hasServicePricing && currentStep === 1) {
      setCurrentStep(2);
    } else if (hasServicePricing && !hasWorkAreas && currentStep === 2) {
      setCurrentStep(3);
    } else if (hasWorkAreas && !hasWorkSettings && currentStep === 3) {
      setCurrentStep(4);
    }
  }, [handymanData, loading, currentStep]);

  const handleStepComplete = async () => {
    await refreshData();
    toast.success('Step completed! Data saved successfully.');
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepStatus = (step: number) => {
    if (!handymanData) return 'pending';
    
    switch (step) {
      case 1:
        return handymanData.skillRates?.length > 0 ? 'completed' : 'pending';
      case 2:
        return handymanData.servicePricing?.length > 0 ? 'completed' : 'pending';
      case 3:
        return handymanData.workAreas?.length > 0 ? 'completed' : 'pending';
      case 4:
        return handymanData.workSettings ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  const renderStepIcon = (step: number) => {
    const status = getStepStatus(step);
    const isCurrentStep = currentStep === step;
    
    if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (isCurrentStep) {
      return <Clock className="w-5 h-5 text-blue-600" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const steps = [
    { id: 1, title: 'Add Skills', description: 'Define your expertise areas' },
    { id: 2, title: 'Set Pricing', description: 'Configure service rates' },
    { id: 3, title: 'Work Areas', description: 'Define service locations' },
    { id: 4, title: 'Preferences', description: 'Set work preferences' }
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Complete Your Profile Setup</span>
            <span className="text-sm font-normal text-gray-600">
              {Math.round(setupProgress)}% Complete
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={setupProgress} className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  currentStep === step.id
                    ? 'border-blue-500 bg-blue-50'
                    : getStepStatus(step.id) === 'completed'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {renderStepIcon(step.id)}
                  <span className="font-medium">{step.title}</span>
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <div className="space-y-6">
        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Step 1: Add Your Skills</h3>
            <SkillsManager isEditing={true} />
            {handymanData.skillRates?.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button onClick={handleStepComplete} className="bg-green-600 hover:bg-green-700">
                  Continue to Pricing →
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Step 2: Set Service Pricing</h3>
            <ServicePricingManager isEditing={true} />
            {handymanData.servicePricing?.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button onClick={handleStepComplete} className="bg-green-600 hover:bg-green-700">
                  Continue to Work Areas →
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Step 3: Define Work Areas</h3>
            <WorkAreaManager isEditing={true} />
            {handymanData.workAreas?.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button onClick={handleStepComplete} className="bg-green-600 hover:bg-green-700">
                  Complete Setup →
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Step 4: Work Preferences</h3>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-600 mb-2">
                    Profile Setup Complete!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your profile is now ready to receive job requests. All your data is being updated in real-time.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {handymanData.skillRates?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Skills Added</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {handymanData.servicePricing?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Services Priced</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {handymanData.workAreas?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Work Areas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round(setupProgress)}%
                      </div>
                      <div className="text-sm text-gray-600">Complete</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
