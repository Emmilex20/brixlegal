import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("admin_profiles").select("id").eq("id", user.id).maybeSingle();
  if (!profile) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const office = searchParams.get("office");
  const type = searchParams.get("type");
  const exclude = searchParams.get("exclude");
  if (!date || !office || !type) return NextResponse.json({ error: "Date, office and consultation type are required." }, { status: 400 });

  const { data, error } = await supabase.rpc("get_available_slots", {
    p_date: date,
    p_office: office,
    p_type: type,
    p_exclude_consultation: exclude || null,
  });
  if (error) {
    console.error("Admin availability lookup failed:", error);
    return NextResponse.json({ error: "Could not load available times." }, { status: 500 });
  }

  const slots = (data ?? [])
    .map((row: { slot_time?: string } | string) => typeof row === "string" ? row : row.slot_time)
    .filter((slot): slot is string => typeof slot === "string" && slot.length > 0);

  return NextResponse.json({ slots });
}
