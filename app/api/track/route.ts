import { NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reference = String(body.reference || "").trim().toUpperCase();
    const trackingToken = String(body.token || "").trim();
    if (!reference || !trackingToken) return NextResponse.json({ error: "Please enter your consultation reference and private tracking key." }, { status: 400 });

    const supabase = createAdminClient();
    const query = await supabase.from("consultations").select("id,reference,full_name,practice_area,office,consultation_type,preferred_date,preferred_time,status,urgency,created_at").eq("reference", reference).eq("tracking_token", trackingToken).maybeSingle();
    if (query.error || !query.data) return NextResponse.json({ error: "No consultation matched those tracking details." }, { status: 404 });

    const documents = await supabase.from("consultation_documents").select("id,file_name,created_at").eq("consultation_id", query.data.id).order("created_at", { ascending: false });
    return NextResponse.json({ consultation: query.data, documents: documents.data || [] });
  } catch (error) {
    console.error("Tracking lookup failed", error);
    return NextResponse.json({ error: "We could not check your consultation right now." }, { status: 500 });
  }
}
