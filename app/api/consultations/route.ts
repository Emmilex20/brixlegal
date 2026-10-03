import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const required = ["fullName", "email", "phone", "office", "practiceArea", "matter", "consultationType", "date", "time"];
    if (required.some((key) => !body[key])) return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });

    const supabase = await createClient();
    const { data, error } = await supabase.from("consultations").insert({
      full_name: body.fullName.trim(), email: body.email.trim().toLowerCase(), phone: body.phone.trim(),
      client_status: body.clientStatus || "New client", office: body.office, practice_area: body.practiceArea,
      urgency: body.urgency || "Standard", matter: body.matter.trim(), consultation_type: body.consultationType,
      preferred_date: body.date, preferred_time: body.time,
    }).select("id, reference, status").single();

    if (error) return NextResponse.json({ error: "We could not submit your request. Please try again." }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid consultation request." }, { status: 400 });
  }
}
