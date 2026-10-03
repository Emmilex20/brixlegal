import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const office = searchParams.get("office");
  const type = searchParams.get("type");

  if (!date || !office || !type) {
    return NextResponse.json({ error: "Date, office and consultation type are required." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_available_slots", {
    p_date: date,
    p_office: office,
    p_consultation_type: type,
  });

  if (error) {
    console.error("Availability lookup failed:", error);
    return NextResponse.json({ error: "Unable to load appointment times." }, { status: 500 });
  }

  return NextResponse.json({ slots: (data ?? []).map((row: { slot_time: string }) => row.slot_time) });
}
