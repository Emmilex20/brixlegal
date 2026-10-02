"use client";

import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const practiceAreas = [
  "Corporate Practice",
  "Commercial Law",
  "Regulatory & Statutory Compliance",
  "Alternative Dispute Resolution",
  "Taxation Law",
  "Real Estate & Property Law",
  "Employment Law",
  "Intellectual Property",
  "Business Structuring & Management",
  "Legacy Building",
  "Media & Entertainment Law",
  "Litigation",
  "Social Justice",
  "General Legal Counsel",
];

const steps = ["Your information", "Legal matter", "Consultation", "Review"];

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  clientStatus: string;
  office: string;
  practiceArea: string;
  urgency: string;
  matter: string;
  consultationType: string;
  date: string;
  time: string;
  consent: boolean;
};

const initialData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  clientStatus: "New client",
  office: "",
  practiceArea: "",
  urgency: "Standard",
  matter: "",
  consultationType: "",
  date: "",
  time: "",
  consent: false,
};

function BrixBrand() {
  return (
    <span className="brand">
      <img src="/brix-legal-emblem.webp" alt="" aria-hidden="true" />
      <span>
        <strong>Brix Legal</strong>
        <small>Practice &amp; Consultancy</small>
      </span>
    </span>
  );
}

export default function ConsultationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reference = useMemo(
    () => `BRX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    [],
  );

  const updateField = <Key extends keyof FormData>(key: Key, value: FormData[Key]) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const validateStep = () => {
    if (step === 1 && (!formData.fullName || !formData.email || !formData.phone || !formData.office)) {
      return "Please complete your contact information and preferred office.";
    }

    if (step === 2 && (!formData.practiceArea || !formData.matter)) {
      return "Please select a practice area and briefly describe your matter.";
    }

    if (step === 3 && (!formData.consultationType || !formData.date || !formData.time)) {
      return "Please choose a consultation type, preferred date and time.";
    }

    if (step === 4 && !formData.consent) {
      return "Please confirm the declaration before submitting your request.";
    }

    return "";
  };

  const handleNext = () => {
    const validationMessage = validateStep();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setStep((current) => Math.min(current + 1, 4));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationMessage = validateStep();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="consult-success">
        <section className="consult-success__card">
          <CheckCircle2 size={56} strokeWidth={1.5} />
          <h1>Consultation request received.</h1>
          <p>
            Your reference is <strong>{reference}</strong>. The Brix Legal team will review your request
            and contact you to confirm the appointment.
          </p>
          <Link className="button button--primary" href="/">
            Return to Brix Legal
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="consult-page">
      <section className="consult-shell">
        <aside className="consult-sidebar">
          <Link className="consult-back" href="/">
            <ArrowLeft size={15} /> Back to website
          </Link>
          <BrixBrand />
          <h1>Book a Consultation</h1>
          <p>A guided intake that keeps your matter organised from first contact.</p>
          <ol className="consult-progress">
            {steps.map((label, index) => {
              const number = index + 1;
              const stateClass = number === step ? "is-active" : number < step ? "is-complete" : "";

              return (
                <li key={label} className={stateClass}>
                  <span>{String(number).padStart(2, "0")}</span>
                  {label}
                </li>
              );
            })}
          </ol>
        </aside>

        <form className="consult-panel" onSubmit={handleSubmit}>
          <span className="consult-panel__eyebrow">Step {step} of 4</span>

          {step === 1 && (
            <>
              <h2>Your information</h2>
              <p>Tell us how to reach you and which office is most convenient.</p>
              <div className="consult-grid">
                <label className="consult-field consult-field--full">
                  Full name
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </label>
                <label className="consult-field">
                  Email address
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>
                <label className="consult-field">
                  Phone number
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="+234"
                    autoComplete="tel"
                  />
                </label>
                <label className="consult-field">
                  Client status
                  <select
                    value={formData.clientStatus}
                    onChange={(event) => updateField("clientStatus", event.target.value)}
                  >
                    <option>New client</option>
                    <option>Existing client</option>
                  </select>
                </label>
                <label className="consult-field">
                  Preferred office
                  <select value={formData.office} onChange={(event) => updateField("office", event.target.value)}>
                    <option value="">Select office</option>
                    <option>Abuja</option>
                    <option>Calabar</option>
                    <option>Remote consultation</option>
                  </select>
                </label>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Tell us about your matter</h2>
              <p>A short overview helps the right legal professional prepare for your consultation.</p>
              <div className="consult-grid">
                <label className="consult-field">
                  Area of legal service
                  <select
                    value={formData.practiceArea}
                    onChange={(event) => updateField("practiceArea", event.target.value)}
                  >
                    <option value="">Select practice area</option>
                    {practiceAreas.map((area) => (
                      <option key={area}>{area}</option>
                    ))}
                  </select>
                </label>
                <label className="consult-field">
                  Urgency
                  <select value={formData.urgency} onChange={(event) => updateField("urgency", event.target.value)}>
                    <option>Standard</option>
                    <option>Time-sensitive</option>
                    <option>Urgent</option>
                  </select>
                </label>
                <label className="consult-field consult-field--full">
                  Brief description
                  <textarea
                    value={formData.matter}
                    onChange={(event) => updateField("matter", event.target.value)}
                    placeholder="Briefly describe your legal matter"
                  />
                </label>
                <label className="consult-field consult-field--full">
                  Supporting documents (optional)
                  <input type="file" multiple />
                </label>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2>Choose your consultation</h2>
              <p>Select how and when you would prefer to speak with the Brix Legal team.</p>
              <div className="consult-options">
                {["In person", "Video call", "Phone call"].map((type) => (
                  <label key={type} className="consult-option">
                    <input
                      type="radio"
                      name="consultationType"
                      checked={formData.consultationType === type}
                      onChange={() => updateField("consultationType", type)}
                    />
                    <strong>{type}</strong>
                    <small>{type === "In person" ? formData.office || "Brix Legal office" : "Remote consultation"}</small>
                  </label>
                ))}
              </div>
              <div className="consult-grid" style={{ marginTop: 22 }}>
                <label className="consult-field">
                  Preferred date
                  <input
                    type="date"
                    value={formData.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(event) => updateField("date", event.target.value)}
                  />
                </label>
                <label className="consult-field">
                  Preferred time
                  <select value={formData.time} onChange={(event) => updateField("time", event.target.value)}>
                    <option value="">Select time</option>
                    <option>10:00 AM</option>
                    <option>11:30 AM</option>
                    <option>1:00 PM</option>
                    <option>3:30 PM</option>
                  </select>
                </label>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2>Review your request</h2>
              <p>Please confirm the details below before submitting.</p>
              <div className="consult-review">
                <article>
                  <strong>{formData.fullName}</strong>
                  <span>{formData.email} · {formData.phone}</span>
                </article>
                <article>
                  <strong>{formData.practiceArea}</strong>
                  <span>{formData.urgency} · {formData.matter}</span>
                </article>
                <article>
                  <strong>{formData.consultationType}</strong>
                  <span>{formData.date} at {formData.time} · {formData.office}</span>
                </article>
              </div>
              <label className="consult-consent">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(event) => updateField("consent", event.target.checked)}
                />
                <span>
                  I confirm that the information provided is accurate and understand that submission does
                  not create a lawyer-client relationship until accepted by Brix Legal.
                </span>
              </label>
            </>
          )}

          {error && <p className="consult-error" role="alert">{error}</p>}

          <div className="consult-actions">
            {step > 1 && (
              <button
                className="button button--outline"
                type="button"
                onClick={() => {
                  setStep((current) => Math.max(current - 1, 1));
                  setError("");
                }}
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button className="button button--primary" type="button" onClick={handleNext}>
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button className="button button--primary" type="submit">
                Submit request <ArrowRight size={16} />
              </button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
