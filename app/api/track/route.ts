import { NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase/admin";
import { cleanText, rateLimit } from "../../../lib/request-security";

export async function POST(request: Request) {
  const limited = rateLimit(request, "consultation-track", 20, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const body = await request.json();
    const reference = cleanText(body.reference, 40).toUpperCase();
    const trackingToken = cleanText(body.token, 100);
    if (!reference || !trackingToken) return NextResponse.json({ error: "Please enter your consultation reference and private tracking key." }, { status: 400 });
    if (!/^BRX-\d{4}-[A-Z0-9]{8}$/.test(reference) || trackingToken.length < 20) return NextResponse.json({ error: "No consultation matched those tracking details." }, { status: 404 });
    const supabase = createAdminClient();
    const query = await supabase.from("consultations").select("id,reference,full_name,practice_area,office,consultation_type,preferred_date,preferred_time,status,urgency,created_at").eq("reference", reference).eq("tracking_token", trackingToken).maybeSingle();
    if (query.error || !query.data) return NextResponse.json({ error: "No consultation matched those tracking details." }, { status: 404 });
    const [documents, changeRequests] = await Promise.all([
      supabase.from("consultation_documents").select("id,file_name,created_at").eq("consultation_id", query.data.id).order("created_at", { ascending: false }),
      supabase.from("consultation_change_requests").select("id,request_type,requested_date,requested_time,reason,status,admin_note,created_at,reviewed_at").eq("consultation_id", query.data.id).order("created_at", { ascending: false }).limit(5),
    ]);
    return NextResponse.json({ consultation: query.data, documents: documents.data || [], changeRequests: changeRequests.data || [] });
  } catch (error) {
    console.error("Tracking lookup failed", error);
    return NextResponse.json({ error: "We could not check your consultation right now." }, { status: 500 });
  }
}
