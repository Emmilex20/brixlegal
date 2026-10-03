create extension if not exists pgcrypto;

create type public.consultation_status as enum ('pending','under_review','confirmed','completed','cancelled','declined');
create type public.admin_role as enum ('admin','lawyer');

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.admin_role not null default 'admin',
  created_at timestamptz not null default now()
);

create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('BRX-' || to_char(now(), 'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  full_name text not null,
  email text not null,
  phone text not null,
  client_status text not null default 'New client',
  office text not null,
  practice_area text not null,
  urgency text not null default 'Standard',
  matter text not null,
  consultation_type text not null,
  preferred_date date not null,
  preferred_time text not null,
  status public.consultation_status not null default 'pending',
  assigned_to uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.consultation_notes (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  author_id uuid not null references public.admin_profiles(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create table public.consultation_status_history (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  from_status public.consultation_status,
  to_status public.consultation_status not null,
  changed_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.availability (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_minutes integer not null default 60 check (slot_minutes between 15 and 240),
  office text,
  consultation_type text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  blocked_date date not null,
  reason text,
  created_at timestamptz not null default now()
);

create table public.consultation_documents (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger consultations_set_updated_at
before update on public.consultations
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.admin_profiles where id = auth.uid());
$$;

alter table public.admin_profiles enable row level security;
alter table public.consultations enable row level security;
alter table public.consultation_notes enable row level security;
alter table public.consultation_status_history enable row level security;
alter table public.availability enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.consultation_documents enable row level security;

create policy "Admins can read admin profiles" on public.admin_profiles for select to authenticated using (public.is_admin());
create policy "Admins can update own profile" on public.admin_profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "Public can create consultation requests" on public.consultations for insert to anon, authenticated with check (status = 'pending' and assigned_to is null);
create policy "Admins can read consultations" on public.consultations for select to authenticated using (public.is_admin());
create policy "Admins can update consultations" on public.consultations for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage notes" on public.consultation_notes for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage status history" on public.consultation_status_history for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Public reads availability" on public.availability for select to anon, authenticated using (is_active = true);
create policy "Admins manage availability" on public.availability for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Public reads blocked dates" on public.blocked_dates for select to anon, authenticated using (true);
create policy "Admins manage blocked dates" on public.blocked_dates for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage documents" on public.consultation_documents for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.availability (weekday, start_time, end_time, slot_minutes)
values
  (1, '09:00', '17:00', 60),
  (2, '09:00', '17:00', 60),
  (3, '09:00', '17:00', 60),
  (4, '09:00', '17:00', 60),
  (5, '09:00', '16:00', 60);
