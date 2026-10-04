import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/supabase/admin";
import { sendChangeRequestAdminAlert } from "../../../../lib/email";
import { cleanText, rateLimit, validDate, validTime } from "../../../../lib/request-security";

export async function POST(request: Request) {
  const limited = rateLimit(request, "consultation-change", 10, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const body = await request.json();
    const reference = cleanText(body.reference, 40).toUpperCase();
    const token = cleanText(body.token, 100);
    const type = cleanText(body.type, 20);
    const reason = cleanText(body.reason, 2000);
    const date = cleanText(body.date, 10);
    const time = cleanText(body.time, 8);
    if (!reference || !token || !reason || !["reschedule", "cancel"].includes(type)) return NextResponse.json({ error: "Please complete the request details." }, { status: 400 });
    if (reason.length < 10) return NextResponse.json({ error: "Please provide a little more detail about your request." }, { status: 400 });
    if (type === "reschedule" && (!validDate(date) || !validTime(time))) return NextResponse.json({ error: "Choose a valid preferred new date and time." }, { status: 400 });
    const supabase = createAdminClient();
    const { data: c } = await supabase.from("consultations").select("id,reference,tracking_token,full_name,email,phone,practice_area,status,office,consultation_type,preferred_date,preferred_time").eq("reference", reference).eq("tracking_token", token).maybeSingle();
    if (!c) return NextResponse.json({ error: "Consultation could not be verified." }, { status: 403 });
    if (["completed", "no_show", "cancelled", "declined"].includes(c.status)) return NextResponse.json({ error: "This consultation can no longer be changed." }, { status: 409 });
    const { data: pending } = await supabase.from("consultation_change_requests").select("id").eq("consultation_id", c.id).eq("status", "pending").maybeSingle();
    if (pending) return NextResponse.json({ error: "You already have a change request awaiting review." }, { status: 409 });
    if (type === "reschedule") {
      const { data: available, error } = await supabase.rpc("is_consultation_slot_available", { p_date: date, p_time: time, p_office: c.office, p_consultation_type: c.consultation_type });
      if (error || !available) return NextResponse.json({ error: "That requested appointment time is no longer available." }, { status: 409 });
    }
    const { data, error } = await supabase.from("consultation_change_requests").insert({ consultation_id: c.id, request_type: type, requested_date: type === "reschedule" ? date : null, requested_time: type === "reschedule" ? time : null, reason }).select("id,request_type,requested_date,requested_time,reason,status,created_at").single();
    if (error) return NextResponse.json({ error: "We could not submit your request." }, { status: 500 });
    try {
      const mail = await sendChangeRequestAdminAlert(c, data);
      await supabase.from("consultation_notifications").insert({ consultation_id: c.id, notification_type: `change_request_admin_${data.id}`, recipient: process.env.BRIX_ADMIN_EMAIL || "Brix Legal admin", subject: `Client ${type === "reschedule" ? "reschedule" : "cancellation"} request · ${c.reference}`, status: mail.ok ? "sent" : "failed", provider_id: mail.id || null, error_message: mail.error || null, sent_at: mail.ok ? new Date().toISOString() : null });
    } catch (mailError) { console.error("Change request admin alert failed", mailError); }
    return NextResponse.json({ request: data }, { status: 201 });
  } catch (e) {
    console.error("Change request failed", e);
    return NextResponse.json({ error: "We could not submit your request." }, { status: 500 });
  }
}
