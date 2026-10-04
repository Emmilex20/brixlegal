-- Phase 6 production database update
-- The admin workflow now supports a no-show consultation outcome.

alter type public.consultation_status add value if not exists 'no_show' after 'completed';

create index if not exists consultations_status_date_idx
  on public.consultations(status, preferred_date);

create index if not exists consultation_notifications_status_created_idx
  on public.consultation_notifications(status, created_at desc);
