import type {
  Profile,
  Report,
  ReportItem,
  ReportItemCategory,
  ReportStatus,
  ReportWithProfiles,
} from "../types";
import { env } from "./env";
import { supabase } from "./supabase";

const REPORT_SELECT =
  "*," +
  "reporter:profiles!reports_reported_by_fkey(id,full_name,email)," +
  "assignee:profiles!reports_assigned_to_fkey(id,full_name,email)," +
  "report_items(id,report_id,description,category,photo_url,created_at)";

async function authHeaders(
  extra: Record<string, string> = {},
): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    apikey: env.supabaseAnonKey,
    Authorization: `Bearer ${token ?? env.supabaseAnonKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function parse<T>(res: Response): Promise<T | null> {
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`REST ${res.status}: ${detail || res.statusText}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : null;
}

// profiles
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const qs = new URLSearchParams({ id: `eq.${userId}`, select: "*" });
  const res = await fetch(`${env.restUrl}/profiles?${qs.toString()}`, {
    headers: await authHeaders(),
  });
  const rows = (await parse<Profile[]>(res)) ?? [];
  return rows[0] ?? null;
}

export async function createProfile(input: {
  id: string;
  email: string;
  full_name: string | null;
}): Promise<Profile> {
  const res = await fetch(`${env.restUrl}/profiles`, {
    method: "POST",
    headers: await authHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify({ ...input, role: "user" }),
  });
  const rows = (await parse<Profile[]>(res)) ?? [];
  return rows[0];
}

// reports
export async function fetchReports(
  status?: ReportStatus,
): Promise<ReportWithProfiles[]> {
  const qs = new URLSearchParams({
    select: REPORT_SELECT,
    order: "created_at.desc",
  });
  if (status) qs.set("status", `eq.${status}`);
  const res = await fetch(`${env.restUrl}/reports?${qs.toString()}`, {
    headers: await authHeaders(),
  });
  return (await parse<ReportWithProfiles[]>(res)) ?? [];
}

export async function fetchReport(
  id: string,
): Promise<ReportWithProfiles | null> {
  const qs = new URLSearchParams({ id: `eq.${id}`, select: REPORT_SELECT });
  const res = await fetch(`${env.restUrl}/reports?${qs.toString()}`, {
    headers: await authHeaders(),
  });
  const rows = (await parse<ReportWithProfiles[]>(res)) ?? [];
  return rows[0] ?? null;
}

export interface NewReportInput {
  title: string;
  location: string | null;
  reported_by: string;
}

export async function createReport(input: NewReportInput): Promise<Report> {
  const res = await fetch(`${env.restUrl}/reports`, {
    method: "POST",
    headers: await authHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(input),
  });
  const rows = (await parse<Report[]>(res)) ?? [];
  return rows[0];
}

// report_items
export interface NewReportItemInput {
  report_id: string;
  description: string;
  category: ReportItemCategory;
  photo_url: string | null;
}

export async function fetchReportItems(
  reportId: string,
): Promise<ReportItem[]> {
  const qs = new URLSearchParams({
    report_id: `eq.${reportId}`,
    select: "*",
    order: "created_at.asc",
  });
  const res = await fetch(`${env.restUrl}/report_items?${qs.toString()}`, {
    headers: await authHeaders(),
  });
  return (await parse<ReportItem[]>(res)) ?? [];
}

export async function createReportItems(
  items: NewReportItemInput[],
): Promise<ReportItem[]> {
  const res = await fetch(`${env.restUrl}/report_items`, {
    method: "POST",
    headers: await authHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(items),
  });
  return (await parse<ReportItem[]>(res)) ?? [];
}

// report mutations
export interface ReportUpdate {
  status?: ReportStatus;
  assigned_to?: string | null;
}

export async function updateReport(
  id: string,
  patch: ReportUpdate,
): Promise<Report> {
  const qs = new URLSearchParams({ id: `eq.${id}` });
  const res = await fetch(`${env.restUrl}/reports?${qs.toString()}`, {
    method: "PATCH",
    headers: await authHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(patch),
  });
  const rows = (await parse<Report[]>(res)) ?? [];
  return rows[0];
}

export async function deleteReport(id: string): Promise<void> {
  const qs = new URLSearchParams({ id: `eq.${id}` });
  const res = await fetch(`${env.restUrl}/reports?${qs.toString()}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  await parse(res);
}
