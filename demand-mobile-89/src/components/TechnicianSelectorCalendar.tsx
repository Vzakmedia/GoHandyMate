
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { TechnicianAvailabilityCalendar } from "./TechnicianAvailabilityCalendar";
import { usePreviousTechnicians } from './technician-selector/usePreviousTechnicians';
import { PreviousTechniciansTab } from './technician-selector/PreviousTechniciansTab';
import { AllServicesTab } from './technician-selector/AllServicesTab';
import { TechnicianSelectorCalendarProps, PreviousTechnician } from './technician-selector/types';

export const TechnicianSelectorCalendar = ({ onClose, onBooking }: TechnicianSelectorCalendarProps) => {
  const [selectedTechnician, setSelectedTechnician] = useState<PreviousTechnician | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState('previous');
  const { previousTechnicians, loading } = usePreviousTechnicians();

  const handleViewCalendar = (technician: PreviousTechnician) => {
    console.log('Selected technician for calendar:', technician);
    setSelectedTechnician(technician);
    setShowCalendar(true);
  };

  const handleBookingConfirm = (booking: { date: Date; timeSlot: string; duration: string }) => {
    if (selectedTechnician) {
      console.log('Confirming booking:', booking, 'with technician:', selectedTechnician);
      onBooking({
        ...booking,
        technicianId: selectedTechnician.id
      });
      setShowCalendar(false);
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Button onClick={onClose} variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            Schedule Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="previous">Previous Technicians</TabsTrigger>
              <TabsTrigger value="all">All Services</TabsTrigger>
            </TabsList>

            <TabsContent value="previous" className="space-y-4 mt-6">
              <PreviousTechniciansTab
                technicians={previousTechnicians}
                loading={loading}
                onViewCalendar={handleViewCalendar}
                onSwitchToAllServices={() => setActiveTab('all')}
              />
            </TabsContent>

            <TabsContent value="all" className="space-y-4 mt-6">
              <AllServicesTab />
            </TabsContent>
          </Tabs>
        </div>

        {showCalendar && selectedTechnician && (
          <TechnicianAvailabilityCalendar
            technician={selectedTechnician}
            onClose={() => setShowCalendar(false)}
            onBooking={handleBookingConfirm}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
