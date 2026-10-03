import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "../../../lib/supabase/server";
import AvailabilityManager from "./AvailabilityManager";
import "../admin.css";

export default async function AvailabilityPage(){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/admin/login");const {data:profile}=await supabase.from("admin_profiles").select("id").eq("id",user.id).maybeSingle();if(!profile)redirect("/admin/login?unauthorized=1");
 return <main className="admin-page"><header className="admin-topbar"><div><Link className="admin-back" href="/admin"><ArrowLeft size={15}/> Dashboard</Link><span className="consult-panel__eyebrow">Scheduling</span><h1>Availability &amp; calendar rules</h1><p>Control when clients can request appointments and close dates when the firm is unavailable.</p></div></header><AvailabilityManager/></main>
}
