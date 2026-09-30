"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function DynamicWebsitePage() {
  const params = useParams();
  const slug = params?.slug || "home";

  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [error, setError] = useState(null);

  // Form submission state for contact module
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formResult, setFormResult] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/website/menu/${slug}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.isSuccess) {
          throw new Error(json.message || "Failed to load page");
        }
        setPageData(json.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormResult(null);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, inquiryType: "Dynamic Page Inquiry" })
      });
      const data = await res.json();
      if (res.ok) {
        setFormResult({ success: true, message: data.message || "Thank you! Enquiry submitted." });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setFormResult({ success: false, message: data.error || "Failed to submit enquiry." });
      }
    } catch {
      setFormResult({ success: false, message: "Network connection error." });
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "36px", color: "#15933a", marginBottom: "16px" }}></i>
          <p style={{ color: "#64748b", fontSize: "16px" }}>Loading dynamic page from CMS backend (slug: {slug})...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "20px" }}>
        <div style={{ maxWidth: "500px", textAlign: "center", background: "#fff", padding: "40px 30px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
          <i className="fa-solid fa-file-circle-question" style={{ fontSize: "48px", color: "#f59e0b", marginBottom: "16px" }}></i>
          <h2 style={{ fontSize: "24px", color: "#0f172a", marginBottom: "8px" }}>Page Not Found</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
            No dynamic page or menu mapped to slug <code>{slug}</code>. You can create this page in the Admin Page Builder!
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <Link href="/" style={{ background: "#0f172a", color: "#fff", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>
              Go to Home
            </Link>
            <Link href="/admin" style={{ background: "#15933a", color: "#fff", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>
              Open Admin CMS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { menu, page, banner, sections } = pageData;

  return (
    <div style={{ background: "#fff", color: "#0f172a", minHeight: "100vh" }}>
      {/* 1. DYNAMIC PAGE BANNER */}
      {banner && (
        <section style={{
          position: "relative",
          minHeight: "420px",
          background: `linear-gradient(rgba(11, 19, 32, 0.75), rgba(11, 19, 32, 0.85)), url('${banner.desktopImage || "/assets/images/about-intro.jpg"}') center/cover no-repeat`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center",
          padding: "80px 20px"
        }}>
          <div style={{ maxWidth: "800px" }}>
            <span style={{ display: "inline-block", background: "rgba(34, 197, 94, 0.2)", color: "#4ade80", padding: "4px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>
              {menu?.name || page?.title}
            </span>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: "800", margin: "0 0 16px 0", lineHeight: "1.15" }}>
              {banner.title}
            </h1>
            {banner.subtitle && (
              <p style={{ fontSize: "18px", color: "#cbd5e1", margin: "0 auto 24px auto", maxWidth: "650px", lineHeight: "1.5" }}>
                {banner.subtitle}
              </p>
            )}
            {banner.buttonText && (
              <a
                href={banner.buttonUrl || "#content"}
                style={{ display: "inline-block", background: "#15933a", color: "#fff", padding: "12px 28px", borderRadius: "8px", fontSize: "15px", fontWeight: "700", textDecoration: "none" }}
              >
                {banner.buttonText} ↗
              </a>
            )}
          </div>
        </section>
      )}

      {/* 2. DYNAMIC PAGE SECTIONS (ORDERED BY POSITION) */}
      <div id="content">
        {(!sections || sections.length === 0) ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#64748b" }}>
            <p>This dynamic page does not have any sections configured yet.</p>
            <Link href="/admin" style={{ color: "#15933a", fontWeight: "600" }}>Add sections in Admin Page Builder →</Link>
          </div>
        ) : (
          sections.map((section, idx) => (
            <div
              key={section._id || idx}
              style={{
                background: section.backgroundImage ? `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url('${section.backgroundImage}') center/cover` : (idx % 2 === 0 ? "#ffffff" : "#f8fafc"),
                padding: "80px 20px",
                borderBottom: "1px solid #e2e8f0"
              }}
            >
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Section Header if title or subtitle present */}
                {(section.title || section.subtitle) && (
                  <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    {section.subtitle && (
                      <div style={{ color: "#15933a", fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                        {section.subtitle}
                      </div>
                    )}
                    {section.title && (
                      <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                        {section.title}
                      </h2>
                    )}
                  </div>
                )}

                {/* TYPE A: CMS REUSABLE CONTENT COMPONENT */}
                {section.type === "cms" && section.cms && (
                  <div style={{ display: "grid", gridTemplateColumns: section.cms.image ? "1fr 1fr" : "1fr", gap: "48px", alignItems: "center" }}>
                    <div>
                      {section.cms.title && !(section.title === section.cms.title) && (
                        <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>
                          {section.cms.title}
                        </h3>
                      )}
                      {section.cms.description && (
                        <p style={{ fontSize: "16px", color: "#475569", lineHeight: "1.6", fontWeight: "500", marginBottom: "20px" }}>
                          {section.cms.description}
                        </p>
                      )}
                      {section.cms.content && (
                        <div
                          style={{ fontSize: "15px", color: "#334155", lineHeight: "1.8" }}
                          dangerouslySetInnerHTML={{ __html: section.cms.content }}
                        />
                      )}
                    </div>
                    {section.cms.image && (
                      <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}>
                        <img src={section.cms.image} alt={section.cms.title} style={{ width: "100%", height: "auto", display: "block" }} />
                      </div>
                    )}
                  </div>
                )}

                {/* TYPE B: MODULE COMPONENT */}
                {section.type === "module" && section.module && (
                  <div>
                    {/* Module Subtype: Product */}
                    {section.module.type === "product" && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                        {(section.module.data || [
                          { name: "180 GSM Interlock Dry-Fit", category: "circular", gsm: "180 GSM", width: "60 inches", composition: "100% Polyester", image: "/assets/images/products/circular/1.jpg" },
                          { name: "Single Jersey Spandex", category: "circular", gsm: "160 GSM", width: "58 inches", composition: "92% Poly, 8% Spandex", image: "/assets/images/products/circular/2.jpg" },
                          { name: "Warp Knitted Tricot", category: "warp", gsm: "220 GSM", width: "62 inches", composition: "100% Polyester", image: "/assets/images/products/warp/1.jpg" }
                        ]).map((prod, pIdx) => (
                          <div key={pIdx} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                            <div style={{ height: "180px", background: "#f1f5f9", position: "relative" }}>
                              <img src={prod.image || "/assets/images/products/circular/1.jpg"} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              <span style={{ position: "absolute", top: "10px", left: "10px", background: prod.category === "circular" ? "#15933a" : "#2563eb", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                                {prod.category || "Knitted Fabric"}
                              </span>
                            </div>
                            <div style={{ padding: "16px" }}>
                              <h4 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 6px 0" }}>{prod.name}</h4>
                              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                                <strong>{prod.gsm}</strong> · {prod.width}
                              </div>
                              <div style={{ fontSize: "12px", color: "#334155", marginBottom: "14px" }}>
                                {prod.composition}
                              </div>
                              <Link href="/contact-us" style={{ display: "block", textAlign: "center", background: "#0f172a", color: "#fff", padding: "8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>
                                Request Swatch & Pricing ↗
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Module Subtype: Testimonial */}
                    {section.module.type === "testimonial" && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
                        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                          <div style={{ color: "#eab308", marginBottom: "12px" }}>★★★★★</div>
                          <p style={{ fontSize: "15px", color: "#334155", lineHeight: "1.6", fontStyle: "italic", marginBottom: "16px" }}>
                            "Krishna Fashion has consistently delivered superior 180 GSM dry-fit interlock fabric for our pan-India activewear collections. Their Surat plant turnaround is unmatched."
                          </p>
                          <div style={{ fontWeight: "700", color: "#0f172a" }}>SportStyle India Ltd.</div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>Procurement Directorate</div>
                        </div>

                        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                          <div style={{ color: "#eab308", marginBottom: "12px" }}>★★★★★</div>
                          <p style={{ fontSize: "15px", color: "#334155", lineHeight: "1.6", fontStyle: "italic", marginBottom: "16px" }}>
                            "The dimensional stability and run-resistance of their warp knitted fabrics give our technical sportswear products an edge in global export markets."
                          </p>
                          <div style={{ fontWeight: "700", color: "#0f172a" }}>Vibrant Exports Co.</div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>Technical Fabric Sourcing</div>
                        </div>
                      </div>
                    )}

                    {/* Module Subtype: Contact Form */}
                    {section.module.type === "contact" && (
                      <div style={{ maxWidth: "600px", margin: "0 auto", background: "#fff", padding: "32px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                        {formResult && (
                          <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "16px", background: formResult.success ? "#e8f5e9" : "#fee2e2", color: formResult.success ? "#15933a" : "#dc2626", fontSize: "14px", fontWeight: "600" }}>
                            {formResult.message}
                          </div>
                        )}
                        <form onSubmit={handleFormSubmit}>
                          <div style={{ marginBottom: "14px" }}>
                            <label style={{ display: "block", fontSize: "13px", color: "#475569", marginBottom: "4px" }}>Your Name *</label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                            />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "13px", color: "#475569", marginBottom: "4px" }}>Email</label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                              />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "13px", color: "#475569", marginBottom: "4px" }}>Phone *</label>
                              <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                              />
                            </div>
                          </div>
                          <div style={{ marginBottom: "18px" }}>
                            <label style={{ display: "block", fontSize: "13px", color: "#475569", marginBottom: "4px" }}>Requirement Message</label>
                            <textarea
                              rows={4}
                              value={formData.message}
                              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                              placeholder="Tell us what fabric or service you need..."
                              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={formSubmitting}
                            style={{ width: "100%", background: "#15933a", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
                          >
                            {formSubmitting ? "Sending..." : "Submit Enquiry ↗"}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Module Subtype: Generic / Project / Gallery fallback */}
                    {!["product", "testimonial", "contact"].includes(section.module.type) && (
                      <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                        <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>{section.module.title || section.module.name}</h4>
                        {section.module.subtitle && <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 16px 0" }}>{section.module.subtitle}</p>}
                        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", fontSize: "13px", color: "#334155" }}>
                          <pre style={{ margin: 0, overflowX: "auto" }}>{JSON.stringify(section.module.configuration, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
