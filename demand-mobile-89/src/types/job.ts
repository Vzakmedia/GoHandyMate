
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'new_request' | 'assigned';
  scheduledDate: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  estimatedDuration: string;
  budget?: number;
  created_at?: string;
  updated_at?: string;
  job_type?: string;
  priority?: string;
  quote_id?: string;
  quote_request_id?: string;
  customer_id?: string;
  units?: {
    unit_number: string;
    property_address: string;
    tenant_name: string;
    tenant_phone: string;
  };
}

export type JobStatus = Job['status'];
