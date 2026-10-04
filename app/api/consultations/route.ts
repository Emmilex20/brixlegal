import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { sendBookingEmails } from "../../../lib/email";
import { cleanText, rateLimit, validDate, validEmail, validTime } from "../../../lib/request-security";

export async function POST(request: Request) {
  const limited = rateLimit(request, "consultation-create", 8, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const body = await request.json();
    const fullName = cleanText(body.fullName, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    const phone = cleanText(body.phone, 40);
    const office = cleanText(body.office, 80);
    const practiceArea = cleanText(body.practiceArea, 120);
    const matter = cleanText(body.matter, 5000);
    const consultationType = cleanText(body.consultationType, 80);
    const date = cleanText(body.date, 10);
    const time = cleanText(body.time, 8);
    if (!fullName || !email || !phone || !office || !practiceArea || !matter || !consultationType || !date || !time)
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    if (!validEmail(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (!validDate(date) || !validTime(time)) return NextResponse.json({ error: "Please choose a valid appointment date and time." }, { status: 400 });
    if (matter.length < 20) return NextResponse.json({ error: "Please provide a little more detail about your matter." }, { status: 400 });

    const supabase = await createClient();
    const { data: slotAvailable, error: slotError } = await supabase.rpc("is_consultation_slot_available", { p_date: date, p_time: time, p_office: office, p_consultation_type: consultationType });
    if (slotError) return NextResponse.json({ error: "We could not verify this appointment time. Please try again." }, { status: 500 });
    if (!slotAvailable) return NextResponse.json({ error: "That appointment time is no longer available. Please choose another time." }, { status: 409 });

    const reference = `BRX-${new Date().getFullYear()}-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
    const trackingToken = crypto.randomUUID();
    const payload = { reference, tracking_token: trackingToken, full_name: fullName, email, phone, client_status: cleanText(body.clientStatus, 60) || "New client", office, practice_area: practiceArea, urgency: cleanText(body.urgency, 60) || "Standard", matter, consultation_type: consultationType, preferred_date: date, preferred_time: time, status: "pending", assigned_to: null };
    const { data, error } = await supabase.from("consultations").insert(payload).select("reference,tracking_token,full_name,email,phone,practice_area,office,consultation_type,preferred_date,preferred_time,status").single();
    if (error) { console.error("Consultation insert failed:", error); return NextResponse.json({ error: "We could not submit your request. Please try again." }, { status: 500 }); }
    try { await sendBookingEmails(data); } catch (mailError) { console.error("Booking email notification failed:", mailError); }
    return NextResponse.json({ reference, trackingToken, status: "pending" }, { status: 201 });
  } catch (error) {
    console.error("Consultation request failed:", error);
    return NextResponse.json({ error: "Invalid consultation request." }, { status: 400 });
  }
}
