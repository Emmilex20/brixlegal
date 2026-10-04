create table if not exists public.consultation_notifications (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  notification_type text not null,
  recipient text not null,
  subject text not null,
  status text not null default 'pending' check (status in ('pending','sent','failed','skipped')),
  provider_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (consultation_id, notification_type)
);

create index if not exists consultation_notifications_consultation_idx on public.consultation_notifications(consultation_id, created_at desc);
create index if not exists consultation_notifications_status_idx on public.consultation_notifications(status, created_at desc);

alter table public.consultation_notifications enable row level security;

drop policy if exists "Admins can view notification logs" on public.consultation_notifications;
create policy "Admins can view notification logs" on public.consultation_notifications
for select to authenticated using (exists(select 1 from public.admin_profiles where id = auth.uid()));

drop policy if exists "Admins can manage notification logs" on public.consultation_notifications;
create policy "Admins can manage notification logs" on public.consultation_notifications
for all to authenticated using (exists(select 1 from public.admin_profiles where id = auth.uid())) with check (exists(select 1 from public.admin_profiles where id = auth.uid()));
