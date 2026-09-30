"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactUsPage(){
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Product Inquiry",
    message: ""
  });
  const [selectedLocation, setSelectedLocation] = useState("office");

  const locations = {
    office: {
      name: "Corporate Head Office",
      address: "B-306, International Commerce Centre (ICC Building), Ring Road, Surat – 395002, Gujarat, India",
      phone: "+91 89809 82777 / +91 99586 35125",
      timing: "Mon - Sat: 9:30 AM - 7:30 PM",
      mapUrl: "https://www.google.com/maps?q=International%20Commerce%20Centre%20Ring%20Road%20Surat%20395002&output=embed",
      directUrl: "https://www.google.com/maps/search/?api=1&query=International+Commerce+Centre+Ring+Road+Surat+395002"
    },
    plant1: {
      name: "Plant 01 (Circular Knitting Facility)",
      address: "P. No. 1 to 3, B. No. 96, Varethi Gam Road, Nr. Moulwand Patia, Vill. Karanj, Dist. Surat, Gujarat, India",
      phone: "+91 89809 82777",
      timing: "24/7 Manufacturing Operations",
      mapUrl: "https://www.google.com/maps?q=Varethi+Gam+Road+Karanj+Surat+Gujarat&output=embed",
      directUrl: "https://www.google.com/maps/search/?api=1&query=Varethi+Gam+Road+Karanj+Surat+Gujarat"
    },
    plant2: {
      name: "Plant 02 (Warp Knitting Facility)",
      address: "P. No. 9 to 18, B. No. 95, Varethi Gam Road, Nr. Molvand Patia, Vill. Karanj, Tal. Mandvi, Dist. Surat, Gujarat, India",
      phone: "+91 89809 82777",
      timing: "24/7 Manufacturing Operations",
      mapUrl: "https://www.google.com/maps?q=Mandvi+Surat+Gujarat+India&output=embed",
      directUrl: "https://www.google.com/maps/search/?api=1&query=Varethi+Gam+Road+Karanj+Tal+Mandvi+Surat+Gujarat"
    }
  };

  const activeLoc = locations[selectedLocation];
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: data.message || "Enquiry sent successfully!" });
        setFormData({
          name: "",
          email: "",
          phone: "",
          inquiryType: "Product Inquiry",
          message: ""
        });
      } else {
        setResult({ success: false, message: data.error || "Failed to submit enquiry. Please check your details." });
      }
    } catch {
      setResult({ success: false, message: "Unable to connect to server. Please call or WhatsApp us directly." });
    } finally {
      setSubmitting(false);
    }
  };

  return (<>

<div className="scroll-progress" id="scrollProgress"></div>

<section className="inner-hero" style={{backgroundImage: "url(/assets/images/contact-banner.jpg)"}}>
<div className="inner-hero-overlay"></div>
<div className="container inner-hero-content" data-animate="up">
<div className="kicker">Let’s start a conversation.</div>
<h1>Contact Us</h1>
<p>
                    For product enquiries, manufacturing discussions and business opportunities, connect with Krishna
                    Fashion.
                </p>
</div>
</section>

<section className="contacts">
<div className="container">
<div className="section-head">
<div>
<div className="kicker" style={{color: "#2c9242"}}>CONTACT INFORMATION</div>
<h2>Krishna Fashion</h2>
</div>
</div>
<div className="cards">
<article>
<h3>Office</h3>
<p>
                            B-306, International Commerce Centre (ICC Building),<br />Nr. Kadiwala School, Opp. Civil
                            Hospital,<br />Ring Road, Surat – 395002,<br />Gujarat, India
                        </p>
<div className="call-detail-box">
<p>
<small>HIMANSHU MITTAL</small><br />
<a href="tel:+918980982777">+91 89809 82777</a>
</p>
<p>
<small>KESHAV CHOUDHARY </small><br />
<a href="tel:+919958635125">+91 99586 35125</a>
</p>
<p>
<small>EMAIL</small><br />
<a href="mailto:info@krishnafashion.co">info@krishnafashion.co</a>
</p>
</div>
<a className="map-link" target="_blank" href="https://www.google.com/maps/search/?api=1&amp;query=B-306+International+Commerce+Centre+Ring+Road+Surat+395002">VIEW ON MAP ↗</a>
</article>
<article>
<h3>Plant 01</h3>
<p>
                            P. No. 1 to 3, B. No. 96,<br />Varethi Gam Road, Nr. Moulwand Patia,<br />Vill. Karanj,
                            Dist. Surat,<br />Gujarat, India
                        </p>
<a className="map-link" target="_blank" href="https://www.google.com/maps/search/?api=1&amp;query=Varethi+Gam+Road+Karanj+Surat+Gujarat">VIEW ON MAP ↗</a>
</article>
<article>
<h3>Plant 02</h3>
<p>
                            P. No. 9 to 18, B. No. 95,<br />Varethi Gam Road, Nr. Molvand Patia,<br />Vill. Karanj, Tal.
                            Mandvi, Dist. Surat,<br />Gujarat, India
                        </p>
<a className="map-link" target="_blank" href="https://www.google.com/maps/search/?api=1&amp;query=Varethi+Gam+Road+Karanj+Surat+Gujarat">VIEW ON MAP ↗</a>
</article>
</div>
</div>
</section>
<section className="map" style={{ padding: "40px 0 60px", background: "#f8fafc" }}>
  <div className="container">
    <div style={{ textAlign: "center", marginBottom: "24px" }}>
      <div className="kicker" style={{ color: "#2c9242", marginBottom: "8px" }}>LOCATE US</div>
      <h2 style={{ fontSize: "32px", margin: "0 0 12px 0" }}>Visit Our Offices & Manufacturing Plants</h2>
      <p style={{ maxWidth: "600px", margin: "0 auto 20px auto", color: "#64748b", fontSize: "15px" }}>
        Strategically situated in Surat, India's textile capital, with direct highway connectivity.
      </p>

      {/* Location Switcher Buttons */}
      <div style={{ display: "inline-flex", background: "#e2e8f0", padding: "4px", borderRadius: "10px", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          type="button"
          onClick={() => setSelectedLocation("office")}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            border: "none",
            background: selectedLocation === "office" ? "#15933a" : "transparent",
            color: selectedLocation === "office" ? "#fff" : "#475569",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          📍 Surat Head Office (ICC)
        </button>
        <button
          type="button"
          onClick={() => setSelectedLocation("plant1")}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            border: "none",
            background: selectedLocation === "plant1" ? "#15933a" : "transparent",
            color: selectedLocation === "plant1" ? "#fff" : "#475569",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          🏭 Plant 01 (Circular Knitting)
        </button>
        <button
          type="button"
          onClick={() => setSelectedLocation("plant2")}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            border: "none",
            background: selectedLocation === "plant2" ? "#15933a" : "transparent",
            color: selectedLocation === "plant2" ? "#fff" : "#475569",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          🏭 Plant 02 (Warp Knitting)
        </button>
      </div>
    </div>

    {/* Map Container & Address Card */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)", background: "#fff", border: "1px solid #e2e8f0" }}>
      <div style={{ position: "relative", width: "100%", height: "480px" }}>
        <iframe
          src={activeLoc.mapUrl}
          style={{ width: "100%", height: "100%", border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={activeLoc.name}
        />
        <div style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          right: "16px",
          maxWidth: "480px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          padding: "16px 20px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          border: "1px solid #cbd5e1"
        }}>
          <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#0f172a", fontWeight: "700" }}>{activeLoc.name}</h4>
          <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#475569", lineHeight: "1.4" }}>{activeLoc.address}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", fontSize: "12px" }}>
            <span style={{ color: "#15933a", fontWeight: "600" }}>📞 {activeLoc.phone}</span>
            <a
              href={activeLoc.directUrl}
              target="_blank"
              rel="noreferrer"
              style={{ background: "#15933a", color: "#fff", padding: "6px 12px", borderRadius: "6px", textDecoration: "none", fontWeight: "600", fontSize: "12px" }}
            >
              Get Directions ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="enquiry" id="form">
<div className="container enquiry-grid">
<div>
<div className="kicker" style={{color: "#2c9242"}}>SEND AN ENQUIRY</div>
<h2>Tell us what<br />you’re looking for.</h2>
<p>
                        Share your requirement and contact details. Our team can connect with you regarding products,
                        manufacturing capabilities or business enquiries.
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
<label>Inquiry Type<select value={formData.inquiryType} onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}>
<option value="Product Inquiry">Product Inquiry</option>
<option value="Manufacturing Inquiry">Manufacturing Inquiry</option>
<option value="Business Inquiry">Business Inquiry</option>
<option value="Career">Career</option>
<option value="Other">Other</option>
</select></label><label>Your Message<textarea rows="5" placeholder="Tell us about your requirement..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}></textarea></label><button type="submit" disabled={submitting}>{submitting ? "SENDING..." : "SEND ENQUIRY"} <span>↗</span></button>
</form>
</div>
</section>

<a className="whatsapp-btn" href="https://wa.me/918980982777" target="_blank" rel="noopener"><span className="whatsapp-icon"><i className="fa-brands fa-whatsapp"></i></span><span className="whatsapp-text">WhatsApp</span></a>
<button className="back-top" id="backTop"><i className="fa-solid fa-arrow-up"></i></button>


</>);
}
