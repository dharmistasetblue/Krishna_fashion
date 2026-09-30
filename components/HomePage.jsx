"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage(){
  const [settings, setSettings] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);

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
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => { if (data.settings) setSettings(data.settings); })
      .catch(() => {});

    fetch("/api/products")
      .then(res => res.json())
      .then(data => { if (data.products) setFeaturedProducts(data.products.slice(0, 6)); })
      .catch(() => {});
  }, []);

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
        setResult({ success: true, message: data.message || "Enquiry sent successfully! Our sales team will get in touch shortly." });
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
      setResult({ success: false, message: "Server connection error. Please call or WhatsApp us." });
    } finally {
      setSubmitting(false);
    }
  };

  return (<>

<div className="scroll-progress" id="scrollProgress"></div>

<section className="hero">

<video className="video-desktop" autoPlay muted loop playsInline poster="/assets/images/video-bg.jpg">
<source src="/assets/video/krishna-factory-website.mp4" type="video/mp4" />
</video>

<video className="video-mobile" autoPlay muted loop playsInline poster="/assets/images/video-bg-mobile.jpg">
<source src="/assets/video/krishna-factory-Mobile-Size.mp4" type="video/mp4" />
</video>

<div className="hero-bottom"><span>Explore Krishna Fashion</span><span className="scroll-dot">↓</span></div>
</section>
<section className="intro" id="about">
<div className="container">
<div className="intro-grid" data-animate="up">
<div><div className="kicker" style={{color: "var(--green)"}}>ADVANCED TEXTILE MANUFACTURING</div>
<h2>Engineered Fabrics. <br />Industrial Scale. <br />Global Perspective.</h2>
</div>
<div>
<p className="bigcopy">KRISHNA FASHION is a textile manufacturing enterprise based in Surat, Gujarat, India, specialising in the production of polyester-based circular knitted and warp knitted fabrics.</p>
<p>With a manufacturing infrastructure of approximately 400 knitting machines and an aggregate production capability of nearly 70 tonnes per day, KRISHNA FASHION brings together scale, technical capability and process-driven manufacturing to serve the requirements of a rapidly evolving global textile industry.
Our manufacturing operations are supported by strategically located production facilities in Gujarat, enabling us to undertake substantial production programmes while maintaining consistency, flexibility and operational efficiency.
</p>
</div>
</div>
<div className="metrics" data-animate="up">
<div className="metric"><strong>{settings?.knittingMachines || "400+"}</strong><span>Knitting Machines</span></div>
<div className="metric"><strong>{settings?.dailyCapacity || "~70 MT"}</strong><span>Daily Capacity</span></div>
<div className="metric"><strong>CIRCULAR & WARP</strong><span>Knitting Facilities</span></div>
</div>
</div>
</section>
<section className="products" id="products">
<div className="container">
<div className="section-head" data-animate="up">
<div><div className="kicker" style={{color: "var(--green)"}}>Our Products</div>
<h2>Engineered for textile <br />performance.</h2>
</div>
<p>Fabric solutions engineered for consistency, technical performance, and high-volume garment manufacturing.</p>
</div>
<div className="product-list">

<article className="product-row home-product-slider" data-animate="up" data-product-slider="">
<div className="product-photo product-slider-viewport">
<div className="product-slider-track">
<div className="product-slider-slide"><img src="/assets/images/products/circular/1.jpg" alt="Circular Knitting" /></div>
<div className="product-slider-slide"><img src="/assets/images/products/circular/2.jpg" alt="Circular Knitting Machine" /></div>
<div className="product-slider-slide"><img src="/assets/images/products/circular/3.jpg" alt="Circular Knitting Production" /></div>
<div className="product-slider-slide"><img src="/assets/images/products/circular/4.jpg" alt="Circular Knitting Facility" /></div>
</div>
<button className="product-slider-arrow product-slider-prev" type="button" aria-label="Previous image"><i className="fa-solid fa-angle-left"></i></button>
<button className="product-slider-arrow product-slider-next" type="button" aria-label="Next image"><i className="fa-solid fa-angle-right"></i></button>
<div className="product-slider-dots" aria-label="Circular Knitting slider pagination"></div>
</div>
<div className="product-info">
<Link href="/circular-knitting" className="product-info-link"><h3>Circular Knitting</h3><p>Versatile Structures. Consistent Performance.</p></Link>
<Link href="/circular-knitting" className="circle-link" aria-label="View Circular Knitting">↗</Link>
</div>
</article>

<article className="product-row home-product-slider" data-animate="up" data-product-slider="">
<div className="product-photo product-slider-viewport">
<div className="product-slider-track">
<div className="product-slider-slide"><img src="/assets/images/products/warp/1.jpg" alt="Warp Knitting" /></div>
<div className="product-slider-slide"><img src="/assets/images/products/warp/2.jpg" alt="Warp Knitting Machine" /></div>
<div className="product-slider-slide"><img src="/assets/images/products/warp/3.jpg" alt="Warp Knitting Production" /></div>
<div className="product-slider-slide"><img src="/assets/images/products/warp/4.jpg" alt="Warp Knitting Facility" /></div>
</div>
<button className="product-slider-arrow product-slider-prev" type="button" aria-label="Previous image"><i className="fa-solid fa-angle-left"></i></button>
<button className="product-slider-arrow product-slider-next" type="button" aria-label="Next image"><i className="fa-solid fa-angle-right"></i></button>
<div className="product-slider-dots" aria-label="Warp Knitting slider pagination"></div>
</div>
<div className="product-info">
<Link href="/warp-knitting" className="product-info-link"><h3>Warp Knitting</h3><p>Technical Construction. Enhanced Stability.</p></Link>
<Link href="/warp-knitting" className="circle-link" aria-label="View Warp Knitting">↗</Link>
</div>
</article>
</div>
</div>
</section>
<section className="feature" id="infra">
<div className="feature-grid">
<div className="feature-copy" data-animate="right">
<div className="kicker" style={{color: "#2c9242"}}>OUR MANUFACTURING PHILOSOPHY</div>
<h2>Scale Without Compromise. Precision Without Exception.</h2>
<p>Every successful textile supply chain depends upon three fundamentals:</p>
<div className="feature-items">
<div className="feature-item"><b>01</b><div><h4>CONSISTENCY</h4><p>Maintaining uniformity across production batches and recurring programmes.</p></div></div>
<div className="feature-item"><b>02</b><div><h4>CAPABILITY</h4><p>Possessing the infrastructure and technical expertise to manufacture diverse fabric constructions.</p></div></div>
<div className="feature-item"><b>03</b><div><h4>RELIABILITY</h4><p>Delivering with disciplined production planning, quality controls and operational continuity.
These principles form the foundation of KRISHNA FASHION's manufacturing philosophy.</p></div></div>
</div>
</div>
<div className="feature-media"><img className="w-100" src="/assets/images/Infrastructure.jpg" /></div>
</div>
</section>
<section className="quality" id="quality">
<div className="container quality-grid">
<div className="kf-quality-grid">
<div className="kf-quality-grid__wrap">

<div className="kf-quality-grid__left">
<div className="kf-quality-grid__photo kf-quality-grid__photo--one">
<img src="/assets/images/quality/quality01.jpg" alt="Yarn Quality" />
</div>
<div className="kf-quality-grid__photo kf-quality-grid__photo--three">
<img src="/assets/images/quality/quality02.jpg" alt="Quality Inspection" />
</div>
</div>

<div className="kf-quality-grid__right">

<h2 className="kf-quality-grid__title">
                Quality
            </h2>
<div className="kf-quality-grid__photo kf-quality-grid__photo--two">
<img src="/assets/images/quality/quality03.jpg" alt="Fabric Manufacturing" />
</div>
<div className="kf-quality-grid__photo kf-quality-grid__photo--four">
<img src="/assets/images/quality/quality04.jpg" alt="Yarn Manufacturing" />
</div>
</div>
</div>
</div>
<div className="quality-card text" data-animate="right">
<div className="kicker">Our USP</div>
<h3>Quality is engineered into the process.</h3>
<p>At KRISHNA FASHION, quality is treated as an integral component of manufacturing rather than simply a final-stage inspection.
Our quality approach is built around systematic control throughout the production cycle.</p>
<ul>
<li><b>MATERIAL</b><br />
Careful selection and evaluation of incoming materials.</li>
<li><b>MANUFACTURING</b><br />
Controlled knitting processes designed to maintain consistency.</li>
<li>
<b>INSPECTION</b><br />
Structured in-process and finished-fabric quality assessment.
</li>
<li><b>TESTING</b><br />
Evaluation against defined technical and customer specifications.</li>
<li>
<b>FINAL ASSURANCE</b>
<br />
Verification prior to packing and dispatch.
</li>
</ul>
<p>This process-oriented approach enables us to pursue repeatability, consistency and dependable fabric performance across production volumes.
</p>
</div>
</div>
</section>
<section className="global-outlook" id="global">
<div className="container">
<div className="global-head" data-animate="up">
<div>
<div className="kicker" style={{color: "var(--green)"}}>Global Outlook</div>
<h2>From Surat to the global textile value chain.</h2>
</div>
</div>
<div className="twoblock">
<div className="globle-map"><img src="/assets/images/map.jpg" /></div>
<div className="globle-home-text">
<p>Surat is one of India's most significant textile manufacturing centres, and KRISHNA FASHION operates from within this dynamic ecosystem with a distinctly global outlook.
Our objective is to develop long-term relationships with international buyers, garment manufacturers, sourcing organisations, brands and textile businesses seeking reliable manufacturing partners.
</p>
<p><b>We understand that global customers require more than competitive production. They require:</b></p>
<ul>
<li>Consistency.</li>
<li>Capacity.</li>
<li>Responsiveness.</li>
<li>Technical capability.</li>
<li>Supply reliability.</li>
</ul>
<p>KRISHNA FASHION is building its manufacturing platform around these expectations.</p>
</div>
</div>
</div>
</section>
<section className="fullscreen-image-section" id="showcase">
<div className="fullscreen-image-overlay"></div>
<div className="container fullscreen-image-content" data-animate="up">
<div className="kicker">Our Green Commitment</div>
<h2>Sustainability </h2>
<p>At Krishna Fashion, sustainability is an integral part of our manufacturing philosophy. We are committed to reducing our environmental footprint by investing in renewable energy, improving energy efficiency and progressively transitioning towards cleaner sources of power.</p>
<Link href="/sustainability" className="btn btn-dark">Explore Sustainability ↗</Link>
</div>
</section>
{featuredProducts.length > 0 && (
  <section style={{ padding: "60px 0 30px 0", background: "#f8fafc" }}>
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <div className="kicker" style={{ color: "#2c9242", marginBottom: "8px" }}>LIVE FABRIC SPECIFICATIONS</div>
          <h2 style={{ margin: 0, fontSize: "32px", color: "#0f172a" }}>Featured Knitted Fabrics</h2>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/circular-knitting" style={{ fontSize: "13px", fontWeight: "600", color: "#15933a", textDecoration: "none", background: "#e8f5e9", padding: "8px 14px", borderRadius: "6px" }}>
            Circular Knit Catalog →
          </Link>
          <Link href="/warp-knitting" style={{ fontSize: "13px", fontWeight: "600", color: "#2563eb", textDecoration: "none", background: "#eff6ff", padding: "8px 14px", borderRadius: "6px" }}>
            Warp Knit Catalog →
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {featuredProducts.map(prod => (
          <div key={prod.id} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ height: "180px", position: "relative", background: "#f1f5f9" }}>
              <img src={prod.image || "/assets/images/products/circular/1.jpg"} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span style={{ position: "absolute", top: "10px", left: "10px", background: prod.category === "circular" ? "#15933a" : "#2563eb", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                {prod.category === "circular" ? "Circular" : "Warp"}
              </span>
            </div>
            <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h4 style={{ margin: "0 0 6px 0", fontSize: "16px", color: "#0f172a", fontWeight: "700" }}>{prod.name}</h4>
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>
                  <strong>{prod.gsm}</strong> · {prod.width}
                </div>
                <div style={{ fontSize: "12px", color: "#334155", marginBottom: "12px" }}>
                  {prod.composition}
                </div>
              </div>
              <a
                href="#form"
                onClick={() => setFormData(prev => ({ ...prev, inquiryType: "Product Inquiry", message: `Inquiring about ${prod.name} (${prod.gsm}). Please share bulk pricing.` }))}
                style={{ display: "block", textAlign: "center", background: "#0f172a", color: "#fff", padding: "8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}
              >
                Inquire Fabric ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}

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

<a className="whatsapp-btn" href="https://wa.me/918980982777" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
<span className="whatsapp-icon"><i className="fa-brands fa-whatsapp"></i></span>
<span className="whatsapp-text">WhatsApp</span>
</a>
<button className="back-top" id="backTop" aria-label="Back to top"><i className="fa-solid fa-arrow-up"></i></button>


</>);
}
