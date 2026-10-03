"use client";

import { useState } from "react";
import { CheckCircle2, Clock3, Save, StickyNote } from "lucide-react";
import { useRouter } from "next/navigation";

type Admin = { id: string; full_name: string; role: string };
type Note = { id: string; note: string; created_at: string; author?: { full_name?: string } | null };

export default function ConsultationManager({ id, initialStatus, initialDate, initialTime, initialAssignedTo, admins, notes }: { id: string; initialStatus: string; initialDate: string; initialTime: string; initialAssignedTo: string | null; admins: Admin[]; notes: Note[] }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [assignedTo, setAssignedTo] = useState(initialAssignedTo || "");
  const [note, setNote] = useState("");
  const [items, setItems] = useState(notes);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3000); };

  async function save() {
    setBusy(true);
    const res = await fetch(`/api/admin/consultations/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, preferred_date: date, preferred_time: time, assigned_to: assignedTo }) });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return notify(data.error || "Could not save changes.");
    notify("Consultation updated successfully.");
    router.refresh();
  }

  async function addNote() {
    if (!note.trim()) return notify("Write a note before saving.");
    setBusy(true);
    const res = await fetch(`/api/admin/consultations/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note }) });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return notify(data.error || "Could not add note.");
    setItems((old) => [{ ...data.note, author: { full_name: data.note.author } }, ...old]);
    setNote("");
    notify("Internal note added.");
  }

  return <div className="admin-manager">
    {toast && <div className="admin-toast"><CheckCircle2 size={18}/>{toast}</div>}
    <section className="admin-detail-card">
      <div className="admin-section-head"><div><span className="consult-panel__eyebrow">Workflow</span><h2>Manage consultation</h2></div><Clock3 size={22}/></div>
      <div className="admin-form-grid">
        <label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="pending">Pending review</option><option value="under_review">Under review</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="declined">Declined</option><option value="cancelled">Cancelled</option></select></label>
        <label>Assigned to<select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}><option value="">Unassigned</option>{admins.map((a) => <option key={a.id} value={a.id}>{a.full_name} · {a.role}</option>)}</select></label>
        <label>Appointment date<input type="date" value={date} onChange={(e) => setDate(e.target.value)}/></label>
        <label>Appointment time<input value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 10:00 AM"/></label>
      </div>
      <button className="button button--primary admin-save" disabled={busy} onClick={save}><Save size={17}/>{busy ? "Saving…" : "Save changes"}</button>
    </section>
    <section className="admin-detail-card">
      <div className="admin-section-head"><div><span className="consult-panel__eyebrow">Private</span><h2>Internal notes</h2></div><StickyNote size={22}/></div>
      <textarea className="admin-note-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add context, follow-up details or instructions for the legal team…" rows={4}/>
      <button className="button button--outline admin-save" disabled={busy} onClick={addNote}>Add note</button>
      <div className="admin-notes">{items.length ? items.map((n) => <article key={n.id}><p>{n.note}</p><small>{n.author?.full_name || "Brix Legal admin"} · {new Date(n.created_at).toLocaleString()}</small></article>) : <p className="admin-muted">No internal notes yet.</p>}</div>
    </section>
  </div>;
}
