export type Role = "user" | "admin";

export type ReportStatus = "new" | "in_progress" | "resolved";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
}

export interface ProfileRef {
  id: string;
  full_name: string | null;
  email: string;
}

export type ReportItemCategory =
  | "electrical"
  | "plumbing"
  | "structural"
  | "other";

export interface ReportItem {
  id: string;
  report_id: string;
  description: string;
  category: ReportItemCategory;
  photo_url: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  photo_url: string | null;
  status: ReportStatus;
  reported_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReportWithProfiles extends Report {
  reporter: ProfileRef | null;
  assignee: ProfileRef | null;
  report_items: ReportItem[];
}
