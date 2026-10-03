-- Phase 3: client tracking + secure document storage
-- Run once after schema.sql and phase-2-scheduling.sql.

alter table public.consultations add column if not exists tracking_token uuid not null default gen_random_uuid();
create unique index if not exists consultations_tracking_token_idx on public.consultations(tracking_token);

-- Private bucket: files are served only through signed URLs created by authenticated admins.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('consultation-documents','consultation-documents',false,10485760,array['application/pdf','image/jpeg','image/png','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;

-- Admins may manage files in the private consultation bucket.
drop policy if exists "Admins manage consultation storage" on storage.objects;
create policy "Admins manage consultation storage" on storage.objects for all to authenticated
using (bucket_id='consultation-documents' and public.is_admin())
with check (bucket_id='consultation-documents' and public.is_admin());

-- Public uploads are intentionally NOT enabled at storage-policy level.
-- The Next.js upload endpoint validates a consultation tracking token first,
-- then uploads server-side with the Supabase service-role key.
