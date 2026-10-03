import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, Video } from "lucide-react";
import { createClient } from "../../../lib/supabase/server";
import "../admin.css";

function iso(d: Date) { return d.toISOString().slice(0, 10); }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function mondayOf(d: Date) { const x = new Date(d); const day = x.getDay(); x.setDate(x.getDate() - ((day + 6) % 7)); x.setHours(12,0,0,0); return x; }
function prettyDay(d: Date) { return d.toLocaleDateString("en-NG", { weekday:"short", day:"numeric", month:"short" }); }

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("admin_profiles").select("id").eq("id", user.id).maybeSingle();
  if (!profile) redirect("/admin/login?unauthorized=1");

  const requested = params.date ? new Date(`${params.date}T12:00:00`) : new Date();
  const start = mondayOf(Number.isNaN(requested.getTime()) ? new Date() : requested);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const end = days[6];
  const { data } = await supabase.from("consultations").select("id,reference,full_name,practice_area,status,preferred_date,preferred_time,office,consultation_type,urgency").gte("preferred_date", iso(start)).lte("preferred_date", iso(end)).not("status", "in", "(cancelled,declined)").order("preferred_date").order("preferred_time");
  const items = data ?? [];
  const prev = iso(addDays(start, -7)); const next = iso(addDays(start, 7));

  return <main className="admin-page admin-calendar-page">
    <Link className="admin-back" href="/admin"><ArrowLeft size={15}/> Dashboard</Link>
    <header className="admin-topbar admin-calendar-head"><div><span className="consult-panel__eyebrow">Brix Legal · Schedule</span><h1>Appointment calendar</h1><p>{prettyDay(start)} — {prettyDay(end)} · {items.length} active appointment{items.length === 1 ? "" : "s"}</p></div><div className="admin-calendar-nav"><Link href={`/admin/calendar?date=${prev}`}><ChevronLeft size={17}/> Previous</Link><Link href="/admin/calendar">Today</Link><Link href={`/admin/calendar?date=${next}`}>Next <ChevronRight size={17}/></Link></div></header>
    <section className="admin-calendar-grid">{days.map((day) => { const date = iso(day); const appointments = items.filter((item) => item.preferred_date === date); const today = date === iso(new Date()); return <article key={date} className={`admin-calendar-day ${today ? "is-today" : ""}`}><header><span>{day.toLocaleDateString("en-NG",{weekday:"long"})}</span><strong>{day.getDate()}</strong><small>{day.toLocaleDateString("en-NG",{month:"short"})}</small></header><div className="admin-calendar-list">{appointments.length ? appointments.map((item) => <Link href={`/admin/consultations/${item.id}`} className={`admin-appointment admin-appointment--${item.status}`} key={item.id}><div><Clock3 size={13}/><strong>{item.preferred_time}</strong></div><h3>{item.full_name}</h3><p>{item.practice_area}</p><small>{item.consultation_type === "Video call" ? <Video size={12}/> : <MapPin size={12}/>} {item.consultation_type} · {item.office}</small><span>{item.status.replaceAll("_"," ")}</span></Link>) : <div className="admin-calendar-empty"><CalendarDays size={17}/><span>No appointments</span></div>}</div></article> })}</section>
  </main>;
}
