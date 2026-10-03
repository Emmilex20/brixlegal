"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";
import { ArrowRight, LockKeyhole } from "lucide-react";
import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-mark"><LockKeyhole size={22} /></div>
        <span className="consult-panel__eyebrow">Brix Legal · Private access</span>
        <h1>Admin portal</h1>
        <p>Sign in to manage consultation requests and appointments.</p>
        <form onSubmit={handleSubmit}>
          <label className="consult-field">Email address<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
          <label className="consult-field">Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
          {error && <p className="consult-error" role="alert">{error}</p>}
          <button className="button button--primary" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}<ArrowRight size={16} /></button>
        </form>
      </section>
    </main>
  );
}
