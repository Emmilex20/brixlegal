import { NextResponse } from "next/server";
import { createClient } from "../../../../../lib/supabase/server";

const allowedStatuses = ["pending", "under_review", "confirmed", "completed", "cancelled", "declined"];

async function getAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null };
  const { data: profile } = await supabase.from("admin_profiles").select("id,full_name,role").eq("id", user.id).maybeSingle();
  return { supabase, user: profile };
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { supabase, user } = await getAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data: current } = await supabase.from("consultations").select("status").eq("id", id).maybeSingle();
  if (!current) return NextResponse.json({ error: "Consultation not found" }, { status: 404 });

  const updates: Record<string, string | null> = {};
  if (body.status !== undefined) {
    if (!allowedStatuses.includes(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    updates.status = body.status;
  }
  if (body.preferred_date !== undefined) updates.preferred_date = body.preferred_date;
  if (body.preferred_time !== undefined) updates.preferred_time = body.preferred_time;
  if (body.assigned_to !== undefined) updates.assigned_to = body.assigned_to || null;

  const { data, error } = await supabase.from("consultations").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (body.status && body.status !== current.status) {
    await supabase.from("consultation_status_history").insert({ consultation_id: id, from_status: current.status, to_status: body.status, changed_by: user.id });
  }
  return NextResponse.json({ consultation: data });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { supabase, user } = await getAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const note = String(body.note || "").trim();
  if (!note) return NextResponse.json({ error: "Write a note before saving." }, { status: 400 });
  const { data, error } = await supabase.from("consultation_notes").insert({ consultation_id: id, author_id: user.id, note }).select("id,note,created_at,author_id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ note: { ...data, author: user.full_name } });
}
