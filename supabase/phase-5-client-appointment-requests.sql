create table if not exists public.consultation_change_requests (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  request_type text not null check (request_type in ('reschedule','cancel')),
  requested_date date,
  requested_time text,
  reason text not null,
  status text not null default 'pending' check (status in ('pending','approved','declined')),
  admin_note text,
  reviewed_by uuid references public.admin_profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists consultation_change_requests_consultation_idx on public.consultation_change_requests(consultation_id, created_at desc);
create unique index if not exists consultation_change_requests_one_pending_idx on public.consultation_change_requests(consultation_id) where status='pending';
alter table public.consultation_change_requests enable row level security;
drop policy if exists "Admins can view change requests" on public.consultation_change_requests;
create policy "Admins can view change requests" on public.consultation_change_requests for select to authenticated using (exists(select 1 from public.admin_profiles where id=auth.uid()));
drop policy if exists "Admins can manage change requests" on public.consultation_change_requests;
create policy "Admins can manage change requests" on public.consultation_change_requests for all to authenticated using (exists(select 1 from public.admin_profiles where id=auth.uid())) with check (exists(select 1 from public.admin_profiles where id=auth.uid()));
