
export interface ServiceArea {
  id?: string;
  area_name: string;
  center_latitude: number;
  center_longitude: number;
  radius_miles: number;
  is_primary: boolean;
  is_active: boolean;
  zip_code?: string;
  formatted_address?: string;
}

export interface ServiceAreaSettingsProps {
  isEditing: boolean;
}
