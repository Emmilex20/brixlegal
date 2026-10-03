import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const required = ["fullName", "email", "phone", "office", "practiceArea", "matter", "consultationType", "date", "time"];

    if (required.some((key) => !body[key])) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    const supabase = await createClient();
    const reference = `BRX-${new Date().getFullYear()}-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;

    // Public users have INSERT permission but intentionally do not have SELECT
    // permission on consultations. Do not chain .select() here: PostgREST would
    // then require a SELECT policy and turn an otherwise valid insert into an error.
    const { error } = await supabase.from("consultations").insert({
      reference,
      full_name: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      client_status: body.clientStatus || "New client",
      office: body.office,
      practice_area: body.practiceArea,
      urgency: body.urgency || "Standard",
      matter: body.matter.trim(),
      consultation_type: body.consultationType,
      preferred_date: body.date,
      preferred_time: body.time,
      status: "pending",
      assigned_to: null,
    });

    if (error) {
      console.error("Consultation insert failed:", error);
      return NextResponse.json(
        { error: "We could not submit your request. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ reference, status: "pending" }, { status: 201 });
  } catch (error) {
    console.error("Consultation request failed:", error);
    return NextResponse.json({ error: "Invalid consultation request." }, { status: 400 });
  }
}
