
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceCategory } from '@/data/handymanCategories';

interface ServiceConfigurationFormProps {
  category: ServiceCategory;
  propertyType: string;
  setPropertyType: (value: string) => void;
  rooms: string;
  setRooms: (value: string) => void;
  floors: string;
  setFloors: (value: string) => void;
  frequency: string;
  setFrequency: (value: string) => void;
  urgency: string;
  setUrgency: (value: string) => void;
}

export const ServiceConfigurationForm = ({
  category,
  propertyType,
  setPropertyType,
  rooms,
  setRooms,
  floors,
  setFloors,
  frequency,
  setFrequency,
  urgency,
  setUrgency
}: ServiceConfigurationFormProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Service Configuration</h3>
      <div className="space-y-4">
        {/* Property Type */}
        {category.propertyOptions && (
          <div>
            <label className="block text-sm font-medium mb-2">Property Type</label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {category.propertyOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Additional Options */}
        {category.additionalOptions?.rooms && (
          <div>
            <label className="block text-sm font-medium mb-2">Number of Rooms</label>
            <Select value={rooms} onValueChange={setRooms}>
              <SelectTrigger>
                <SelectValue placeholder="Select rooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Room (Base price)</SelectItem>
                <SelectItem value="2-3">2-3 Rooms (+50%)</SelectItem>
                <SelectItem value="4-6">4-6 Rooms (+100%)</SelectItem>
                <SelectItem value="7+">7+ Rooms (+150%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {category.additionalOptions?.floors && (
          <div>
            <label className="block text-sm font-medium mb-2">Number of Floors</label>
            <Select value={floors} onValueChange={setFloors}>
              <SelectTrigger>
                <SelectValue placeholder="Select floors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Floor (Base price)</SelectItem>
                <SelectItem value="2">2 Floors (+30%)</SelectItem>
                <SelectItem value="3+">3+ Floors (+50%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {category.additionalOptions?.frequency && (
          <div>
            <label className="block text-sm font-medium mb-2">Service Frequency</label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time Service</SelectItem>
                <SelectItem value="weekly">Weekly (-10% discount)</SelectItem>
                <SelectItem value="bi-weekly">Bi-weekly (-5% discount)</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {category.additionalOptions?.urgency && (
          <div>
            <label className="block text-sm font-medium mb-2">Urgency Level</label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flexible">Flexible (7+ days) - Best Rate</SelectItem>
                <SelectItem value="this-week">This Week (+20%)</SelectItem>
                <SelectItem value="urgent">Urgent (2-3 days) (+50%)</SelectItem>
                <SelectItem value="emergency">Emergency (Same day) (+80%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};
