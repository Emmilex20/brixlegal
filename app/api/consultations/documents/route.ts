import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/supabase/admin";

const allowed = new Set(["application/pdf","image/jpeg","image/png","application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const reference = String(form.get("reference") || "").trim().toUpperCase();
    const token = String(form.get("token") || "").trim();
    const files = form.getAll("files").filter((item): item is File => item instanceof File);
    if (!reference || !token || !files.length) return NextResponse.json({ error: "Tracking details and at least one document are required." }, { status: 400 });
    if (files.length > 5) return NextResponse.json({ error: "You can upload up to 5 documents at a time." }, { status: 400 });
    for (const file of files) if (file.size > 10 * 1024 * 1024 || !allowed.has(file.type)) return NextResponse.json({ error: `${file.name} is not an accepted file. Use PDF, JPG, PNG or DOCX up to 10MB.` }, { status: 400 });

    const supabase = createAdminClient();
    const consultation = await supabase.from("consultations").select("id").eq("reference", reference).eq("tracking_token", token).maybeSingle();
    if (consultation.error || !consultation.data) return NextResponse.json({ error: "The consultation tracking details could not be verified." }, { status: 403 });

    const saved = [];
    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${consultation.data.id}/${crypto.randomUUID()}-${safeName}`;
      const upload = await supabase.storage.from("consultation-documents").upload(path, file, { contentType: file.type, upsert: false });
      if (upload.error) throw upload.error;
      const row = await supabase.from("consultation_documents").insert({ consultation_id: consultation.data.id, file_name: file.name, storage_path: path }).select("id,file_name,created_at").single();
      if (row.error) { await supabase.storage.from("consultation-documents").remove([path]); throw row.error; }
      saved.push(row.data);
    }
    return NextResponse.json({ documents: saved }, { status: 201 });
  } catch (error) {
    console.error("Document upload failed", error);
    return NextResponse.json({ error: "We could not upload the document(s). Please try again." }, { status: 500 });
  }
}
