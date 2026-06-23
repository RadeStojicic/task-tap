--TABLES

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  role       text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  location    text,
  photo_url   text,
  status      text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
  reported_by uuid not null references public.profiles (id) on delete cascade,
  assigned_to uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.report_items (
  id          uuid primary key default gen_random_uuid(),
  report_id   uuid not null references public.reports (id) on delete cascade,
  description text not null,
  category    text not null default 'other'
                check (category in ('electrical', 'plumbing', 'structural', 'other')),
  photo_url   text,
  created_at  timestamptz not null default now()
);

create index if not exists report_items_report_id_idx on public.report_items (report_id);

create index if not exists reports_reported_by_idx on public.reports (reported_by);
create index if not exists reports_status_idx      on public.reports (status);
create index if not exists reports_created_at_idx   on public.reports (created_at desc);


create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;


create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();


-- ROW LEVEL SECURITY

alter table public.profiles enable row level security;
alter table public.reports  enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_select_admin on public.profiles;
create policy profiles_select_admin on public.profiles
  for select using (public.is_admin());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert with check (auth.uid() = id and role = 'user');

drop policy if exists reports_select_own on public.reports;
create policy reports_select_own on public.reports
  for select using (auth.uid() = reported_by);

drop policy if exists reports_select_admin on public.reports;
create policy reports_select_admin on public.reports
  for select using (public.is_admin());

drop policy if exists reports_insert_own on public.reports;
create policy reports_insert_own on public.reports
  for insert with check (auth.uid() = reported_by);

drop policy if exists reports_update_admin on public.reports;
create policy reports_update_admin on public.reports
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists reports_delete_admin on public.reports;
create policy reports_delete_admin on public.reports
  for delete using (public.is_admin());

alter table public.report_items enable row level security;

drop policy if exists report_items_select_own on public.report_items;
create policy report_items_select_own on public.report_items
  for select using (
    exists (
      select 1 from public.reports
      where reports.id = report_items.report_id
        and reports.reported_by = auth.uid()
    )
  );

drop policy if exists report_items_select_admin on public.report_items;
create policy report_items_select_admin on public.report_items
  for select using (public.is_admin());

drop policy if exists report_items_insert_own on public.report_items;
create policy report_items_insert_own on public.report_items
  for insert with check (
    exists (
      select 1 from public.reports
      where reports.id = report_items.report_id
        and reports.reported_by = auth.uid()
    )
  );

drop policy if exists report_items_update_admin on public.report_items;
create policy report_items_update_admin on public.report_items
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists report_items_delete_admin on public.report_items;
create policy report_items_delete_admin on public.report_items
  for delete using (public.is_admin());


--STORAGE

insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

drop policy if exists report_photos_read on storage.objects;
create policy report_photos_read on storage.objects
  for select using (bucket_id = 'report-photos');

drop policy if exists report_photos_insert on storage.objects;
create policy report_photos_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'report-photos');
