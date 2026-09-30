"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function WarpKnittingPage(){
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Enquiry form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Product Inquiry",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/api/products?category=warp")
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
        }
      })
      .catch(err => console.error("Error fetching warp fabrics:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectProduct = (prod) => {
    setFormData(prev => ({
      ...prev,
      inquiryType: "Product Inquiry",
      message: `Enquiring regarding Warp Knit: ${prod.name} (${prod.gsm}, ${prod.composition}). Please share technical data sheet and bulk quotes.`
    }));
    const el = document.getElementById("form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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
        setResult({ success: false, message: data.error || "Failed to submit enquiry." });
      }
    } catch {
      setResult({ success: false, message: "Server connection error. Please contact us on WhatsApp." });
    } finally {
      setSubmitting(false);
    }
  };

  return (<>

<div className="scroll-progress" id="scrollProgress"></div>

<section className="kf-single-product-hero">

<div className="kf-single-product-hero__bg"></div>
<div className="kf-single-product-hero__container">

<div className="kf-single-product-hero__content">
<div className="kf-single-product-hero__label">
<span></span>
                       Next-Gen Technology
                    </div>
<h1 className="kf-single-product-hero__title">Warp Knitting</h1>
<p className="kf-single-product-hero__description">
                       Advanced technology and precision-driven processes enable us to produce high-quality fabrics with consistent results, improved efficiency, and greater versatility.
                    </p>
</div>

<div className="kf-single-product-hero__visual">
<img src="/assets/images/warp_knitting01.png" alt="Circular Knitting" className="kf-single-product-hero__product" />
</div>
</div>
</section>
<section className="intro" style={{paddingBottom: "0px"}}>
<div className="container">
<div className="intro-grid" data-animate="up">
<div><div className="kicker" style={{color: "var(--green)"}}>Our Capabilities</div>
<h2>Technical Construction. Enhanced Stability.</h2>
</div>
<div>
<p className="bigcopy">Our warp knitting capabilities complement our circular knitting operations, allowing KRISHNA FASHION to manufacture fabrics with distinctive structural and performance characteristics.</p>
<p>Warp knitted fabrics can provide specific advantages in applications where dimensional stability, construction integrity, surface aesthetics and technical performance are critical.</p>
<p>The combination of circular and warp knitting gives KRISHNA FASHION a broader manufacturing portfolio and greater flexibility in responding to customer requirements.</p>
</div>
</div>
</div>
</section>

{/* DYNAMIC API PRODUCT CATALOG SECTION FOR WARP KNITTING */}
<section style={{ padding: "80px 0 60px 0", background: "#f8fafc" }}>
  <div className="container">
    <div style={{ textAlign: "center", marginBottom: "40px" }}>
      <div className="kicker" style={{ color: "#2c9242", marginBottom: "8px" }}>LIVE FABRIC CATALOG</div>
      <h2 style={{ fontSize: "34px", margin: "0 0 12px 0", color: "#0f172a" }}>Warp Knitted Fabrics</h2>
      <p style={{ maxWidth: "680px", margin: "0 auto", color: "#64748b", fontSize: "15px" }}>
        Engineered for structural stability, run-resistance, and technical textile applications. Updated live from our backend.
      </p>
    </div>

    {loading ? (
      <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "28px", color: "#2563eb", marginBottom: "12px", display: "block" }}></i>
        Loading warp fabrics from API...
      </div>
    ) : products.length === 0 ? (
      <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
        No warp knitted fabrics currently listed.
      </div>
    ) : (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "28px" }}>
        {products.map((prod) => (
          <article
            key={prod.id}
            style={{
              background: "#fff",
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 20px -4px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
          >
            <div style={{ position: "relative", height: "220px", background: "#f1f5f9", overflow: "hidden" }}>
              <img
                src={prod.image || "/assets/images/products/warp/1.jpg"}
                alt={prod.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "#2563eb",
                color: "#fff",
                fontSize: "11px",
                fontWeight: "700",
                padding: "3px 8px",
                borderRadius: "4px",
                textTransform: "uppercase"
              }}>
                Warp Knit
              </span>
            </div>

            <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 10px 0", color: "#0f172a" }}>
                  {prod.name}
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px 0", lineHeight: "1.5" }}>
                  {prod.description}
                </p>

                <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "10px", marginBottom: "14px", fontSize: "12px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#64748b" }}>GSM:</span>
                    <strong style={{ color: "#1e293b" }}>{prod.gsm}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#64748b" }}>Width:</span>
                    <strong style={{ color: "#1e293b" }}>{prod.width}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Yarn:</span>
                    <strong style={{ color: "#1e293b" }}>{prod.composition}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "18px" }}>
                  {(Array.isArray(prod.applications) ? prod.applications : [prod.applications]).map((app, idx) => (
                    <span key={idx} style={{ background: "#eff6ff", color: "#2563eb", fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "4px" }}>
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectProduct(prod)}
                style={{
                  width: "100%",
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "background 0.2s"
                }}
              >
                <span>Request Sample & Quote</span>
                <span>↗</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
</section>

<section className="management-gallery">
<div className="container">
<div className="masonry-grid">
<div className="masonry-item tall" data-lightbox="/assets/images/marquee/warp-knitting/warp/1.jpg" data-caption=""><img src="/assets/images/marquee/warp-knitting/warp/1.jpg" alt="" /></div>
<div className="masonry-item square" data-lightbox="/assets/images/marquee/warp-knitting/warp/2.jpg" data-caption=""><img src="/assets/images/marquee/warp-knitting/warp/2.jpg" alt="" /></div>
<div className="masonry-item wide" data-lightbox="/assets/images/marquee/warp-knitting/warp/3.jpg" data-caption=""><img src="/assets/images/marquee/warp-knitting/warp/3.jpg" alt="" /></div>
<div className="masonry-item tall" data-lightbox="/assets/images/marquee/warp-knitting/warp/4.jpg" data-caption=""><img src="/assets/images/marquee/warp-knitting/warp/4.jpg" alt="" /></div>
<div className="masonry-item wide" data-lightbox="/assets/images/marquee/warp-knitting/warp/5.jpg" data-caption=""><img src="/assets/images/marquee/warp-knitting/warp/5.jpg" alt="" /></div>
<div className="masonry-item square" data-lightbox="/assets/images/marquee/warp-knitting/warp/6.jpg" data-caption=""><img src="/assets/images/marquee/warp-knitting/warp/6.jpg" alt="" /></div>
</div>
</div>
</section>

{/* FUNCTIONAL ENQUIRY FORM */}
<section className="enquiry" id="form">
<div className="container enquiry-grid">
<div>
<div className="kicker" style={{color: "#2c9242"}}>Start a Conversation</div>
<h2>To manufacture better. To grow together.</h2>
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
