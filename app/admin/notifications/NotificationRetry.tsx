"use client";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function NotificationRetry({id}:{id:string}){const[busy,setBusy]=useState(false);const router=useRouter();async function retry(){setBusy(true);const r=await fetch(`/api/admin/notifications/${id}/retry`,{method:"POST"});const d=await r.json();setBusy(false);if(!r.ok){alert(d.error||"Retry failed.");return}router.refresh()}return <button className="admin-retry" onClick={retry} disabled={busy}>{busy?<Loader2 className="admin-spin" size={14}/>:<RefreshCw size={14}/>} Retry</button>}
