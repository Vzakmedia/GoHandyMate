
export interface JobRequest {
  id: string;
  unit_id: string;
  job_type: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  preferred_schedule: string;
  created_at: string;
  updated_at: string;
  units: {
    unit_number: string;
    unit_name?: string;
    property_address: string;
  };
  assigned_to_user_id?: string;
  profiles?: {
    full_name: string;
  };
}

export interface Unit {
  id: string;
  unit_number: string;
  unit_name?: string;
  property_address: string;
}

export interface JobCounts {
  all: number;
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}
