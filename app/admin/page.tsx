import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock3, Scale, Users } from "lucide-react";
import { createClient } from "../../lib/supabase/server";
import "./admin.css";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("admin_profiles").select("full_name, role").eq("id", user.id).maybeSingle();
  if (!profile) redirect("/admin/login?unauthorized=1");

  const { data: consultations } = await supabase.from("consultations").select("id,reference,full_name,practice_area,status,preferred_date,preferred_time,urgency,created_at").order("created_at", { ascending: false }).limit(8);
  const rows = consultations ?? [];
  const pending = rows.filter((item) => item.status === "pending").length;
  const confirmed = rows.filter((item) => item.status === "confirmed").length;

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div><span className="consult-panel__eyebrow">Brix Legal · Administration</span><h1>Good day, {profile.full_name}.</h1><p>Here is the latest consultation activity.</p></div>
        <Link className="button button--outline" href="/">View website</Link>
      </header>
      <section className="admin-stats">
        <article><Clock3 /><span>Pending review</span><strong>{pending}</strong></article>
        <article><CalendarDays /><span>Confirmed</span><strong>{confirmed}</strong></article>
        <article><Users /><span>Recent requests</span><strong>{rows.length}</strong></article>
        <article><Scale /><span>Admin role</span><strong>{profile.role}</strong></article>
      </section>
      <section className="admin-table-card">
        <div className="admin-section-head"><div><span className="consult-panel__eyebrow">Consultations</span><h2>Recent requests</h2></div></div>
        {rows.length === 0 ? <div className="admin-empty"><CalendarDays size={30} /><h3>No consultation requests yet</h3><p>New requests will appear here as clients complete the booking form.</p></div> : (
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Client</th><th>Practice area</th><th>Preferred appointment</th><th>Status</th><th>Reference</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id}><td><strong>{item.full_name}</strong><small>{item.urgency}</small></td><td>{item.practice_area}</td><td>{item.preferred_date}<small>{item.preferred_time}</small></td><td><span className={`admin-status admin-status--${item.status}`}>{item.status.replace("_", " ")}</span></td><td>{item.reference}</td></tr>)}</tbody></table></div>
        )}
      </section>
    </main>
  );
}
