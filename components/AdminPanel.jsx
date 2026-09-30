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

  // Active navigation tab (Wix sidebar)
  const [activeTab, setActiveTab] = useState("overview"); 
  // tabs: overview, products, inquiries, careers, plants, site_cms, security
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");

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
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productForm, setProductForm] = useState({
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

  // Preset fabric swatches
  const presetSwatches = [
    "/assets/images/products/circular/1.jpg",
    "/assets/images/products/circular/2.jpg",
    "/assets/images/products/circular/3.jpg",
    "/assets/images/products/circular/4.jpg",
    "/assets/images/products/warp/1.jpg",
    "/assets/images/products/warp/2.jpg",
    "/assets/images/products/warp/3.jpg",
    "/assets/images/products/warp/4.jpg",
  ];

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

  // Settings & CMS form
  const [settingsForm, setSettingsForm] = useState(null);
  const [pwdCurrent, setPwdCurrent] = useState("");
  const [pwdNew, setPwdNew] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const showToastMsg = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

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
        showToastMsg(`Status updated to ${newStatus.replace('_', ' ')}`);
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
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
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
          showToastMsg("Product updated! Live on website.");
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
          showToastMsg("New fabric published to live website!");
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
    if (!confirm("Are you sure you want to remove this fabric from catalog?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToastMsg("Fabric removed from catalog");
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
        showToastMsg(`Candidate status updated to ${newStatus.replace('_', ' ')}`);
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

  // Job Opening Actions
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
          showToastMsg("Job vacancy updated live!");
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
          showToastMsg("New vacancy published to /careers page!");
          setJobModalOpen(false);
        }
      }
    } catch {
      showToastMsg("Error saving job", "error");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm("Delete this job vacancy?")) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs(prev => prev.filter(j => j.id !== id));
        showToastMsg("Job opening removed");
      }
    } catch {
      showToastMsg("Failed to delete", "error");
    }
  };

  // Save Settings & CMS Content
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
        showToastMsg("Wix CMS & Settings saved successfully!");
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
        showToastMsg("Admin password updated!");
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

  // Filtered queries
  const filteredProducts = products.filter(p => {
    const matchesCat = productCategoryFilter === "all" || p.category === productCategoryFilter;
    const matchesSearch = !globalSearch || p.name.toLowerCase().includes(globalSearch.toLowerCase()) || p.composition.toLowerCase().includes(globalSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredInquiries = inquiries.filter(i => {
    const matchesStatus = inquiryStatusFilter === "all" || i.status === inquiryStatusFilter;
    const q = (inquirySearch || globalSearch).toLowerCase();
    const matchesSearch = !q ||
      (i.name && i.name.toLowerCase().includes(q)) ||
      (i.email && i.email.toLowerCase().includes(q)) ||
      (i.phone && i.phone.includes(q)) ||
      (i.inquiryType && i.inquiryType.toLowerCase().includes(q)) ||
      (i.message && i.message.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "32px", color: "#15933a", marginBottom: "16px" }}></i>
          <p style={{ color: "#94a3b8" }}>Connecting to Krishna Fashion Admin Workspace...</p>
        </div>
      </div>
    );
  }

  // WIX-STYLE LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: "440px", width: "100%", background: "#1e293b", borderRadius: "16px", border: "1px solid #334155", padding: "40px 32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <Link href="/">
              <img src="/assets/images/krishna-fashion-logo.png" alt="Krishna Fashion" style={{ maxHeight: "48px", margin: "0 auto 16px auto", display: "block" }} />
            </Link>
            <div style={{ display: "inline-block", background: "rgba(21, 147, 58, 0.15)", color: "#22c55e", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
              Enterprise CMS Workspace
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f8fafc", margin: "0 0 6px 0" }}>Krishna Fashion Portal</h1>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Manage fabric catalogs, enquiries CRM, plant locations and live website content</p>
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
                  style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "8px", padding: "10px 14px 10px 38px", fontSize: "14px", outline: "none" }}
                  placeholder="admin@krishnafashion.co"
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
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
                  style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "8px", padding: "10px 14px 10px 38px", fontSize: "14px", outline: "none" }}
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div style={{ background: "#0f172a", border: "1px dashed #334155", borderRadius: "8px", padding: "10px 14px", marginBottom: "22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                Default Login: <strong style={{ color: "#e2e8f0" }}>admin@krishnafashion.co</strong> / <strong style={{ color: "#e2e8f0" }}>admin123</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail("admin@krishnafashion.co");
                  setLoginPassword("admin123");
                }}
                style={{ background: "#1e293b", border: "1px solid #475569", color: "#38bdf8", fontSize: "11px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
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
                <span><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i> Connecting...</span>
              ) : (
                "Open Admin Workspace"
              )}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "22px" }}>
            <Link href="/" style={{ color: "#94a3b8", fontSize: "13px", textDecoration: "none" }}>
              ← View Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // WIX-STYLE DASHBOARD LAYOUT
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0b1320", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}>
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

      {/* 1. WIX-STYLE LEFT SIDEBAR */}
      <aside style={{
        width: sidebarCollapsed ? "72px" : "260px",
        background: "#0f172a",
        borderRight: "1px solid #1e293b",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 50,
        flexShrink: 0
      }}>
        {/* Workspace Brand Header */}
        <div style={{ padding: "18px 16px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {!sidebarCollapsed ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#15933a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "16px", flexShrink: 0 }}>
                KF
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>Krishna Fashion</div>
                <div style={{ fontSize: "11px", color: "#22c55e", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }}></span> Live Backend
                </div>
              </div>
            </div>
          ) : (
            <div style={{ width: "36px", height: "36px", margin: "0 auto", borderRadius: "8px", background: "#15933a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800" }}>
              KF
            </div>
          )}

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <i className={`fa-solid ${sidebarCollapsed ? "fa-angles-right" : "fa-angles-left"}`}></i>
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div style={{ padding: "16px 8px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* Section: MAIN */}
          {!sidebarCollapsed && <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", padding: "8px 12px 4px 12px", textTransform: "uppercase" }}>Core Workspace</div>}

          {[
            { id: "overview", label: "Dashboard", icon: "fa-gauge-high" },
            { id: "products", label: "Fabric Catalog", icon: "fa-layer-group", badge: products.length },
            { id: "inquiries", label: "Enquiries & CRM", icon: "fa-inbox", badge: inquiries.filter(i => i.status === "new").length, badgeColor: "#059669" },
            { id: "careers", label: "Careers & Jobs", icon: "fa-user-tie", badge: careers.filter(c => c.status === "under_review").length, badgeColor: "#7c3aed" }
          ].map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: sidebarCollapsed ? "center" : "space-between",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: isActive ? "#1e293b" : "transparent",
                  color: isActive ? "#fff" : "#94a3b8",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: isActive ? "600" : "500",
                  fontSize: "13px",
                  width: "100%",
                  textAlign: "left",
                  transition: "all 0.15s"
                }}
                title={sidebarCollapsed ? item.label : ""}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <i className={`fa-solid ${item.icon}`} style={{ color: isActive ? "#22c55e" : "#64748b", width: "16px", textAlign: "center" }}></i>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.badge !== undefined && Boolean(item.badge) && (
                  <span style={{ background: item.badgeColor || "#334155", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "1px 7px", borderRadius: "10px" }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Section: SITE & SETTINGS */}
          {!sidebarCollapsed && <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", padding: "16px 12px 4px 12px", textTransform: "uppercase" }}>Wix CMS & Settings</div>}

          {[
            { id: "plants", label: "Plants & Map Setup", icon: "fa-industry" },
            { id: "site_cms", label: "Site Content CMS", icon: "fa-pen-to-square" },
            { id: "security", label: "Admin & Security", icon: "fa-shield-halved" }
          ].map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: isActive ? "#1e293b" : "transparent",
                  color: isActive ? "#fff" : "#94a3b8",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: isActive ? "600" : "500",
                  fontSize: "13px",
                  width: "100%",
                  textAlign: "left"
                }}
                title={sidebarCollapsed ? item.label : ""}
              >
                <i className={`fa-solid ${item.icon}`} style={{ color: isActive ? "#22c55e" : "#64748b", width: "16px", textAlign: "center" }}></i>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer User Card */}
        <div style={{ padding: "14px", borderTop: "1px solid #1e293b", background: "#0b1320" }}>
          {!sidebarCollapsed ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#15933a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", flexShrink: 0 }}>
                  A
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{user.name || "Admin"}</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Superadmin</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: "4px" }}
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", width: "100%", textAlign: "center" }}
              title="Logout"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          )}
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE VIEWPORT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>
        
        {/* Wix-Style Top Utility Bar */}
        <header style={{
          height: "64px",
          background: "#0f172a",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          position: "sticky",
          top: 0,
          zIndex: 40
        }}>
          {/* Quick Search */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: "1 1 360px", maxWidth: "460px" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "12px", top: "11px", color: "#64748b", fontSize: "13px" }}></i>
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search fabrics, client enquiries, jobs..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff",
                  padding: "8px 12px 8px 36px",
                  fontSize: "13px",
                  outline: "none"
                }}
              />
            </div>
          </div>

          {/* Quick Header Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={loadAllData}
              disabled={loadingData}
              style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", padding: "7px 12px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              title="Refresh Data"
            >
              <i className={`fa-solid fa-rotate-right ${loadingData ? "fa-spin" : ""}`} style={{ color: "#38bdf8" }}></i>
              <span>Sync</span>
            </button>

            <a
              href="/api/export"
              download="krishna-fashion-complete-code.zip"
              style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid #0284c7", color: "#38bdf8", padding: "7px 14px", borderRadius: "6px", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}
            >
              <i className="fa-solid fa-file-zipper"></i>
              <span>Export Code (.ZIP)</span>
            </a>

            <Link
              href="/"
              target="_blank"
              style={{ background: "#15933a", color: "#fff", padding: "7px 14px", borderRadius: "6px", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}
            >
              <span>Live Website</span>
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "11px" }}></i>
            </Link>
          </div>
        </header>

        {/* Dynamic Workspace Tab Content */}
        <main style={{ padding: "32px 28px", flex: 1, maxWidth: "1400px", width: "100%", boxSizing: "border-box", margin: "0 auto" }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 6px 0" }}>Operations Dashboard</h2>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Executive overview of Krishna Fashion textile manufacturing and customer leads</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={openNewProductModal}
                    style={{ background: "#15933a", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <i className="fa-solid fa-plus"></i> Add New Fabric
                  </button>
                  <a
                    href="/api/inquiries?export=csv"
                    download
                    style={{ background: "#1e293b", color: "#38bdf8", border: "1px solid #334155", padding: "10px 16px", borderRadius: "8px", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <i className="fa-solid fa-download"></i> Export Enquiries CSV
                  </a>
                </div>
              </div>

              {/* KPI Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>Total Customer Leads</span>
                    <i className="fa-solid fa-inbox" style={{ color: "#22c55e", fontSize: "18px" }}></i>
                  </div>
                  <div style={{ fontSize: "30px", fontWeight: "800", color: "#f8fafc", marginBottom: "4px" }}>
                    {inquiries.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "#22c55e" }}>
                    <strong>{inquiries.filter(i => i.status === "new").length} New Leads</strong> awaiting follow-up
                  </div>
                </div>

                <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>Active Fabric Catalog</span>
                    <i className="fa-solid fa-layer-group" style={{ color: "#38bdf8", fontSize: "18px" }}></i>
                  </div>
                  <div style={{ fontSize: "30px", fontWeight: "800", color: "#f8fafc", marginBottom: "4px" }}>
                    {products.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {products.filter(p => p.category === "circular").length} Circular · {products.filter(p => p.category === "warp").length} Warp Knitted
                  </div>
                </div>

                <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>Recruitment & HR</span>
                    <i className="fa-solid fa-user-group" style={{ color: "#a855f7", fontSize: "18px" }}></i>
                  </div>
                  <div style={{ fontSize: "30px", fontWeight: "800", color: "#f8fafc", marginBottom: "4px" }}>
                    {careers.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "#a855f7" }}>
                    {careers.filter(c => c.status === "under_review").length} Candidates under review · {jobs.length} Openings
                  </div>
                </div>

                <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>Manufacturing Capacity</span>
                    <i className="fa-solid fa-industry" style={{ color: "#eab308", fontSize: "18px" }}></i>
                  </div>
                  <div style={{ fontSize: "30px", fontWeight: "800", color: "#f8fafc", marginBottom: "4px" }}>
                    {settings?.dailyCapacity || "~70 MT"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#eab308" }}>
                    {settings?.knittingMachines || "400+"} Knitting Machines across 2 Plants
                  </div>
                </div>
              </div>

              {/* Recent Customer Inquiries Preview */}
              <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>Recent Customer Inquiries</h3>
                    <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0 0" }}>Direct inquiries submitted through website forms</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("inquiries")}
                    style={{ background: "#0f172a", border: "1px solid #334155", color: "#38bdf8", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
                  >
                    View All ({inquiries.length}) →
                  </button>
                </div>

                {inquiries.slice(0, 5).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>No customer enquiries yet.</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>
                          <th style={{ padding: "10px 14px" }}>Client</th>
                          <th style={{ padding: "10px 14px" }}>Inquiry Type</th>
                          <th style={{ padding: "10px 14px" }}>Requirement</th>
                          <th style={{ padding: "10px 14px" }}>Status</th>
                          <th style={{ padding: "10px 14px", textAlign: "right" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.slice(0, 5).map(inq => (
                          <tr key={inq.id} style={{ borderBottom: "1px solid #283548" }}>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontWeight: "600", color: "#f1f5f9" }}>{inq.name}</div>
                              <div style={{ fontSize: "12px", color: "#64748b" }}>{inq.phone || inq.email}</div>
                            </td>
                            <td style={{ padding: "12px 14px", color: "#cbd5e1" }}>
                              <span style={{ background: "#0f172a", padding: "3px 8px", borderRadius: "4px", fontSize: "12px" }}>
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
                            <td style={{ padding: "12px 14px", textAlign: "right" }}>
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
          )}

          {/* TAB 2: PRODUCTS CATALOG */}
          {activeTab === "products" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>Fabric Catalog Manager</h2>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Add and modify fabrics that dynamically appear on the public website</p>
                </div>
                <button
                  onClick={openNewProductModal}
                  style={{ background: "#15933a", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="fa-solid fa-plus"></i> Add New Fabric
                </button>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                {[
                  { id: "all", label: `All Fabrics (${products.length})` },
                  { id: "circular", label: `Circular Knitting (${products.filter(p => p.category === 'circular').length})` },
                  { id: "warp", label: `Warp Knitting (${products.filter(p => p.category === 'warp').length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setProductCategoryFilter(tab.id)}
                    style={{
                      background: productCategoryFilter === tab.id ? "#15933a" : "#1e293b",
                      color: productCategoryFilter === tab.id ? "#fff" : "#94a3b8",
                      border: "1px solid",
                      borderColor: productCategoryFilter === tab.id ? "#15933a" : "#334155",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      cursor: "pointer",
                      fontWeight: productCategoryFilter === tab.id ? "600" : "400"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Fabric Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {filteredProducts.map(prod => (
                  <div key={prod.id} style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ height: "180px", position: "relative", background: "#0f172a" }}>
                      <img src={prod.image || "/assets/images/products/circular/1.jpg"} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "6px" }}>
                        <span style={{ background: prod.category === "circular" ? "#15933a" : "#2563eb", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                          {prod.category === "circular" ? "Circular Knit" : "Warp Knit"}
                        </span>
                        <span style={{ background: prod.status === "active" ? "#065f46" : "#64748b", color: "#fff", fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "4px" }}>
                          {prod.status}
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px 0" }}>{prod.name}</h3>
                        <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 12px 0", lineHeight: "1.4" }}>{prod.description}</p>

                        <div style={{ background: "#0f172a", padding: "8px 10px", borderRadius: "6px", border: "1px solid #283548", marginBottom: "12px", fontSize: "12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ color: "#64748b" }}>GSM:</span>
                            <strong style={{ color: "#e2e8f0" }}>{prod.gsm}</strong>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ color: "#64748b" }}>Width:</span>
                            <strong style={{ color: "#e2e8f0" }}>{prod.width}</strong>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b" }}>Yarn:</span>
                            <strong style={{ color: "#e2e8f0" }}>{prod.composition}</strong>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
                          {(Array.isArray(prod.applications) ? prod.applications : [prod.applications]).map((app, idx) => (
                            <span key={idx} style={{ background: "#0f172a", color: "#38bdf8", fontSize: "11px", padding: "2px 6px", borderRadius: "4px" }}>
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #334155", paddingTop: "12px" }}>
                        <button
                          onClick={() => openEditProductModal(prod)}
                          style={{ flex: 1, background: "#0f172a", border: "1px solid #334155", color: "#38bdf8", padding: "7px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}
                        >
                          <i className="fa-solid fa-pen-to-square" style={{ marginRight: "6px" }}></i> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          style={{ background: "#3f1a1a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "7px 12px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
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

          {/* TAB 3: INQUIRIES & CRM */}
          {activeTab === "inquiries" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>Enquiries CRM & Leads</h2>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Review customer inquiries, send direct WhatsApp responses, and manage deals</p>
                </div>
                <a
                  href="/api/inquiries?export=csv"
                  download
                  style={{ background: "#1e293b", color: "#38bdf8", border: "1px solid #334155", padding: "9px 16px", borderRadius: "8px", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="fa-solid fa-file-csv"></i> Download CSV
                </a>
              </div>

              {/* Status Filter Bar */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {["all", "new", "in_progress", "contacted", "closed"].map(st => (
                  <button
                    key={st}
                    onClick={() => setInquiryStatusFilter(st)}
                    style={{
                      background: inquiryStatusFilter === st ? "#15933a" : "#1e293b",
                      color: inquiryStatusFilter === st ? "#fff" : "#94a3b8",
                      border: "1px solid",
                      borderColor: inquiryStatusFilter === st ? "#15933a" : "#334155",
                      padding: "7px 14px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      fontWeight: inquiryStatusFilter === st ? "600" : "400"
                    }}
                  >
                    {st.replace("_", " ")} ({st === "all" ? inquiries.length : inquiries.filter(i => i.status === st).length})
                  </button>
                ))}
              </div>

              {/* Table */}
              <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", overflow: "hidden" }}>
                {filteredInquiries.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 20px", color: "#64748b" }}>
                    <i className="fa-solid fa-inbox" style={{ fontSize: "36px", marginBottom: "12px", display: "block" }}></i>
                    No enquiries match current filter.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ background: "#0f172a", borderBottom: "1px solid #334155", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>
                          <th style={{ padding: "14px 16px" }}>Date</th>
                          <th style={{ padding: "14px 16px" }}>Client</th>
                          <th style={{ padding: "14px 16px" }}>Type</th>
                          <th style={{ padding: "14px 16px" }}>Requirement Message</th>
                          <th style={{ padding: "14px 16px" }}>Status</th>
                          <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInquiries.map(inq => (
                          <tr key={inq.id} style={{ borderBottom: "1px solid #283548" }}>
                            <td style={{ padding: "14px 16px", color: "#64748b", whiteSpace: "nowrap" }}>
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ fontWeight: "600", color: "#f8fafc" }}>{inq.name}</div>
                              <div style={{ fontSize: "12px", color: "#38bdf8" }}>{inq.email}</div>
                              <div style={{ fontSize: "12px", color: "#94a3b8" }}>{inq.phone}</div>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{ background: "#0f172a", color: "#e2e8f0", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", whiteSpace: "nowrap" }}>
                                {inq.inquiryType}
                              </span>
                            </td>
                            <td style={{ padding: "14px 16px", color: "#cbd5e1", maxWidth: "340px" }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                {inq.message}
                              </div>
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
                                  cursor: "pointer"
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
                                style={{ background: "#0f172a", border: "1px solid #334155", color: "#38bdf8", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer", marginRight: "6px" }}
                              >
                                <i className="fa-solid fa-eye"></i>
                              </button>
                              {inq.phone && (
                                <a
                                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${inq.name}, Greetings from Krishna Fashion Surat. Regarding your inquiry...`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Reply on WhatsApp"
                                  style={{ background: "#065f46", color: "#6ee7b7", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", textDecoration: "none", display: "inline-block", marginRight: "6px" }}
                                >
                                  <i className="fa-brands fa-whatsapp"></i>
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                title="Delete"
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

          {/* TAB 4: CAREERS & JOBS */}
          {activeTab === "careers" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>Careers & Recruitment</h2>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Candidate applications and job openings displayed on the public /careers page</p>
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
                  style={{ background: "#15933a", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="fa-solid fa-briefcase"></i> Post New Job Opening
                </button>
              </div>

              {/* Candidate Submissions */}
              <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px", marginBottom: "28px" }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#f8fafc", margin: "0 0 16px 0" }}>Candidate Applications ({careers.length})</h3>
                {careers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>No candidate applications received yet.</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>
                          <th style={{ padding: "10px 14px" }}>Candidate</th>
                          <th style={{ padding: "10px 14px" }}>Department</th>
                          <th style={{ padding: "10px 14px" }}>Experience / Details</th>
                          <th style={{ padding: "10px 14px" }}>Status</th>
                          <th style={{ padding: "10px 14px", textAlign: "right" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {careers.map(app => (
                          <tr key={app.id} style={{ borderBottom: "1px solid #283548" }}>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontWeight: "600", color: "#f1f5f9" }}>{app.name}</div>
                              <div style={{ fontSize: "12px", color: "#38bdf8" }}>{app.email}</div>
                              <div style={{ fontSize: "12px", color: "#94a3b8" }}>{app.phone}</div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <span style={{ background: "#0f172a", color: "#e2e8f0", padding: "3px 8px", borderRadius: "4px", fontSize: "12px" }}>
                                {app.areaOfInterest}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px", color: "#cbd5e1", maxWidth: "340px" }}>
                              {app.message}
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

              {/* Active Open Positions */}
              <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#f8fafc", margin: "0 0 16px 0" }}>Live Job Openings on /careers ({jobs.length})</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                  {jobs.map(job => (
                    <div key={job.id} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>{job.title}</h4>
                        <span style={{ background: job.status === "active" ? "#065f46" : "#475569", color: "#fff", fontSize: "11px", padding: "2px 6px", borderRadius: "4px" }}>
                          {job.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#38bdf8", marginBottom: "6px" }}>
                        {job.department} · {job.location}
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

          {/* TAB 5: PLANTS & MAP SETUP */}
          {activeTab === "plants" && settingsForm && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>Plants & Google Map Management</h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Configure the 3 physical premises that appear in the interactive Google Map on Contact Us</p>
              </div>

              <form onSubmit={handleSaveSettings}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px", marginBottom: "24px" }}>
                  {/* Head Office Card */}
                  <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <span style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#15933a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fa-solid fa-building"></i>
                      </span>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "#fff" }}>Surat Head Office (ICC)</h3>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Full Address</label>
                      <textarea
                        rows={3}
                        value={settingsForm.office?.address || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, office: { ...settingsForm.office, address: e.target.value } })}
                        style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Phone 1 (Himanshu)</label>
                        <input
                          type="text"
                          value={settingsForm.office?.phone1 || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, office: { ...settingsForm.office, phone1: e.target.value } })}
                          style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "13px" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Phone 2 (Keshav)</label>
                        <input
                          type="text"
                          value={settingsForm.office?.phone2 || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, office: { ...settingsForm.office, phone2: e.target.value } })}
                          style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "13px" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Official Email</label>
                      <input
                        type="email"
                        value={settingsForm.office?.email || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, office: { ...settingsForm.office, email: e.target.value } })}
                        style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  {/* Plant 01 Card */}
                  <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <span style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#15933a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fa-solid fa-industry"></i>
                      </span>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "#fff" }}>Plant 01 (Circular Knitting)</h3>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Plant Name / Title</label>
                      <input
                        type="text"
                        value={settingsForm.plant1?.title || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, plant1: { ...settingsForm.plant1, title: e.target.value } })}
                        style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Location Address</label>
                      <textarea
                        rows={4}
                        value={settingsForm.plant1?.address || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, plant1: { ...settingsForm.plant1, address: e.target.value } })}
                        style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  {/* Plant 02 Card */}
                  <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <span style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fa-solid fa-industry"></i>
                      </span>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "#fff" }}>Plant 02 (Warp Knitting)</h3>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Plant Name / Title</label>
                      <input
                        type="text"
                        value={settingsForm.plant2?.title || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, plant2: { ...settingsForm.plant2, title: e.target.value } })}
                        style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Location Address</label>
                      <textarea
                        rows={4}
                        value={settingsForm.plant2?.address || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, plant2: { ...settingsForm.plant2, address: e.target.value } })}
                        style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ background: "#15933a", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
                >
                  Save Plant & Map Locations
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: SITE CMS & ANNOUNCEMENT */}
          {activeTab === "site_cms" && settingsForm && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>Wix-Style Content Management (CMS)</h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Directly customize public site announcement, hero headlines and manufacturing capacity numbers</p>
              </div>

              <form onSubmit={handleSaveSettings}>
                <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "24px", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", margin: "0 0 16px 0" }}>1. Manufacturing Scale Counters</h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Daily Knitting Capacity Metric</label>
                      <input
                        type="text"
                        value={settingsForm.dailyCapacity || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, dailyCapacity: e.target.value })}
                        placeholder="e.g. ~70 MT"
                        style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "10px 12px", fontSize: "14px" }}
                      />
                      <span style={{ fontSize: "11px", color: "#64748b" }}>Live on homepage metrics bar</span>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Knitting Machines Count Metric</label>
                      <input
                        type="text"
                        value={settingsForm.knittingMachines || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, knittingMachines: e.target.value })}
                        placeholder="e.g. 400+"
                        style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "10px 12px", fontSize: "14px" }}
                      />
                      <span style={{ fontSize: "11px", color: "#64748b" }}>Live on homepage metrics bar</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", margin: "24px 0 16px 0" }}>2. Announcement Banner</h3>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Top Announcement Text</label>
                    <input
                      type="text"
                      value={settingsForm.announcement || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                      placeholder="e.g. Surat's Premier Knitted Fabric Manufacturer · ~70 MT Daily Capacity"
                      style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "10px 12px", fontSize: "14px" }}
                    />
                  </div>

                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", margin: "24px 0 16px 0" }}>3. Homepage Headline & Copy</h3>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Main Headline</label>
                    <input
                      type="text"
                      value={settingsForm.homeHeadline || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, homeHeadline: e.target.value })}
                      style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "10px 12px", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Company Intro Paragraph</label>
                    <textarea
                      rows={4}
                      value={settingsForm.homeSubhead || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, homeSubhead: e.target.value })}
                      style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "10px 12px", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ background: "#15933a", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
                >
                  Publish CMS Changes Live
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: ADMIN & SECURITY */}
          {activeTab === "security" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>Admin Account & System Diagnostic</h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Change authentication credentials and monitor JavaScript backend status</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
                {/* Change Password Card */}
                <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "24px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#fff", margin: "0 0 16px 0" }}>Change Admin Password</h3>
                  <form onSubmit={handleChangePassword}>
                    <div style={{ marginBottom: "14px" }}>
                      <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Current Password</label>
                      <input
                        type="password"
                        required
                        value={pwdCurrent}
                        onChange={(e) => setPwdCurrent(e.target.value)}
                        style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "10px 12px", fontSize: "14px" }}
                      />
                    </div>
                    <div style={{ marginBottom: "14px" }}>
                      <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>New Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={pwdNew}
                        onChange={(e) => setPwdNew(e.target.value)}
                        style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "10px 12px", fontSize: "14px" }}
                      />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Confirm New Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={pwdConfirm}
                        onChange={(e) => setPwdConfirm(e.target.value)}
                        style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "10px 12px", fontSize: "14px" }}
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
                </div>

                {/* Architecture Diagnostic Card */}
                <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "24px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#fff", margin: "0 0 16px 0" }}>System Architecture Status</h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "#0f172a", borderRadius: "6px" }}>
                      <span style={{ color: "#94a3b8" }}>Backend Runtime:</span>
                      <strong style={{ color: "#22c55e" }}>Node.js Next.js 15 (JS API)</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "#0f172a", borderRadius: "6px" }}>
                      <span style={{ color: "#94a3b8" }}>Database Engine:</span>
                      <strong style={{ color: "#38bdf8" }}>Atomic JSON Store (Persistent)</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "#0f172a", borderRadius: "6px" }}>
                      <span style={{ color: "#94a3b8" }}>API Authentication:</span>
                      <strong style={{ color: "#e2e8f0" }}>HMAC-SHA256 Signed Tokens</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "#0f172a", borderRadius: "6px" }}>
                      <span style={{ color: "#94a3b8" }}>Google Maps:</span>
                      <strong style={{ color: "#22c55e" }}>Active Multi-Location Embed</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #334155" }}>
                    <a
                      href="/api/export"
                      download="krishna-fashion-complete-code.zip"
                      style={{ display: "block", textAlign: "center", background: "#0f172a", border: "1px solid #38bdf8", color: "#38bdf8", padding: "10px", borderRadius: "6px", textDecoration: "none", fontWeight: "600", fontSize: "13px" }}
                    >
                      <i className="fa-solid fa-file-zipper" style={{ marginRight: "8px" }}></i>
                      Download Complete Source Code (.ZIP)
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* DETAIL MODAL FOR CUSTOMER INQUIRY */}
      {selectedInquiry && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ maxWidth: "600px", width: "100%", background: "#1e293b", borderRadius: "14px", border: "1px solid #334155", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "#0f172a", padding: "14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
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
              <div style={{ background: "#0f172a", padding: "14px", borderRadius: "8px", border: "1px solid #334155", fontSize: "14px", color: "#e2e8f0", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                {selectedInquiry.message}
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Internal Staff Note</label>
              <textarea
                rows={3}
                value={inquiryNote}
                onChange={(e) => setInquiryNote(e.target.value)}
                placeholder="e.g. Quoted rate over call. Shared sample swatches..."
                style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#fff", padding: "10px", fontSize: "13px" }}
              />
              <button
                type="button"
                onClick={() => handleSaveInquiryNotes(selectedInquiry.id)}
                style={{ marginTop: "6px", background: "#0f172a", border: "1px solid #334155", color: "#38bdf8", padding: "5px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
              >
                Save Staff Note
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #334155", paddingTop: "16px" }}>
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
                    style={{ background: "#0f172a", border: "1px solid #334155", color: "#38bdf8", padding: "8px 14px", borderRadius: "6px", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
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

      {/* FABRIC CREATE / EDIT MODAL WITH LIVE PREVIEW */}
      {productModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ maxWidth: "640px", width: "100%", background: "#1e293b", borderRadius: "14px", border: "1px solid #334155", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: 0 }}>
                {editingProduct ? "Edit Fabric Product" : "Add New Fabric to Live Catalog"}
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
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Fabric Name / Construction *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Polyester Micro Interlock Dry-Fit"
                  style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Knitting Technology *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  >
                    <option value="circular">Circular Knitting</option>
                    <option value="warp">Warp Knitting</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Publish Status</label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  >
                    <option value="active">Active (Visible on Website)</option>
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
                    style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Width Specification</label>
                  <input
                    type="text"
                    value={productForm.width}
                    onChange={(e) => setProductForm({ ...productForm, width: e.target.value })}
                    placeholder="e.g. 58 - 62 inches"
                    style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
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
                  style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>End Applications (comma-separated)</label>
                <input
                  type="text"
                  value={productForm.applications}
                  onChange={(e) => setProductForm({ ...productForm, applications: e.target.value })}
                  placeholder="Sportswear, Activewear, Athleisure, Fashion"
                  style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              {/* Swatch Selector */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Select Fabric Thumbnail Image</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "8px" }}>
                  {presetSwatches.map((swatch, idx) => (
                    <div
                      key={idx}
                      onClick={() => setProductForm({ ...productForm, image: swatch })}
                      style={{
                        height: "56px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        border: productForm.image === swatch ? "2px solid #22c55e" : "1px solid #334155",
                        cursor: "pointer"
                      }}
                    >
                      <img src={swatch} alt="Swatch" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="Or enter custom image URL"
                  style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "6px 10px", fontSize: "12px" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Short Technical Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Soft drape, moisture management, 4-way stretch..."
                  style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid #334155", paddingTop: "14px" }}>
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
                  {editingProduct ? "Save Changes" : "Publish to Live Website"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOB OPENING MODAL */}
      {jobModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ maxWidth: "540px", width: "100%", background: "#1e293b", borderRadius: "14px", border: "1px solid #334155", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: 0 }}>
                {editingJob ? "Edit Job Position" : "Create Job Vacancy"}
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
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Job Title *</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Senior Circular Knitting Machine Technician"
                  style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Department</label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
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
                    style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  >
                    <option value="active">Active (Visible)</option>
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
                    style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Experience</label>
                  <input
                    type="text"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    placeholder="e.g. 3-5 Years"
                    style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Responsibilities</label>
                <textarea
                  rows={3}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Key responsibilities and qualifications required..."
                  style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#fff", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid #334155", paddingTop: "14px" }}>
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
                  {editingJob ? "Save Changes" : "Post Vacancy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
