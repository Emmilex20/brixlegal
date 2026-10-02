"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const services=["Corporate Practice","Commercial Law","Regulatory & Statutory Compliance","Alternative Dispute Resolution","Taxation Law","Real Estate & Property Law","Employment Law","Intellectual Property","Business Structuring & Management","Legacy Building","Media & Entertainment Law","Litigation","Social Justice","General Legal Counsel"];

export default function Consultation(){
  const [step,setStep]=useState(1);
  const [done,setDone]=useState(false);
  if(done) return <main className="consult-wrap"><div className="consult-card success"><CheckCircle2 size={52}/><span>BRIX LEGAL</span><h1>Consultation request received.</h1><p>Your reference is <strong>BRX-{new Date().getFullYear()}-1042</strong>. Our team will review your submission and confirm your appointment.</p><Link href="/">Return to website</Link></div></main>;
  return <main className="consult-wrap">
    <div className="consult-shell">
      <div className="consult-brand">
        <Link href="/" className="back"><ArrowLeft size={16}/> Back to Brix Legal</Link>
        <span>BRIX LEGAL</span><h1>Book a Consultation</h1>
        <p>A guided intake that keeps your matter organised from first contact.</p>
        <ol>
          <li className={step>=1?"active":""}>01 Your information</li>
          <li className={step>=2?"active":""}>02 Legal matter</li>
          <li className={step>=3?"active":""}>03 Consultation</li>
          <li className={step>=4?"active":""}>04 Review</li>
        </ol>
      </div>
      <div className="consult-card">
        {step===1&&<><small>STEP 1 OF 4</small><h2>Your information</h2><div className="form-grid"><input placeholder="Full name"/><input placeholder="Email address"/><input placeholder="Phone number"/><select><option>New client</option><option>Existing client</option></select><select><option>Preferred office</option><option>Abuja</option><option>Calabar</option></select></div></>}
        {step===2&&<><small>STEP 2 OF 4</small><h2>Tell us about your matter</h2><select><option>Area of legal service</option>{services.map(x=><option key={x}>{x}</option>)}</select><select><option>Urgency</option><option>Standard</option><option>Time-sensitive</option><option>Urgent</option></select><textarea rows={7} placeholder="Briefly describe your matter"/><label className="upload">Supporting documents (optional)<input type="file" multiple/></label></>}
        {step===3&&<><small>STEP 3 OF 4</small><h2>Choose your consultation</h2><div className="form-grid"><select><option>Consultation type</option><option>In person</option><option>Video call</option><option>Phone call</option></select><input type="date"/><select><option>Available time</option><option>10:00 AM</option><option>11:30 AM</option><option>1:00 PM</option><option>3:30 PM</option></select></div><p className="notice">Availability shown here is illustrative for the prototype. The production system will use Brix Legal's real availability rules.</p></>}
        {step===4&&<><small>STEP 4 OF 4</small><h2>Review & submit</h2><div className="review"><p><strong>Client details</strong><span>Information provided in Step 1</span></p><p><strong>Legal matter</strong><span>Practice area, urgency and matter description</span></p><p><strong>Consultation</strong><span>Selected mode, date and time</span></p></div><label className="consent"><input type="checkbox"/> I confirm that the information provided is accurate and understand that submission does not create a lawyer-client relationship until accepted by Brix Legal.</label></>}
        <div className="consult-actions">{step>1&&<button className="secondary" onClick={()=>setStep(step-1)}>Back</button>}<button onClick={()=>step<4?setStep(step+1):setDone(true)}>{step<4?"Continue":"Submit request"} <ArrowRight size={16}/></button></div>
      </div>
    </div>
  </main>
}