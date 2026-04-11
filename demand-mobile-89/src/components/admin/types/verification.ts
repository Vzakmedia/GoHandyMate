
export interface PendingUser {
  id: string;
  email: string;
  full_name: string;
  user_role: string;
  account_status: string;
  created_at: string;
  rejection_reason?: string;
}

export interface VerificationLog {
  id: string;
  admin_id: string;
  user_id: string;
  action: string;
  previous_status: string;
  new_status: string;
  reason?: string;
  created_at: string;
  admin_email?: string;
  user_email?: string;
}

export interface VerificationStats {
  pending_handymen: number;
  pending_contractors: number;
  total_pending: number;
}
