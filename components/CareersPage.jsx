"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CareersPage(){
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    areaOfInterest: "Production & Operations",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [openings, setOpenings] = useState([]);

  useEffect(() => {
    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => {
        if (data.jobs) {
          setOpenings(data.jobs.filter(j => j.status === "active"));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: data.message || "Application submitted successfully!" });
        setFormData({
          name: "",
          email: "",
          phone: "",
          areaOfInterest: "Production & Operations",
          message: ""
        });
      } else {
        setResult({ success: false, message: data.error || "Failed to submit application." });
      }
    } catch {
      setResult({ success: false, message: "Server connection error. Please email us your resume." });
    } finally {
      setSubmitting(false);
    }
  };

  return (<>

<div className="scroll-progress" id="scrollProgress"></div>

<section className="page-title">
<div className="container">
<span>career</span>
<h1>Build your career where <br />manufacturing moves forward.</h1>
<p>
                    Join a textile organisation focused on learning, responsibility, teamwork and long-term growth.
                </p>
</div>
</section>


<section className="career-full-w">
<div className="container career-grid">
<article>
<span>01</span>
<h3>Learning</h3>
<p>Training and guidance to strengthen professional capability.</p>
</article>
<article>
<span>02</span>
<h3>Ownership</h3>
<p>A culture that encourages responsibility and initiative.</p>
</article>
<article>
<span>03</span>
<h3>Collaboration</h3>
<p>Teams working together across manufacturing and business functions.</p>
</article>
<article>
<span>04</span>
<h3>Growth</h3>
<p>Opportunities for personal development and long-term contribution.</p>
</article>
</div>
</section>
{openings.length > 0 && (
  <section style={{ padding: "60px 0 20px 0", background: "#f8fafc" }}>
    <div className="container">
      <div className="kicker" style={{ color: "#2c9242", marginBottom: "8px" }}>CURRENT OPENINGS</div>
      <h2 style={{ marginBottom: "28px" }}>Explore Career Opportunities</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {openings.map(job => (
          <div key={job.id} style={{ background: "#fff", borderRadius: "10px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <span style={{ background: "#e8f5e9", color: "#15933a", fontSize: "12px", fontWeight: "700", padding: "4px 8px", borderRadius: "4px" }}>
              {job.department}
            </span>
            <h3 style={{ fontSize: "18px", margin: "12px 0 6px 0", color: "#111827" }}>{job.title}</h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 12px 0" }}>
              📍 {job.location} &nbsp;|&nbsp; ⏱ {job.experience} &nbsp;|&nbsp; {job.type}
            </p>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.5", margin: "0 0 16px 0" }}>
              {job.description}
            </p>
            <a
              href="#form"
              onClick={() => setFormData(prev => ({ ...prev, areaOfInterest: job.department, message: `Applying for ${job.title}...` }))}
              style={{ display: "inline-block", background: "#15933a", color: "#fff", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}
            >
              Apply for this Role ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
)}

<section className="enquiry" id="form">
<div className="container enquiry-grid">
<div>
<div className="kicker" style={{color: "#2c9242"}}>Opportunities</div>
<h2>We are always interested<br /></h2>
<p>
   Share your profile for opportunities across Production & Operations, Quality, Technical, Sales,
   Customer Relations, Administration and Support functions.
</p>
</div>
<form onSubmit={handleSubmit}>
{result && (
  <div style={{
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
    background: result.success ? "rgba(21, 147, 58, 0.15)" : "rgba(220, 38, 38, 0.15)",
    border: `1px solid ${result.success ? "#15933a" : "#dc2626"}`,
    color: result.success ? "#15933a" : "#dc2626",
    fontSize: "14px",
    fontWeight: "500"
  }}>
    <i className={result.success ? "fa-solid fa-circle-check" : "fa-solid fa-triangle-exclamation"} style={{ marginRight: "8px" }}></i>
    {result.message}
  </div>
)}
<label>Your Name *<input type="text" required placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></label>
<div className="two">
<label>Email Address<input type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></label><label>Phone Number *<input type="tel" required placeholder="+91" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></label>
</div>
<label>Area of Interest<select value={formData.areaOfInterest} onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}>
<option value="Production & Operations">Production & Operations</option>
<option value="Quality">Quality</option>
<option value="Technical">Technical</option>
<option value="Sales & Customer Relations">Sales & Customer Relations</option>
<option value="Administration">Administration</option>
</select></label><label>Your Message / Experience<textarea rows="5" placeholder="Tell us about your experience..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}></textarea></label><button type="submit" disabled={submitting}>{submitting ? "SUBMITTING..." : "SUBMIT APPLICATION"} <span>↗</span></button>
</form>
</div>
</section>
<section className="inner-cta">
<div className="container career-box-warp" data-animate="up">
<h2>We're Always Hiring Great Talent</h2>
<p>The openings above aren't the only opportunities at KRISHNA FASHION. If you believe your skills can make an impact, we'd love to hear from you. Send us your resume, and we'll contact you when a suitable position becomes available.</p>
<a href="mailto:info@krishnafashion.co" className="btn btn-dark">APPLY NOW<span>↗</span></a>
</div>
</section>

<a className="whatsapp-btn" href="https://wa.me/918980982777" target="_blank" rel="noopener"><span className="whatsapp-icon"><i className="fa-brands fa-whatsapp"></i></span><span className="whatsapp-text">WhatsApp</span></a>
<button className="back-top" id="backTop"><i className="fa-solid fa-arrow-up"></i></button>


</>);
}
