"use client";

import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUp, Award, BookOpenCheck, Briefcase, Building2, CalendarCheck, Clapperboard, Download, ExternalLink, Gavel, Handshake, HeartHandshake, Instagram, KeyRound, Landmark, Lightbulb, Linkedin, LockKeyhole, Mail, MapPin, Menu, MessageCircle, Milestone, Network, ReceiptText, Route, Scale, Scale3d, SearchCheck, Send, ShieldCheck, Target, Telescope, UserPlus, X, Zap } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

const reveal = { initial:{opacity:0,y:28}, whileInView:{opacity:1,y:0}, viewport:{once:true,amount:0.18}, transition:{duration:0.72,ease:[0.22,0.61,0.36,1]} } as const;
const navItems=[{href:"#about",label:"Why Brix Legal"},{href:"#mission",label:"Mission"},{href:"#practice",label:"Practice Areas"},{href:"#team",label:"Our Team"},{href:"#insights",label:"Insights"},{href:"#careers",label:"Careers"},{href:"#contact",label:"Contact"}];
const reasons=[
{id:"seamless-practice",title:"Seamless Practice",description:"We make your legal process as smooth and hassle-free as possible, from first consultation to final resolution.",icon:Route},
{id:"client-centred",title:"Client-Centred",description:"We pride ourselves on nurturing relationships, giving clients the best experience and ensuring partnership longevity.",icon:HeartHandshake},
{id:"legal-expertise",title:"Legal Expertise",description:"Informed guidance and opinions drawn from extensive experience across the corporate and commercial sector.",icon:Award},
{id:"legacy-building",title:"Legacy Building",description:"We structure your business, assets and agreements to stand the test of time and transition seamlessly.",icon:Landmark},
{id:"detail-oriented",title:"Detail-Oriented",description:"A thorough, meticulous approach crafted with care — so that no detail ever goes unnoticed.",icon:SearchCheck},
{id:"attorney-client-privilege",title:"Attorney-Client Privilege",description:"All confidential communications conducted to provide legal advice are duly and rigorously protected.",icon:LockKeyhole},
{id:"corporate-governance",title:"Corporate Governance",description:"We help businesses establish sound governance — accountability, transparency and compliance at every level.",icon:Building2},
{id:"quick-legal-solutions",title:"Quick Legal Solutions",description:"Prompt solutions when you need them — reach us by email, WhatsApp or a scheduled appointment.",icon:Zap}];
const practiceAreas=[
{title:"Corporate Practice",description:"Incorporation, structuring and lifecycle advisory.",icon:Building2},
{title:"Commercial Law",description:"Contracts, transactions and commercial advisory.",icon:Handshake},
{title:"Regulatory & Statutory Compliance",description:"Staying compliant with evolving regulation.",icon:ShieldCheck},
{title:"Alternative Dispute Resolution",description:"Arbitration, mediation and negotiated settlement.",icon:Scale},
{title:"Taxation Law",description:"Tax planning, advisory and compliance.",icon:ReceiptText},
{title:"Real Estate & Property Law",description:"Acquisition, title, leases and property counsel.",icon:KeyRound},
{title:"Employment Law",description:"Workforce policy, contracts and disputes.",icon:Briefcase},
{title:"Intellectual Property",description:"Trademarks, copyright and IP protection.",icon:Lightbulb},
{title:"Business Structuring & Management",description:"Governance frameworks and operational structure.",icon:Network},
{title:"Legacy Building",description:"Succession, estates and enduring structures.",icon:Milestone},
{title:"Media & Entertainment Law",description:"Rights, licensing and creative-industry counsel.",icon:Clapperboard},
{title:"Litigation",description:"Robust representation before the courts.",icon:Gavel},
{title:"Social Justice",description:"Advancing fairness and equitable outcomes.",icon:Scale3d},
{title:"General Legal Counsel",description:"Everyday advisory across your legal needs.",icon:BookOpenCheck}
];
const processSteps=[["01","Consultation","We listen first. Book a free consultation to share your matter."],["02","Assessment","We review the facts, risks and options in meticulous detail."],["03","Strategy","We design a clear, compliant path tailored to your goals."],["04","Execution","We handle filings, negotiations and representation on your behalf."],["05","Resolution","We deliver seamless outcomes designed to stand the test of time."]] as const;
const openRoles=[["Associate Counsel","Corporate & Commercial"],["Compliance Lead","Regulatory & Statutory"],["Litigation Associate","Dispute Resolution"],["Legal Intern","Trainee Programme"]] as const;
const testimonials=[{company:"Air Sea Freighters Ltd",initials:"AS",sector:"Logistics",quote:"Brix Legal excels in statutory compliance, and we highly recommend their services."},{company:"Vitamins Farm Ltd",initials:"VF",sector:"Agriculture",quote:"Brix Legal has consistently provided outstanding legal advisory, ensuring our legal protection at all times."},{company:"Now Now Dispatch",initials:"NN",sector:"Delivery",quote:"We have had a commendable experience with Brix Legal. We appreciate their expertise in the legal field."},{company:"Feed a Hungry Child Foundation",initials:"FH",sector:"Non-Profit",quote:"Brix Legal managed our incorporation quickly and efficiently — always available for consultation and seamless practice."},{company:"Body Type",initials:"BT",sector:"Wellness",quote:"We received outstanding legal advice from the Brix Legal team — it has been crucial to our growth as a business."},{company:"OA Rattan Ng.",initials:"OA",sector:"Manufacturing",quote:"Brix Legal has supported us from incorporation to compliance and counsel. We appreciate their attention to detail."},{company:"Xsealz Ltd",initials:"XZ",sector:"Trade",quote:"The legal process with Brix Legal has been seamless and hassle-free from start to finish."},{company:"Bélle by Brie",initials:"BB",sector:"Fashion",quote:"Brix Legal has been essential to our growth — they are our one-stop compliance hub."}];
const clientNames=testimonials.map(({company})=>company);
function Brand({compact=false}:{compact?:boolean}){return <span className={compact?"brand brand--compact":"brand"}><img src="/brix-legal-emblem.webp" alt="" aria-hidden="true"/><span><strong>Brix Legal</strong><small>Practice &amp; Consultancy</small></span></span>}
function SectionLabel({children}:{children:React.ReactNode}){const label=typeof children==="string"?children:"";const match=label.match(/^(\d{2})\s+(.+)$/);return <p className="section-label"><span className="section-label__mark">§{match?` ${match[1]}`:""}</span><span>{match?match[2]:children}</span></p>}
function Counter({value,suffix=""}:{value:number;suffix?:string}){const ref=useRef<HTMLSpanElement>(null);const inView=useInView(ref,{once:true,amount:.75});const [displayValue,setDisplayValue]=useState(0);useEffect(()=>{if(!inView)return;let frame=0;let startTime:number|undefined;const duration=1400;const animate=(time:number)=>{startTime??=time;const progress=Math.min((time-startTime)/duration,1);const eased=1-Math.pow(1-progress,3);setDisplayValue(Math.round(value*eased));if(progress<1)frame=requestAnimationFrame(animate)};frame=requestAnimationFrame(animate);return()=>cancelAnimationFrame(frame)},[inView,value]);return <span ref={ref}>{displayValue}{suffix&&<span className="counter__suffix">{suffix}</span>}</span>}
function Header(){const [menuOpen,setMenuOpen]=useState(false);const [scrolled,setScrolled]=useState(false);const [activeSection,setActiveSection]=useState("");useEffect(()=>{const h=()=>{setScrolled(window.scrollY>24);const offset=110;let current="";for(const item of navItems){const id=item.href.slice(1);const section=document.getElementById(id);if(section&&section.getBoundingClientRect().top<=offset)current=id}setActiveSection(current)};h();window.addEventListener("scroll",h,{passive:true});window.addEventListener("resize",h);return()=>{window.removeEventListener("scroll",h);window.removeEventListener("resize",h)}},[]);useEffect(()=>{document.body.style.overflow=menuOpen?"hidden":"";return()=>{document.body.style.overflow=""}},[menuOpen]);const closeMenu=()=>setMenuOpen(false);const activeStyle={color:"var(--orange-dark)",backgroundImage:"linear-gradient(var(--orange),var(--orange))",backgroundSize:"100% 2px",backgroundPosition:"left calc(100% + 9px)",backgroundRepeat:"no-repeat"};return <><header className={`site-header${scrolled?" site-header--scrolled":""}`}><a href="#home" aria-label="Brix Legal home" onClick={closeMenu}><Brand/></a><nav aria-label="Primary navigation">{navItems.map(item=>{const active=activeSection===item.href.slice(1);return <a key={item.href} href={item.href} aria-current={active?"page":undefined} style={active?activeStyle:undefined}>{item.label}</a>})}</nav><Link className="button button--primary header-booking" href="/consultation">Book Consultation</Link><button className="menu-toggle" type="button" aria-label="Open navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(true)}><Menu size={23}/></button></header><button className={`menu-backdrop${menuOpen?" is-open":""}`} type="button" aria-label="Close navigation" onClick={closeMenu}/><aside className={`mobile-menu${menuOpen?" is-open":""}`} aria-label="Mobile navigation"><div className="mobile-menu__head"><a href="#home" aria-label="Brix Legal home" onClick={closeMenu}><Brand compact/></a><button type="button" aria-label="Close navigation" onClick={closeMenu}><X size={23}/></button></div><nav>{navItems.map(item=><a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}</nav><Link className="button button--primary" href="/consultation" onClick={closeMenu}>Book Consultation</Link></aside></>}
function Hero(){return <section id="home" className="hero"><div className="hero__copy"><motion.div {...reveal}><SectionLabel>Brix Legal · Est. Nigeria</SectionLabel></motion.div><motion.h1 {...reveal}>For seamless <em>legal practice</em>, built to outlast today.</motion.h1><motion.p {...reveal} className="hero__lead">A multidisciplinary law firm delivering detail-driven corporate, commercial and compliance counsel to local and international clients — with the care of a partner and the precision of a specialist.</motion.p><motion.div {...reveal} className="button-row"><Link className="button button--primary" href="/consultation">Book Consultation <ArrowRight size={17}/></Link><a className="button button--outline" href="#practice">Our Services</a></motion.div><motion.div {...reveal} className="hero__stats"><div><strong>14</strong><span>Areas of practice</span></div><div><strong>2</strong><span>Offices · Abuja &amp; Calabar</span></div><div><strong>100%</strong><span>Client confidentiality</span></div></motion.div></div><motion.div {...reveal} className="hero__visual"><img className="hero__watermark" src="/reference-image-1.png" alt="" aria-hidden="true"/><div className="hero__portrait"><img className="hero__photo" src="/reference-image-3.webp" alt="Briana A. Akpagu Esq., Principal Partner of Brix Legal"/><div className="hero__identity"><img src="/brix-legal-emblem.webp" alt="" aria-hidden="true"/><span><strong>Briana A. Akpagu</strong><small>Principal Partner · ACArb · DCP</small></span></div></div></motion.div></section>}
function ClientTicker(){const repeatedNames=[...clientNames,...clientNames];return <section className="client-ticker" aria-label="Trusted clients"><p>Trusted by esteemed clients</p><div className="client-ticker__window"><div className="client-ticker__track">{repeatedNames.map((name,index)=><span key={`${name}-${index}`}>{name}</span>)}</div></div></section>}
function AboutFirm(){return <section id="about-firm" className="section about-firm"><div className="about-firm__grid"><motion.div {...reveal} className="about-firm__intro"><SectionLabel key="label">01 About the firm</SectionLabel><p key="lead" className="about-firm__lead">Brix Legal Practice and Consultancy is a multidisciplinary law firm — providing{" "}<em>informed consultation and excellent legal services</em> to both local and international clients.</p></motion.div><motion.div {...reveal} className="about-firm__copy"><p>We specialise in corporate practice, statutory compliance, commercial law, real estate, taxation, intellectual property and alternative dispute resolution — combining deep sector experience with a genuinely client-centred approach.</p><p>Our work goes beyond the matter in front of us. We structure your business, assets and agreements to stand the test of time, ensuring what you build outlasts you and transitions seamlessly to those you intend to benefit — legacy building, done right.</p><div className="signature"><div><strong>Briana A. Akpagu</strong><span>Principal Partner, Brix Legal</span></div></div></motion.div></div><motion.div {...reveal} className="about-firm__metrics"><div><strong><Counter value={14}/></strong><span>Areas of practice</span></div><div><strong><Counter value={2}/></strong><span>Offices — Abuja &amp; Calabar</span></div><div><strong><Counter value={200} suffix="+"/></strong><span>Esteemed clients served</span></div><div><strong><Counter value={100} suffix="%"/></strong><span>Confidential &amp; privileged</span></div></motion.div></section>}
function WhyBrix(){return <section id="about" className="section section--tint why-brix"><motion.div className="why-brix__heading" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1]}}><SectionLabel key="label">02 Why Brix Legal</SectionLabel><h2 key="heading">The advantages of a firm that treats your matter as its own.</h2><p key="intro" className="section-intro">We&apos;re here to make your legal process as smooth and hassle-free as possible — because we truly value our clients.</p></motion.div><div className="reason-grid">{reasons.map(({id,title,description,icon:Icon},index)=><motion.article key={id} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.8,ease:[.16,1,.3,1],delay:.04+(index*.06)}}><span key={`${id}-icon`} className="reason-grid__icon"><Icon size={22} strokeWidth={1.9}/></span><h3 key={`${id}-title`}>{title}</h3><p key={`${id}-description`}>{description}</p></motion.article>)}</div></section>}
function MissionVision(){return <section id="mission" className="section mission"><div className="mission__inner"><motion.div className="mission__heading" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1]}}><SectionLabel key="label">03 What drives us</SectionLabel><h2 key="heading">Mission &amp; Vision</h2></motion.div><motion.div className="mission__grid" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1],delay:.08}}><article key="mission" className="mission__panel"><div className="mission__kicker"><Target size={20} strokeWidth={1.9}/> Our Mission</div><p>To provide seamless, detail-driven legal services that empower local and international clients to navigate statutory compliance, corporate, commercial and tax laws — while promoting alternative dispute resolution and advancing social justice.</p></article><article key="vision" className="mission__panel mission__vision"><div className="mission__kicker"><Telescope size={20} strokeWidth={1.9}/> Our Vision</div><p>To be a trusted global legal partner known for excellence, innovation and integrity — championing client satisfaction and contributing meaningfully to a just and equitable society.</p></article></motion.div></div></section>}
function PracticeAreas(){return <section id="practice" className="section section--tint practice"><div className="practice__inner"><motion.div className="practice__heading" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1]}}><SectionLabel key="label">04 Expertise &amp; Services</SectionLabel><h2 key="heading">Fourteen areas of practice, one standard of care.</h2><p key="intro" className="section-intro">Multidisciplinary counsel across the matters that shape and protect Nigerian and international businesses.</p></motion.div><div className="practice__grid">{practiceAreas.map(({title,description,icon:Icon},index)=><motion.article key={title} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.8,ease:[.16,1,.3,1],delay:index<8?.04+(index*.06):0}}><span key={`${title}-icon`} className="practice__icon"><Icon size={21} strokeWidth={1.9}/></span><div key={`${title}-content`}><h3>{title}</h3><p>{description}</p></div></motion.article>)}</div></div></section>}
function Process(){return <section id="process" className="section process"><div className="process__inner"><motion.div className="process__heading" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1]}}><SectionLabel key="label">05 How we work</SectionLabel><h2 key="heading">A clear path from first call to lasting outcome.</h2></motion.div><div className="process__steps">{processSteps.map(([number,title,description],index)=><motion.article key={`process-${number}`} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.8,ease:[.16,1,.3,1],delay:.04+(index*.06)}}><span key={`process-${number}-number`}>§ {number}</span><h3 key={`process-${number}-title`}>{title}</h3><p key={`process-${number}-description`}>{description}</p></motion.article>)}</div></div></section>}
function Team(){return <section id="team" className="team"><div className="team__inner"><div className="team__principal"><motion.div className="team__portrait" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1]}}><img src="/reference-image-5.webp" alt="Portrait of Briana A. Akpagu Esq., Principal Partner"/><span className="team__portrait-frame" aria-hidden="true"/></motion.div><motion.div className="team__copy" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1],delay:.08}}><SectionLabel>06 Meet the Principal Partner</SectionLabel><h2>Briana A. Akpagu <em>Esq.</em></h2><div className="team__credentials"><span>Principal Partner</span><span>ACArb</span><span>DCP</span><span>Corporate &amp; Commercial Law</span></div><div className="team__bio"><p>Briana leads Brix Legal with a commitment to excellence, integrity and seamless client service. An Associate of the Chartered Institute of Arbitrators (ACArb) and a Data Compliance Professional (DCP), her practice spans corporate governance, statutory compliance, taxation and legacy building.</p><p>She helps clients navigate complexity with clarity and confidence — turning legal process into a genuine advantage for the businesses and individuals she represents, at home and abroad.</p></div><div className="team__links"><a className="team__linkedin" href="https://www.linkedin.com/in/brianaakpagu" target="_blank" rel="noreferrer"><Linkedin size={17} strokeWidth={1.9}/> Connect on LinkedIn</a><Link className="team__consultation" href="/consultation">Book a consultation <ArrowRight size={16} strokeWidth={1.9}/></Link></div></motion.div></div><div className="growing-team"><motion.div className="growing-team__heading" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1]}}><SectionLabel>Growing team</SectionLabel><h2>Room for exceptional people.</h2><p>As Brix Legal grows, so does our bench. These seats are reserved for dedicated professionals who share our standard.</p></motion.div><div className="role-grid">{openRoles.map(([role,department],index)=><motion.article key={role} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.8,ease:[.16,1,.3,1],delay:.04+(index*.06)}}><span key={`${role}-avatar`} className="role-grid__avatar" aria-hidden="true"><UserPlus size={30} strokeWidth={1.9}/></span><h3 key={`${role}-title`}>{role}</h3><p key={`${role}-department`}>{department}</p><span key={`${role}-status`} className="role-grid__status">Position open</span></motion.article>)}</div></div></div></section>}
function Testimonials(){
  const viewportRef=useRef<HTMLDivElement>(null);
  const trackRef=useRef<HTMLDivElement>(null);
  const [activePage,setActivePage]=useState(0);
  const [perView,setPerView]=useState(3);
  const [shift,setShift]=useState(0);
  const [paused,setPaused]=useState(false);
  const [cycleKey,setCycleKey]=useState(0);
  const pageCount=Math.ceil(testimonials.length/perView);

  useEffect(()=>{
    const updatePerView=()=>setPerView(window.innerWidth<=620?1:window.innerWidth<=1080?2:3);
    updatePerView();
    window.addEventListener("resize",updatePerView);
    return()=>window.removeEventListener("resize",updatePerView);
  },[]);

  useEffect(()=>{
    setActivePage(page=>Math.min(page,pageCount-1));
  },[pageCount]);

  useEffect(()=>{
    const viewport=viewportRef.current;
    const track=trackRef.current;
    if(!viewport||!track)return;
    const updateShift=()=>{
      const firstCard=track.firstElementChild as HTMLElement|null;
      if(!firstCard)return;
      const cardStep=firstCard.getBoundingClientRect().width+24;
      const maxShift=Math.max(0,track.scrollWidth-viewport.clientWidth);
      setShift(Math.min(activePage*perView*cardStep,maxShift));
    };
    updateShift();
    const observer=new ResizeObserver(updateShift);
    observer.observe(viewport);
    return()=>observer.disconnect();
  },[activePage,perView]);

  useEffect(()=>{
    if(paused||pageCount<=1||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const timer=window.setInterval(()=>setActivePage(page=>(page+1)%pageCount),5500);
    return()=>window.clearInterval(timer);
  },[cycleKey,pageCount,paused]);

  const goToPage=(page:number)=>{
    setActivePage((page+pageCount)%pageCount);
    setCycleKey(value=>value+1);
  };

  return <section id="clients" className="section testimonials"><div className="testimonials__inner"><motion.div className="testimonials__heading" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1]}}><SectionLabel>07 Some of our esteemed clients</SectionLabel><h2>The measure of seamless practice.</h2></motion.div><motion.div className="testimonials__carousel" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1],delay:.08}} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}><div ref={viewportRef} className="testimonials__viewport"><div ref={trackRef} className="testimonials__track" style={{transform:`translateX(-${shift}px)`}}>{testimonials.map(testimonial=><article className="testimonial-card" key={testimonial.company}><div className="testimonial-card__quote" aria-hidden="true">“</div><p>{testimonial.quote}</p><div className="testimonial-card__client"><span>{testimonial.initials}</span><div><strong>{testimonial.company}</strong><small>{testimonial.sector}</small></div></div></article>)}</div></div><div className="testimonials__controls"><div className="testimonials__dots" aria-label="Testimonial pages">{Array.from({length:pageCount},(_,index)=><button className={activePage===index?"is-active":""} type="button" key={`testimonial-page-${index}`} aria-label={`Show testimonial page ${index+1}`} aria-current={activePage===index?"true":undefined} onClick={()=>goToPage(index)}/>)}</div><div><button type="button" aria-label="Previous testimonials" onClick={()=>goToPage(activePage-1)}><ArrowLeft size={19} strokeWidth={1.9}/></button><button type="button" aria-label="Next testimonials" onClick={()=>goToPage(activePage+1)}><ArrowRight size={19} strokeWidth={1.9}/></button></div></div></motion.div></div></section>
}
function Insights(){return <section id="insights" className="insights"><div className="insights__inner"><motion.div className="insights__heading" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1]}}><SectionLabel>08 News, Publications &amp; Insights</SectionLabel><h2>Practical legal thinking, freely shared.</h2></motion.div><div className="insights__grid"><motion.article className="insights__feature" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1]}}><img className="insights__watermark" src="/reference-image-1.png" alt="" aria-hidden="true"/><div><span className="insights__tag">Featured · Downloadable Guide</span><h3>A Simple Guide to Starting a Non-Profit Organization in Nigeria</h3><p>By Briana A. Akpagu Esq., ACArb, DCP — a step-by-step primer on incorporating and running a compliant non-profit in Nigeria.</p></div><a className="insights__download" href="https://selar.com/101514" target="_blank" rel="noreferrer">Download on Selar <Download size={17} strokeWidth={1.9}/></a></motion.article><div className="insights__side"><motion.article className="insights__mini" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1],delay:.08}}><span className="insights__tag"><Linkedin size={16} strokeWidth={1.9}/> LinkedIn</span><h3>Follow our latest legal updates</h3><p>Regulatory notes, compliance reminders and firm news.</p><a className="insights__link" href="https://www.linkedin.com/company/brix-legal-practice-consultancy/" target="_blank" rel="noreferrer">Visit our page <ExternalLink size={16} strokeWidth={1.9}/></a></motion.article><motion.article className="insights__mini" initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1],delay:.16}}><span className="insights__tag"><Instagram size={16} strokeWidth={1.9}/> Instagram</span><h3>@brixlegal.ng</h3><p>Bite-sized legal insight for founders and businesses.</p><a className="insights__link" href="https://www.instagram.com/brixlegal.ng" target="_blank" rel="noreferrer">See our posts <ExternalLink size={16} strokeWidth={1.9}/></a></motion.article></div></div></div></section>}
function Careers() {
  return (
    <section id="careers" className="careers">
      <div className="careers__inner">
        <motion.div
          className="careers__panel"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel>09 Join the team</SectionLabel>
          <h2>Build your legal career with Brix Legal.</h2>
          <p>
            We welcome applications from dedicated, hard-working individuals who want to grow with a firm that values detail, integrity and seamless service. To apply, send your resume to <strong>brixlegal@gmail.com</strong>.
          </p>
          <div className="careers__buttons">
            <a
              className="careers__button careers__button--primary"
              href="mailto:brixlegal@gmail.com?subject=Application%20%E2%80%94%20Brix%20Legal%20Careers"
            >
              Send your resume <Send aria-hidden="true" />
            </a>
            <a className="careers__button careers__button--ghost" href="#practice">
              See our practice
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
function Contact() {
  const sendEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const area = String(data.get("area") ?? "General Legal Counsel");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(`Consultation enquiry — ${area}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nArea of interest: ${area}\n\n${message}`);
    window.location.href = `mailto:brixlegal@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="contact">
      <div className="contact__inner">
        <motion.div
          className="contact__heading"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel>10 Get in touch</SectionLabel>
          <h2>Let&apos;s make your legal process seamless.</h2>
          <p>Reach us by email, WhatsApp, or schedule an appointment — we&apos;ll respond promptly.</p>
        </motion.div>

        <div className="contact__grid">
          <motion.div
            className="contact__information"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <article className="contact__office">
              <h3><MapPin aria-hidden="true" /> Abuja Office</h3>
              <address>Mabushi, Abuja,<br />Federal Capital Territory, Nigeria</address>
            </article>
            <article className="contact__office">
              <h3><MapPin aria-hidden="true" /> Calabar Office</h3>
              <address>Brix Plaza, 2nd Floor, Parliamentary Extension,<br />Calabar, Cross River State, Nigeria</address>
            </article>

            <div className="contact__lines">
              <div className="contact__line">
                <Mail aria-hidden="true" />
                <div><span>Email</span><a href="mailto:brixlegal@gmail.com">brixlegal@gmail.com</a></div>
              </div>
              <div className="contact__line">
                <MessageCircle aria-hidden="true" />
                <div><span>WhatsApp</span><a href="https://wa.me/2349038103995" target="_blank" rel="noreferrer">+234 903 810 3995</a></div>
              </div>
              <div className="contact__line">
                <CalendarCheck aria-hidden="true" />
                <div><span>Book a consultation</span><Link href="/consultation">Book on this website</Link></div>
              </div>
            </div>

            <div className="contact__socials">
              <a href="https://www.linkedin.com/company/brix-legal-practice-consultancy/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin aria-hidden="true" /></a>
              <a href="https://www.instagram.com/brixlegal.ng" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram aria-hidden="true" /></a>
              <a href="https://wa.me/2349038103995" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle aria-hidden="true" /></a>
              <a href="mailto:brixlegal@gmail.com" aria-label="Email"><Mail aria-hidden="true" /></a>
            </div>
          </motion.div>

          <motion.div
            className="contact__book-card"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          >
            <h3>Request a consultation</h3>
            <p>Tell us briefly about your matter and we&apos;ll get back to you. Prefer to pick a time now? Use the booking link.</p>
            <form noValidate onSubmit={sendEnquiry}>
              <div className="contact__field">
                <label htmlFor="contact-name">Full name</label>
                <input id="contact-name" name="name" type="text" placeholder="Your name" required />
              </div>
              <div className="contact__field">
                <label htmlFor="contact-email">Email address</label>
                <input id="contact-email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="contact__field">
                <label htmlFor="contact-area">Area of interest</label>
                <select id="contact-area" name="area">
                  <option>Corporate Practice</option>
                  <option>Commercial Law</option>
                  <option>Regulatory &amp; Compliance</option>
                  <option>Taxation</option>
                  <option>Real Estate &amp; Property</option>
                  <option>Dispute Resolution</option>
                  <option>Intellectual Property</option>
                  <option>General Legal Counsel</option>
                </select>
              </div>
              <div className="contact__field">
                <label htmlFor="contact-message">How can we help?</label>
                <textarea id="contact-message" name="message" placeholder="Briefly describe your matter…" />
              </div>
              <button className="contact__submit" type="submit">Send enquiry <ExternalLink aria-hidden="true" /></button>
              <p className="contact__form-note">This opens your email app addressed to Brix Legal.</p>
            </form>

            <div className="contact__newsletter">
              <h4>Sign up for email updates</h4>
              <p>Occasional legal insight and firm news — no spam.</p>
              <div className="contact__newsletter-row">
                <input type="text" placeholder="Name" aria-label="Name" />
                <input type="email" placeholder="Email" aria-label="Email" />
                <a href="https://brix-legal-practice-and-consultancy.kit.com/ccbf343215" target="_blank" rel="noreferrer">Subscribe</a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
function Footer(){return <footer className="footer"><Brand/><div><a href="#about">About</a><a href="#practice">Practice Areas</a><a href="#team">Team</a><a href="#careers">Careers</a><a href="#contact">Contact</a></div><p>© {new Date().getFullYear()} Brix Legal Practice &amp; Consultancy. All rights reserved.</p></footer>}
function WhatsAppButton(){return <a className="floating-whatsapp" href="https://wa.me/2349038103995" target="_blank" rel="noreferrer" aria-label="Chat with Brix Legal on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg></a>}
function ScrollTop(){const [visible,setVisible]=useState(false);useEffect(()=>{const onScroll=()=>setVisible(window.scrollY>600);onScroll();window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll)},[]);return <button className={`to-top${visible?" show":""}`} type="button" aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}><ArrowUp size={20} strokeWidth={1.9}/></button>}
export default function Home(){return <main><Header/><Hero/><ClientTicker/><AboutFirm/><WhyBrix/><MissionVision/><PracticeAreas/><Process/><Team/><Testimonials/><Insights/><Careers/><Contact/><Footer/><WhatsAppButton/><ScrollTop/></main>}
