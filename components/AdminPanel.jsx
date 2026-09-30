"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPanel() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("admin@krishnafashion.co");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("overview"); // overview, inquiries, products, careers, settings
  const [toast, setToast] = useState(null);

  // Data states
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [careers, setCareers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // Inquiries filters & modals
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryNote, setInquiryNote] = useState("");

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "circular",
    gsm: "160 - 220 GSM",
    width: "60 inches",
    composition: "100% Polyester",
    applications: "Sportswear, Activewear",
    description: "",
    image: "/assets/images/products/circular/1.jpg",
    status: "active"
  });

  // Job modal state
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    department: "Production & Operations",
    location: "Surat",
    experience: "2-5 Years",
    type: "Full-Time",
    status: "active",
    description: ""
  });

  // Settings form
  const [settingsForm, setSettingsForm] = useState(null);
  const [pwdCurrent, setPwdCurrent] = useState("");
  const [pwdNew, setPwdNew] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const showToastMsg = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check auth on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setUser(data.user);
        loadAllData();
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const [resStats, resInq, resProd, resCar, resJobs, resSet] = await Promise.all([
        fetch("/api/stats").then(r => r.json()),
        fetch("/api/inquiries").then(r => r.json()),
        fetch("/api/products?all=true").then(r => r.json()),
        fetch("/api/careers").then(r => r.json()),
        fetch("/api/jobs").then(r => r.json()),
        fetch("/api/settings").then(r => r.json())
      ]);

      if (resStats.stats) setStats(resStats.stats);
      if (resInq.inquiries) setInquiries(resInq.inquiries);
      if (resProd.products) setProducts(resProd.products);
      if (resCar.applications) setCareers(resCar.applications);
      if (resJobs.jobs) setJobs(resJobs.jobs);
      if (resSet.settings) {
        setSettings(resSet.settings);
        setSettingsForm(resSet.settings);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
      showToastMsg("Error loading records", "error");
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginSubmitting(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Login failed");
        return;
      }
      setUser(data.user);
      showToastMsg("Welcome back, Admin!");
      loadAllData();
    } catch {
      setLoginError("Failed to connect to backend server");
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      setUser(null);
      showToastMsg("Logged out safely");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Inquiry actions
  const handleUpdateInquiryStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
        }
        showToastMsg(`Inquiry status updated to ${newStatus}`);
      }
    } catch {
      showToastMsg("Failed to update status", "error");
    }
  };

  const handleSaveInquiryNotes = async (id) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: inquiryNote })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, notes: inquiryNote } : i));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(prev => ({ ...prev, notes: inquiryNote }));
        }
        showToastMsg("Notes saved");
      }
    } catch {
      showToastMsg("Failed to save notes", "error");
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!confirm("Are you sure you want to delete this enquiry record?")) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries(prev => prev.filter(i => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        showToastMsg("Inquiry deleted");
      }
    } catch {
      showToastMsg("Failed to delete", "error");
    }
  };

  // Product Actions
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "circular",
      gsm: "160 - 220 GSM",
      width: "60 inches",
      composition: "100% Polyester",
      applications: "Sportswear, Activewear, Athleisure",
      description: "",
      image: "/assets/images/products/circular/1.jpg",
      status: "active"
    });
    setProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      gsm: prod.gsm,
      width: prod.width,
      composition: prod.composition,
      applications: Array.isArray(prod.applications) ? prod.applications.join(", ") : prod.applications,
      description: prod.description || "",
      image: prod.image || "/assets/images/products/circular/1.jpg",
      status: prod.status || "active"
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      applications: productForm.applications.split(",").map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? data.product : p));
          showToastMsg("Product updated successfully");
          setProductModalOpen(false);
        } else {
          showToastMsg(data.error || "Update failed", "error");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          setProducts(prev => [data.product, ...prev]);
          showToastMsg("New fabric product added");
          setProductModalOpen(false);
        } else {
          showToastMsg(data.error || "Failed to create product", "error");
        }
      }
    } catch {
      showToastMsg("Server communication error", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to remove this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToastMsg("Product deleted");
      }
    } catch {
      showToastMsg("Failed to delete", "error");
    }
  };

  // Career application actions
  const handleUpdateCareerStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/careers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setCareers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        showToastMsg(`Application status updated to ${newStatus}`);
      }
    } catch {
      showToastMsg("Failed to update status", "error");
    }
  };

  const handleDeleteCareer = async (id) => {
    if (!confirm("Delete this candidate application?")) return;
    try {
      const res = await fetch(`/api/careers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCareers(prev => prev.filter(c => c.id !== id));
        showToastMsg("Application deleted");
      }
    } catch {
      showToastMsg("Failed to delete", "error");
    }
  };

  // Job opening actions
  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        const res = await fetch(`/api/jobs/${editingJob.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobForm)
        });
        const data = await res.json();
        if (res.ok) {
          setJobs(prev => prev.map(j => j.id === editingJob.id ? data.job : j));
          showToastMsg("Job opening updated");
          setJobModalOpen(false);
        }
      } else {
        const res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobForm)
        });
        const data = await res.json();
        if (res.ok) {
          setJobs(prev => [data.job, ...prev]);
          showToastMsg("Job opening posted");
          setJobModalOpen(false);
        }
      }
    } catch {
      showToastMsg("Error saving job opening", "error");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm("Delete this job opening?")) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs(prev => prev.filter(j => j.id !== id));
        showToastMsg("Job position removed");
      }
    } catch {
      showToastMsg("Failed to delete", "error");
    }
  };

  // Save Company settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data.settings);
        showToastMsg("Company profile & settings saved!");
      }
    } catch {
      showToastMsg("Error saving settings", "error");
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdNew !== pwdConfirm) {
      showToastMsg("New passwords do not match", "error");
      return;
    }
    setPwdLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwdCurrent, newPassword: pwdNew })
      });
      const data = await res.json();
      if (res.ok) {
        showToastMsg("Password updated successfully!");
        setPwdCurrent("");
        setPwdNew("");
        setPwdConfirm("");
      } else {
        showToastMsg(data.error || "Failed to update password", "error");
      }
    } catch {
      showToastMsg("Server communication error", "error");
    } finally {
      setPwdLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b1320", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}><i className="fa-solid fa-spinner fa-spin" style={{ color: "#22c55e" }}></i></div>
          <p style={{ color: "#9ca3af" }}>Connecting to Krishna Fashion Admin System...</p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #090e17 0%, #111d2d 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: "440px", width: "100%", background: "#162234", borderRadius: "16px", border: "1px solid #23354d", padding: "36px 30px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <Link href="/">
              <img src="/assets/images/krishna-fashion-logo.png" alt="Krishna Fashion" style={{ maxHeight: "48px", margin: "0 auto 16px auto", display: "block" }} />
            </Link>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f3f4f6", margin: "0 0 6px 0" }}>Krishna Fashion Admin</h1>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Fabric Management, Enquiries & Operations Portal</p>
          </div>

          {loginError && (
            <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#fca5a5", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "18px" }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: "8px" }}></i>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", fontWeight: "500", marginBottom: "6px" }}>Admin Email</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "12px", color: "#64748b" }}><i className="fa-solid fa-envelope"></i></span>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #334155", color: "#fff", borderRadius: "8px", padding: "10px 14px 10px 38px", fontSize: "14px", outline: "none" }}
                  placeholder="admin@krishnafashion.co"
                />
              </div>
            </div>

            <div style={{ marginBottom: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: "500" }}>Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: "none", border: "none", color: "#38bdf8", fontSize: "12px", cursor: "pointer", padding: 0 }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "12px", color: "#64748b" }}><i className="fa-solid fa-lock"></i></span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #334155", color: "#fff", borderRadius: "8px", padding: "10px 14px 10px 38px", fontSize: "14px", outline: "none" }}
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div style={{ background: "#0f172a", border: "1px dashed #334155", borderRadius: "8px", padding: "10px 12px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                Demo: <strong style={{ color: "#e2e8f0" }}>admin@krishnafashion.co</strong> / <strong style={{ color: "#e2e8f0" }}>admin123</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail("admin@krishnafashion.co");
                  setLoginPassword("admin123");
                }}
                style={{ background: "#1e293b", border: "1px solid #475569", color: "#38bdf8", fontSize: "11px", padding: "3px 8px", borderRadius: "4px", cursor: "pointer" }}
              >
                Auto Fill
              </button>
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              style={{ width: "100%", background: "#15933a", border: "none", color: "#fff", padding: "12px", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }}
            >
              {loginSubmitting ? (
                <span><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i> Authenticating...</span>
              ) : (
                "Sign In to Admin Portal"
              )}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "22px" }}>
            <Link href="/" style={{ color: "#94a3b8", fontSize: "13px", textDecoration: "none" }}>
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered inquiries
  const filteredInquiries = inquiries.filter(i => {
    const matchesStatus = inquiryStatusFilter === "all" || i.status === inquiryStatusFilter;
    const q = inquirySearch.toLowerCase();
    const matchesSearch = !inquirySearch ||
      (i.name && i.name.toLowerCase().includes(q)) ||
      (i.email && i.email.toLowerCase().includes(q)) ||
      (i.phone && i.phone.includes(q)) ||
      (i.inquiryType && i.inquiryType.toLowerCase().includes(q)) ||
      (i.message && i.message.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#090e17", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          padding: "12px 20px",
          borderRadius: "8px",
          background: toast.type === "error" ? "#dc2626" : "#15933a",
          color: "#fff",
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          <i className={toast.type === "error" ? "fa-solid fa-triangle-exclamation" : "fa-solid fa-circle-check"}></i>
          {toast.msg}
        </div>
      )}

      {/* Top Navbar */}
      <header style={{ background: "#111a28", borderBottom: "1px solid #1e2c40", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
              <img src="/assets/images/krishna-fashion-logo.png" alt="Krishna Fashion" style={{ maxHeight: "36px" }} />
              <span style={{ background: "#15933a", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Admin Portal (JS)
              </span>
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={loadAllData}
              disabled={loadingData}
              title="Refresh Data"
              style={{ background: "#1b283a", border: "1px solid #2d3f56", color: "#94a3b8", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <i className={`fa-solid fa-rotate-right ${loadingData ? "fa-spin" : ""}`} style={{ color: "#38bdf8" }}></i>
              <span className="hidden-sm">Refresh</span>
            </button>

            <a
              href="/api/export"
              download="krishna-fashion-complete-code.zip"
              title="Download Full Source Code (.zip)"
              style={{ background: "#1b283a", border: "1px solid #38bdf8", color: "#38bdf8", padding: "8px 14px", borderRadius: "6px", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}
            >
              <i className="fa-solid fa-file-zipper"></i>
              <span>Export Code (.ZIP)</span>
            </a>

            <Link
              href="/"
              target="_blank"
              style={{ background: "#1b283a", border: "1px solid #2d3f56", color: "#cbd5e1", padding: "8px 14px", borderRadius: "6px", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "12px" }}></i>
              <span>View Main Website</span>
            </Link>

            <div style={{ height: "24px", width: "1px", background: "#2d3f56", margin: "0 4px" }}></div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1b283a", padding: "6px 12px", borderRadius: "6px", border: "1px solid #2d3f56" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#15933a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px" }}>
                A
              </div>
              <span style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: "500" }}>{user.name || "Admin"}</span>
            </div>

            <button
              onClick={handleLogout}
              style={{ background: "#3f1a1a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "8px", overflowX: "auto" }}>
          {[
            { id: "overview", label: "Dashboard", icon: "fa-chart-pie" },
            {
              id: "inquiries",
              label: "Enquiries & Leads",
              icon: "fa-inbox",
              badge: inquiries.filter(i => i.status === "new").length
            },
            { id: "products", label: "Fabrics Catalog", icon: "fa-layer-group", badge: products.length },
            {
              id: "careers",
              label: "Careers & Openings",
              icon: "fa-user-tie",
              badge: careers.filter(c => c.status === "under_review").length
            },
            { id: "settings", label: "Company & Settings", icon: "fa-sliders" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? "3px solid #15933a" : "3px solid transparent",
                color: activeTab === tab.id ? "#fff" : "#94a3b8",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: activeTab === tab.id ? "600" : "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap"
              }}
            >
              <i className={`fa-solid ${tab.icon}`} style={{ color: activeTab === tab.id ? "#22c55e" : "#64748b" }}></i>
              {tab.label}
              {Boolean(tab.badge) && (
                <span style={{
                  background: activeTab === tab.id ? "#15933a" : "#334155",
                  color: "#fff",
                  fontSize: "11px",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  fontWeight: "700"
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "28px 24px" }}>

        {/* 1. OVERVIEW / DASHBOARD TAB */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>Operations Overview</h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Real-time metrics for Krishna Fashion manufacturing and inquiries</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={openNewProductModal}
                  style={{ background: "#15933a", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="fa-solid fa-plus"></i> Add New Fabric
                </button>
                <a
                  href="/api/inquiries?export=csv"
                  download
                  style={{ background: "#1e293b", color: "#38bdf8", border: "1px solid #334155", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="fa-solid fa-download"></i> Export Enquiries CSV
                </a>
              </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {/* Card 1 */}
              <div style={{ background: "#121d2b", borderRadius: "12px", border: "1px solid #1e2c40", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>Total Inquiries</span>
                  <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(34, 197, 94, 0.15)", color: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa-solid fa-inbox"></i>
                  </div>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", marginBottom: "6px" }}>
                  {inquiries.length}
                </div>
                <div style={{ fontSize: "13px", color: "#22c55e", display: "flex", alignItems: "center", gap: "6px" }}>
                  <i className="fa-solid fa-bell"></i>
                  <strong>{inquiries.filter(i => i.status === "new").length} New</strong> requiring follow-up
                </div>
              </div>

              {/* Card 2 */}
              <div style={{ background: "#121d2b", borderRadius: "12px", border: "1px solid #1e2c40", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>Fabric Products</span>
                  <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa-solid fa-layer-group"></i>
                  </div>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", marginBottom: "6px" }}>
                  {products.length}
                </div>
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                  {products.filter(p => p.category === "circular").length} Circular / {products.filter(p => p.category === "warp").length} Warp Knitted
                </div>
              </div>

              {/* Card 3 */}
              <div style={{ background: "#121d2b", borderRadius: "12px", border: "1px solid #1e2c40", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>Job Applications</span>
                  <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(168, 85, 247, 0.15)", color: "#a855f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa-solid fa-user-group"></i>
                  </div>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", marginBottom: "6px" }}>
                  {careers.length}
                </div>
                <div style={{ fontSize: "13px", color: "#a855f7" }}>
                  {careers.filter(c => c.status === "under_review").length} Candidates under review
                </div>
              </div>

              {/* Card 4 */}
              <div style={{ background: "#121d2b", borderRadius: "12px", border: "1px solid #1e2c40", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>Manufacturing Scale</span>
                  <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(234, 179, 8, 0.15)", color: "#eab308", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa-solid fa-industry"></i>
                  </div>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", marginBottom: "6px" }}>
                  {settings?.dailyCapacity || "~70 MT"}
                </div>
                <div style={{ fontSize: "13px", color: "#eab308" }}>
                  {settings?.knittingMachines || "400+"} Knitting Machines across 2 Plants
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Enquiries Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
              <div style={{ background: "#121d2b", borderRadius: "12px", border: "1px solid #1e2c40", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>Recent Customer Inquiries</h3>
                    <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0 0" }}>Direct leads submitted via website contact form</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("inquiries")}
                    style={{ background: "#1b283a", border: "1px solid #2d3f56", color: "#38bdf8", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
                  >
                    View All ({inquiries.length}) →
                  </button>
                </div>

                {inquiries.slice(0, 5).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>No inquiries recorded yet.</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #1e2c40", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>
                          <th style={{ padding: "10px 14px" }}>Client</th>
                          <th style={{ padding: "10px 14px" }}>Type</th>
                          <th style={{ padding: "10px 14px" }}>Message Preview</th>
                          <th style={{ padding: "10px 14px" }}>Status</th>
                          <th style={{ padding: "10px 14px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.slice(0, 5).map(inq => (
                          <tr key={inq.id} style={{ borderBottom: "1px solid #182332" }}>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontWeight: "600", color: "#f1f5f9" }}>{inq.name}</div>
                              <div style={{ fontSize: "12px", color: "#64748b" }}>{inq.phone || inq.email}</div>
                            </td>
                            <td style={{ padding: "12px 14px", color: "#cbd5e1" }}>
                              <span style={{ background: "#1e293b", padding: "3px 8px", borderRadius: "4px", fontSize: "12px" }}>
                                {inq.inquiryType}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px", color: "#94a3b8", maxWidth: "340px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {inq.message}
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <span style={{
                                padding: "3px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                background: inq.status === "new" ? "#065f46" : inq.status === "in_progress" ? "#854d0e" : inq.status === "contacted" ? "#1e40af" : "#334155",
                                color: "#fff"
                              }}>
                                {inq.status.replace("_", " ")}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <button
                                onClick={() => {
                                  setSelectedInquiry(inq);
                                  setInquiryNote(inq.notes || "");
                                }}
                                style={{ background: "#15933a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. INQUIRIES TAB */}
        {activeTab === "inquiries" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>Enquiries & B2B Leads</h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Manage quote requests, fabric sample orders & manufacturing discussions</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <a
                  href="/api/inquiries?export=csv"
                  download
                  style={{ background: "#1e293b", color: "#38bdf8", border: "1px solid #334155", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="fa-solid fa-file-csv"></i> Download CSV
                </a>
              </div>
            </div>

            {/* Filter Bar */}
            <div style={{ background: "#121d2b", borderRadius: "10px", border: "1px solid #1e2c40", padding: "16px", marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1 1 300px" }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }}></i>
                  <input
                    type="text"
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    placeholder="Search by client name, email, phone, or requirements..."
                    style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "10px 12px 10px 36px", fontSize: "14px", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["all", "new", "in_progress", "contacted", "closed"].map(status => (
                  <button
                    key={status}
                    onClick={() => setInquiryStatusFilter(status)}
                    style={{
                      background: inquiryStatusFilter === status ? "#15933a" : "#1b283a",
                      color: inquiryStatusFilter === status ? "#fff" : "#94a3b8",
                      border: "1px solid",
                      borderColor: inquiryStatusFilter === status ? "#15933a" : "#2d3f56",
                      padding: "7px 12px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      fontWeight: inquiryStatusFilter === status ? "600" : "400"
                    }}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Table */}
            <div style={{ background: "#121d2b", borderRadius: "12px", border: "1px solid #1e2c40", overflow: "hidden" }}>
              {filteredInquiries.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 20px", color: "#64748b" }}>
                  <i className="fa-solid fa-inbox" style={{ fontSize: "36px", marginBottom: "12px", display: "block" }}></i>
                  No inquiries match your current filter.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                    <thead>
                      <tr style={{ background: "#0e1724", borderBottom: "1px solid #1e2c40", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>
                        <th style={{ padding: "14px 16px" }}>Date</th>
                        <th style={{ padding: "14px 16px" }}>Client Details</th>
                        <th style={{ padding: "14px 16px" }}>Type</th>
                        <th style={{ padding: "14px 16px" }}>Requirements / Message</th>
                        <th style={{ padding: "14px 16px" }}>Status</th>
                        <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInquiries.map(inq => (
                        <tr key={inq.id} style={{ borderBottom: "1px solid #182332" }}>
                          <td style={{ padding: "14px 16px", color: "#64748b", fontSize: "12px", whiteSpace: "nowrap" }}>
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ fontWeight: "600", color: "#f8fafc" }}>{inq.name}</div>
                            <div style={{ fontSize: "12px", color: "#38bdf8" }}>{inq.email}</div>
                            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{inq.phone}</div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ background: "#1e293b", color: "#e2e8f0", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", whiteSpace: "nowrap" }}>
                              {inq.inquiryType}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", color: "#cbd5e1", maxWidth: "380px" }}>
                            <div style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", fontSize: "13px" }}>
                              {inq.message}
                            </div>
                            {inq.notes && (
                              <div style={{ marginTop: "4px", fontSize: "11px", color: "#eab308" }}>
                                <i className="fa-solid fa-note-sticky" style={{ marginRight: "4px" }}></i>
                                Note: {inq.notes}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                              style={{
                                background: inq.status === "new" ? "#065f46" : inq.status === "in_progress" ? "#854d0e" : inq.status === "contacted" ? "#1e40af" : "#334155",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                                outline: "none"
                              }}
                            >
                              <option value="new">New</option>
                              <option value="in_progress">In Progress</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                            <button
                              onClick={() => {
                                setSelectedInquiry(inq);
                                setInquiryNote(inq.notes || "");
                              }}
                              title="View Details"
                              style={{ background: "#1e293b", border: "1px solid #334155", color: "#38bdf8", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer", marginRight: "6px" }}
                            >
                              <i className="fa-solid fa-eye"></i>
                            </button>
                            {inq.phone && (
                              <a
                                href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${inq.name}, Greetings from Krishna Fashion Surat. Regarding your inquiry...`)}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Reply on WhatsApp"
                                style={{ background: "#065f46", border: "1px solid #059669", color: "#6ee7b7", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", textDecoration: "none", display: "inline-block", marginRight: "6px" }}
                              >
                                <i className="fa-brands fa-whatsapp"></i>
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              title="Delete Inquiry"
                              style={{ background: "#3f1a1a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. PRODUCTS CATALOG TAB */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>Fabric Products Management</h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Configure circular knitting & warp knitting polyester fabric specifications</p>
              </div>
              <button
                onClick={openNewProductModal}
                style={{ background: "#15933a", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <i className="fa-solid fa-plus"></i> Add New Fabric
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
              {products.map(prod => (
                <div key={prod.id} style={{ background: "#121d2b", borderRadius: "12px", border: "1px solid #1e2c40", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: "180px", position: "relative", background: "#0b1320", overflow: "hidden" }}>
                    <img
                      src={prod.image || "/assets/images/products/circular/1.jpg"}
                      alt={prod.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "6px" }}>
                      <span style={{
                        background: prod.category === "circular" ? "#15933a" : "#2563eb",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        textTransform: "uppercase"
                      }}>
                        {prod.category === "circular" ? "Circular Knit" : "Warp Knit"}
                      </span>
                      <span style={{
                        background: prod.status === "active" ? "#065f46" : "#64748b",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        textTransform: "capitalize"
                      }}>
                        {prod.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px 0" }}>{prod.name}</h3>
                      <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 12px 0", lineHeight: "1.4" }}>{prod.description}</p>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px", fontSize: "12px" }}>
                        <div style={{ background: "#0e1724", padding: "6px 8px", borderRadius: "4px", border: "1px solid #1b283a" }}>
                          <span style={{ color: "#64748b", display: "block" }}>GSM</span>
                          <strong style={{ color: "#e2e8f0" }}>{prod.gsm}</strong>
                        </div>
                        <div style={{ background: "#0e1724", padding: "6px 8px", borderRadius: "4px", border: "1px solid #1b283a" }}>
                          <span style={{ color: "#64748b", display: "block" }}>Width</span>
                          <strong style={{ color: "#e2e8f0" }}>{prod.width}</strong>
                        </div>
                        <div style={{ gridColumn: "1 / -1", background: "#0e1724", padding: "6px 8px", borderRadius: "4px", border: "1px solid #1b283a" }}>
                          <span style={{ color: "#64748b", display: "block" }}>Composition</span>
                          <strong style={{ color: "#e2e8f0" }}>{prod.composition}</strong>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "16px" }}>
                        {(Array.isArray(prod.applications) ? prod.applications : [prod.applications]).map((app, idx) => (
                          <span key={idx} style={{ background: "#1e293b", color: "#38bdf8", fontSize: "11px", padding: "2px 6px", borderRadius: "4px" }}>
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #1e2c40", paddingTop: "14px" }}>
                      <button
                        onClick={() => openEditProductModal(prod)}
                        style={{ flex: 1, background: "#1b283a", border: "1px solid #2d3f56", color: "#38bdf8", padding: "8px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}
                      >
                        <i className="fa-solid fa-pen-to-square" style={{ marginRight: "6px" }}></i> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        style={{ background: "#3f1a1a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CAREERS TAB */}
        {activeTab === "careers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>HR & Career Applications</h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Review candidates and manage recruitment job openings</p>
              </div>
              <button
                onClick={() => {
                  setEditingJob(null);
                  setJobForm({
                    title: "",
                    department: "Production & Operations",
                    location: "Surat",
                    experience: "2-5 Years",
                    type: "Full-Time",
                    status: "active",
                    description: ""
                  });
                  setJobModalOpen(true);
                }}
                style={{ background: "#15933a", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <i className="fa-solid fa-briefcase"></i> Post New Job Opening
              </button>
            </div>

            {/* Applications List */}
            <div style={{ background: "#121d2b", borderRadius: "12px", border: "1px solid #1e2c40", padding: "20px", marginBottom: "28px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: "0 0 16px 0" }}>Candidate Applications ({careers.length})</h3>

              {careers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>No applications received yet.</div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #1e2c40", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>
                        <th style={{ padding: "10px 14px" }}>Candidate</th>
                        <th style={{ padding: "10px 14px" }}>Interest Area</th>
                        <th style={{ padding: "10px 14px" }}>Experience / Details</th>
                        <th style={{ padding: "10px 14px" }}>Status</th>
                        <th style={{ padding: "10px 14px", textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {careers.map(app => (
                        <tr key={app.id} style={{ borderBottom: "1px solid #182332" }}>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ fontWeight: "600", color: "#f1f5f9" }}>{app.name}</div>
                            <div style={{ fontSize: "12px", color: "#38bdf8" }}>{app.email}</div>
                            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{app.phone}</div>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ background: "#1e293b", color: "#e2e8f0", padding: "3px 8px", borderRadius: "4px", fontSize: "12px" }}>
                              {app.areaOfInterest}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", color: "#cbd5e1", maxWidth: "340px" }}>
                            <div style={{ fontSize: "13px" }}>{app.message}</div>
                            {app.resumeLink && (
                              <a href={app.resumeLink} target="_blank" rel="noreferrer" style={{ color: "#38bdf8", fontSize: "12px", display: "inline-block", marginTop: "4px" }}>
                                <i className="fa-solid fa-link"></i> Resume Link
                              </a>
                            )}
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateCareerStatus(app.id, e.target.value)}
                              style={{
                                background: app.status === "selected" ? "#065f46" : app.status === "interview_scheduled" ? "#854d0e" : app.status === "rejected" ? "#7f1d1d" : "#334155",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer"
                              }}
                            >
                              <option value="under_review">Under Review</option>
                              <option value="interview_scheduled">Interview Scheduled</option>
                              <option value="selected">Selected</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right" }}>
                            {app.phone && (
                              <a
                                href={`https://wa.me/${app.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${app.name}, this is Krishna Fashion HR regarding your application...`)}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ background: "#065f46", color: "#6ee7b7", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", textDecoration: "none", display: "inline-block", marginRight: "6px" }}
                              >
                                <i className="fa-brands fa-whatsapp"></i>
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteCareer(app.id)}
                              style={{ background: "#3f1a1a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Active Job Vacancies */}
            <div style={{ background: "#121d2b", borderRadius: "12px", border: "1px solid #1e2c40", padding: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: "0 0 16px 0" }}>Current Open Positions ({jobs.length})</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                {jobs.map(job => (
                  <div key={job.id} style={{ background: "#0b1320", border: "1px solid #1e2c40", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>{job.title}</h4>
                      <span style={{ background: job.status === "active" ? "#065f46" : "#475569", color: "#fff", fontSize: "11px", padding: "2px 6px", borderRadius: "4px" }}>
                        {job.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#38bdf8", marginBottom: "6px" }}>
                      {job.department} • {job.location}
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>
                      Experience: {job.experience} • {job.type}
                    </div>
                    <p style={{ fontSize: "13px", color: "#cbd5e1", margin: "0 0 14px 0", lineHeight: "1.4" }}>{job.description}</p>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <button
                        onClick={() => {
                          setEditingJob(job);
                          setJobForm({ ...job });
                          setJobModalOpen(true);
                        }}
                        style={{ background: "#1e293b", border: "1px solid #334155", color: "#38bdf8", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        style={{ background: "#3f1a1a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. SETTINGS TAB */}
        {activeTab === "settings" && settingsForm && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>Company Profile & System Settings</h2>
              <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Update operational parameters, plant contact information and admin security</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
              {/* Company Info Form */}
              <div style={{ background: "#121d2b", borderRadius: "12px", border: "1px solid #1e2c40", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: "0 0 16px 0" }}>Operational Parameters</h3>
                <form onSubmit={handleSaveSettings}>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Daily Knitting Capacity</label>
                    <input
                      type="text"
                      value={settingsForm.dailyCapacity || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, dailyCapacity: e.target.value })}
                      style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Installed Knitting Machines</label>
                    <input
                      type="text"
                      value={settingsForm.knittingMachines || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, knittingMachines: e.target.value })}
                      style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                    />
                  </div>

                  <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#38bdf8", margin: "20px 0 10px 0" }}>Head Office (ICC Surat)</h4>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#94a3b8" }}>Primary Phone (Himanshu Mittal)</label>
                    <input
                      type="text"
                      value={settingsForm.office?.phone1 || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, office: { ...settingsForm.office, phone1: e.target.value } })}
                      style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#94a3b8" }}>Secondary Phone (Keshav Choudhary)</label>
                    <input
                      type="text"
                      value={settingsForm.office?.phone2 || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, office: { ...settingsForm.office, phone2: e.target.value } })}
                      style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#94a3b8" }}>Official Contact Email</label>
                    <input
                      type="email"
                      value={settingsForm.office?.email || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, office: { ...settingsForm.office, email: e.target.value } })}
                      style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ background: "#15933a", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Save Company Info
                  </button>
                </form>
              </div>

              {/* Password Change Form */}
              <div style={{ background: "#121d2b", borderRadius: "12px", border: "1px solid #1e2c40", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: "0 0 16px 0" }}>Security & Password</h3>
                <form onSubmit={handleChangePassword}>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Current Password</label>
                    <input
                      type="password"
                      required
                      value={pwdCurrent}
                      onChange={(e) => setPwdCurrent(e.target.value)}
                      style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                      placeholder="Current admin password"
                    />
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={pwdNew}
                      onChange={(e) => setPwdNew(e.target.value)}
                      style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Confirm New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={pwdConfirm}
                      onChange={(e) => setPwdConfirm(e.target.value)}
                      style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                      placeholder="Re-type new password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pwdLoading}
                    style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
                  >
                    {pwdLoading ? "Updating..." : "Update Password"}
                  </button>
                </form>

                <div style={{ marginTop: "28px", padding: "16px", background: "#0b1320", borderRadius: "8px", border: "1px solid #1e2c40" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#cbd5e1", margin: "0 0 8px 0" }}>System Architecture</h4>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 8px 0" }}>
                    Backend Runtime: <strong>Node.js JavaScript (Next.js 15 App Router)</strong>
                  </p>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 8px 0" }}>
                    Storage Engine: <strong>Atomic JSON Database with Persistent Records</strong>
                  </p>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                    API Authentication: <strong>HMAC-SHA256 Signed Session Cookies</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DETAIL MODAL FOR INQUIRY */}
      {selectedInquiry && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ maxWidth: "600px", width: "100%", background: "#162234", borderRadius: "14px", border: "1px solid #23354d", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase" }}>Inquiry #{selectedInquiry.id}</span>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", margin: "2px 0 0 0" }}>{selectedInquiry.name}</h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "22px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "#0b1320", padding: "14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
              <div>
                <span style={{ color: "#64748b", display: "block" }}>Email</span>
                <a href={`mailto:${selectedInquiry.email}`} style={{ color: "#38bdf8", textDecoration: "none" }}>{selectedInquiry.email || "N/A"}</a>
              </div>
              <div>
                <span style={{ color: "#64748b", display: "block" }}>Phone</span>
                <a href={`tel:${selectedInquiry.phone}`} style={{ color: "#38bdf8", textDecoration: "none" }}>{selectedInquiry.phone || "N/A"}</a>
              </div>
              <div>
                <span style={{ color: "#64748b", display: "block" }}>Inquiry Type</span>
                <strong style={{ color: "#e2e8f0" }}>{selectedInquiry.inquiryType}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", display: "block" }}>Received On</span>
                <strong style={{ color: "#e2e8f0" }}>{new Date(selectedInquiry.createdAt).toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Customer Message</label>
              <div style={{ background: "#0b1320", padding: "14px", borderRadius: "8px", border: "1px solid #1e2c40", fontSize: "14px", color: "#e2e8f0", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                {selectedInquiry.message}
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Internal Staff Note</label>
              <textarea
                rows={3}
                value={inquiryNote}
                onChange={(e) => setInquiryNote(e.target.value)}
                placeholder="e.g. Quoted ₹185/kg on call. Waiting for sample approval..."
                style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "8px", color: "#fff", padding: "10px", fontSize: "13px" }}
              />
              <button
                type="button"
                onClick={() => handleSaveInquiryNotes(selectedInquiry.id)}
                style={{ marginTop: "6px", background: "#1e293b", border: "1px solid #334155", color: "#38bdf8", padding: "5px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
              >
                Save Note
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #23354d", paddingTop: "16px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${selectedInquiry.name}, greetings from Krishna Fashion Surat...`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: "#065f46", color: "#6ee7b7", padding: "8px 14px", borderRadius: "6px", fontSize: "13px", textDecoration: "none", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <i className="fa-brands fa-whatsapp"></i> Chat WhatsApp
                  </a>
                )}
                {selectedInquiry.email && (
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Krishna Fashion - Enquiry Response`}
                    style={{ background: "#1e293b", border: "1px solid #334155", color: "#38bdf8", padding: "8px 14px", borderRadius: "6px", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <i className="fa-solid fa-envelope"></i> Send Email
                  </a>
                )}
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{ background: "#334155", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT CREATE / EDIT MODAL */}
      {productModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ maxWidth: "600px", width: "100%", background: "#162234", borderRadius: "14px", border: "1px solid #23354d", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: 0 }}>
                {editingProduct ? "Edit Fabric Product" : "Add New Fabric Product"}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "22px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Fabric Name / Construction</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Polyester Interlock Dry-Fit"
                  style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Knitting Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  >
                    <option value="circular">Circular Knitting</option>
                    <option value="warp">Warp Knitting</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Status</label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>GSM Range</label>
                  <input
                    type="text"
                    value={productForm.gsm}
                    onChange={(e) => setProductForm({ ...productForm, gsm: e.target.value })}
                    placeholder="e.g. 140 - 220 GSM"
                    style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Width</label>
                  <input
                    type="text"
                    value={productForm.width}
                    onChange={(e) => setProductForm({ ...productForm, width: e.target.value })}
                    placeholder="e.g. 58 - 62 inches"
                    style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Yarn Composition</label>
                <input
                  type="text"
                  value={productForm.composition}
                  onChange={(e) => setProductForm({ ...productForm, composition: e.target.value })}
                  placeholder="e.g. 100% Micro Polyester or 92% Poly, 8% Spandex"
                  style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>End Applications (comma-separated)</label>
                <input
                  type="text"
                  value={productForm.applications}
                  onChange={(e) => setProductForm({ ...productForm, applications: e.target.value })}
                  placeholder="Sportswear, Activewear, Athleisure, Fashion"
                  style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Image Path</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="/assets/images/products/circular/1.jpg"
                  style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Short Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Fabric handle, stretch, luster, performance features..."
                  style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid #23354d", paddingTop: "14px" }}>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  style={{ background: "#334155", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: "#15933a", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOB POSTING MODAL */}
      {jobModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ maxWidth: "540px", width: "100%", background: "#162234", borderRadius: "14px", border: "1px solid #23354d", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: 0 }}>
                {editingJob ? "Edit Job Position" : "Create Job Opening"}
              </h3>
              <button
                onClick={() => setJobModalOpen(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "22px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveJob}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Job Title</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Senior Circular Knitting Machine Technician"
                  style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Department</label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  >
                    <option value="Production & Operations">Production & Operations</option>
                    <option value="Quality">Quality Assurance</option>
                    <option value="Technical">Technical</option>
                    <option value="Sales & Customer Relations">Sales & Customer Relations</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Status</label>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  >
                    <option value="active">Active (Open)</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="Plant 01 / Surat"
                    style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Experience</label>
                  <input
                    type="text"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    placeholder="e.g. 3-5 Years"
                    style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Description & Responsibilities</label>
                <textarea
                  rows={3}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Key responsibilities and qualifications required..."
                  style={{ width: "100%", boxSizing: "border-box", background: "#0b1320", border: "1px solid #23354d", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid #23354d", paddingTop: "14px" }}>
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  style={{ background: "#334155", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: "#15933a", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                >
                  {editingJob ? "Save Job" : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
