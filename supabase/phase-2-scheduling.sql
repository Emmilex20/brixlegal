-- Phase 2: scheduling and conflict-aware availability
-- Safe to re-run in the Supabase SQL editor.

-- Remove the earlier 3-argument version before installing the expanded function.
drop function if exists public.get_available_slots(date,text,text);

create or replace function public.get_available_slots(
  p_date date,
  p_office text default null,
  p_type text default null,
  p_exclude_consultation uuid default null
)
returns table(slot_time text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rule record;
  v_cursor time;
  v_weekday int;
begin
  if p_date < current_date then return; end if;
  if exists(select 1 from public.blocked_dates where blocked_date = p_date) then return; end if;
  v_weekday := extract(dow from p_date)::int;

  for v_rule in
    select start_time, end_time, slot_minutes
    from public.availability
    where weekday = v_weekday and is_active = true
      and (office is null or office = p_office)
      and (consultation_type is null or consultation_type = p_type)
    order by start_time
  loop
    v_cursor := v_rule.start_time;
    while (v_cursor + make_interval(mins => v_rule.slot_minutes)) <= v_rule.end_time loop
      if not exists (
        select 1 from public.consultations c
        where c.preferred_date = p_date
          and c.preferred_time = to_char(v_cursor, 'HH12:MI AM')
          and c.status in ('pending','under_review','confirmed')
          and c.office = p_office
          and (p_exclude_consultation is null or c.id <> p_exclude_consultation)
      ) then
        slot_time := to_char(v_cursor, 'HH12:MI AM'); return next;
      end if;
      v_cursor := v_cursor + make_interval(mins => v_rule.slot_minutes);
    end loop;
  end loop;
end;
$$;

grant execute on function public.get_available_slots(date,text,text,uuid) to anon, authenticated;

create or replace function public.is_consultation_slot_available(p_date date,p_time text,p_office text,p_consultation_type text)
returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from public.get_available_slots(p_date,p_office,p_consultation_type,null) s where s.slot_time = p_time);
$$;
grant execute on function public.is_consultation_slot_available(date,text,text,text) to anon, authenticated;
