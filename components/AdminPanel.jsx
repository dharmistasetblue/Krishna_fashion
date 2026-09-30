"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPanel() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("nikunj.hapani7035@gmail.com");
  const [loginPassword, setLoginPassword] = useState("Nikunj@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Active navigation tab (Wix-style CMS sidebar)
  // tabs: overview, menu_builder, page_builder, cms_blocks, modules, banners, products, inquiries, security
  const [activeTab, setActiveTab] = useState("page_builder");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // Collections state
  const [menuTree, setMenuTree] = useState([]);
  const [pages, setPages] = useState([]);
  const [cmsList, setCmsList] = useState([]);
  const [moduleList, setModuleList] = useState([]);
  const [bannerList, setBannerList] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);

  // PAGE BUILDER STATE
  const [selectedPage, setSelectedPage] = useState(null);
  const [pageSections, setPageSections] = useState([]);
  const [pageModalOpen, setPageModalOpen] = useState(false);
  const [pageForm, setPageForm] = useState({ title: "", slug: "", description: "", metaTitle: "", metaDescription: "" });
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionForm, setSectionForm] = useState({
    type: "cms",
    cmsId: "",
    moduleId: "",
    title: "",
    subtitle: "",
    backgroundImage: "",
    position: 1,
    isActive: true
  });

  // MENU BUILDER STATE
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: "",
    slug: "",
    type: "page",
    pageId: "",
    url: "",
    parentId: "",
    position: 1,
    isActive: true
  });

  // CMS BLOCK STATE
  const [cmsModalOpen, setCmsModalOpen] = useState(false);
  const [editingCms, setEditingCms] = useState(null);
  const [cmsForm, setCmsForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    image: "/assets/images/about-intro.jpg",
    isActive: true
  });

  // MODULE STATE
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleForm, setModuleForm] = useState({
    name: "",
    slug: "",
    type: "product",
    title: "",
    subtitle: "",
    configurationText: "{}",
    isActive: true
  });

  // BANNER STATE
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    menuId: "",
    pageId: "",
    desktopImage: "/assets/images/video-bg.jpg",
    mobileImage: "",
    buttonText: "Learn More",
    buttonUrl: "/about-us",
    position: 1,
    isActive: true
  });

  // Security
  const [pwdCurrent, setPwdCurrent] = useState("");
  const [pwdNew, setPwdNew] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");

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
      const [resTree, resPages, resCMS, resMods, resBanners, resInq, resProd] = await Promise.all([
        fetch("/api/menu/tree").then(r => r.json()),
        fetch("/api/page/list").then(r => r.json()),
        fetch("/api/cms/list").then(r => r.json()),
        fetch("/api/module/list").then(r => r.json()),
        fetch("/api/banner/list").then(r => r.json()),
        fetch("/api/inquiries").then(r => r.json()),
        fetch("/api/products?all=true").then(r => r.json())
      ]);

      if (resTree.data) setMenuTree(resTree.data);
      if (resPages.data) {
        setPages(resPages.data);
        if (!selectedPage && resPages.data.length > 0) {
          selectPageForBuilder(resPages.data[0]);
        }
      }
      if (resCMS.data) setCmsList(resCMS.data);
      if (resMods.data) setModuleList(resMods.data);
      if (resBanners.data) setBannerList(resBanners.data);
      if (resInq.inquiries) setInquiries(resInq.inquiries);
      if (resProd.products) setProducts(resProd.products);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      showToastMsg("Error loading records", "error");
    } finally {
      setLoadingData(false);
    }
  };

  const selectPageForBuilder = async (page) => {
    setSelectedPage(page);
    try {
      const res = await fetch(`/api/website/menu/${page.slug}`);
      const json = await res.json();
      if (json.isSuccess && json.data) {
        setPageSections(json.data.sections || []);
      } else {
        setPageSections([]);
      }
    } catch {
      setPageSections([]);
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
      showToastMsg("Welcome to Dynamic CMS & Page Builder!");
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
    } catch {}
  };

  // ---------------- PAGE ACTIONS ----------------
  const handleSavePage = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/page/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageForm)
      });
      const json = await res.json();
      if (json.isSuccess) {
        showToastMsg(`Page '${json.data.title}' created!`);
        setPages(prev => [json.data, ...prev]);
        setPageModalOpen(false);
        selectPageForBuilder(json.data);
      } else {
        showToastMsg(json.message || "Failed to create page", "error");
      }
    } catch {
      showToastMsg("Server error", "error");
    }
  };

  const handleDeletePage = async (id) => {
    if (!confirm("Are you sure? This will delete the page and its sections.")) return;
    try {
      const res = await fetch(`/api/page/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.isSuccess) {
        showToastMsg("Page deleted");
        setPages(prev => prev.filter(p => p._id !== id));
        if (selectedPage?._id === id) setSelectedPage(null);
      }
    } catch {
      showToastMsg("Failed to delete", "error");
    }
  };

  // ---------------- SECTION ACTIONS ----------------
  const openNewSectionModal = () => {
    setEditingSection(null);
    setSectionForm({
      type: "cms",
      cmsId: cmsList[0]?._id || "",
      moduleId: moduleList[0]?._id || "",
      title: "",
      subtitle: "",
      backgroundImage: "",
      position: pageSections.length + 1,
      isActive: true
    });
    setSectionModalOpen(true);
  };

  const handleSaveSection = async (e) => {
    e.preventDefault();
    if (!selectedPage) {
      showToastMsg("Select a page first", "error");
      return;
    }

    const payload = {
      pageId: selectedPage._id,
      type: sectionForm.type,
      cmsId: sectionForm.type === "cms" ? sectionForm.cmsId : undefined,
      moduleId: sectionForm.type === "module" ? sectionForm.moduleId : undefined,
      title: sectionForm.title,
      subtitle: sectionForm.subtitle,
      backgroundImage: sectionForm.backgroundImage,
      position: Number(sectionForm.position) || pageSections.length + 1,
      isActive: sectionForm.isActive
    };

    try {
      if (editingSection) {
        const res = await fetch(`/api/page-section/${editingSection._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.isSuccess) {
          showToastMsg("Section updated live!");
          setSectionModalOpen(false);
          selectPageForBuilder(selectedPage);
        } else {
          showToastMsg(json.message || "Failed to update", "error");
        }
      } else {
        const res = await fetch("/api/page-section/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.isSuccess) {
          showToastMsg("New section added to page!");
          setSectionModalOpen(false);
          selectPageForBuilder(selectedPage);
        } else {
          showToastMsg(json.message || "Failed to create section", "error");
        }
      }
    } catch {
      showToastMsg("Server communication error", "error");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm("Remove this section from page?")) return;
    try {
      const res = await fetch(`/api/page-section/${sectionId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.isSuccess) {
        showToastMsg("Section deleted");
        selectPageForBuilder(selectedPage);
      }
    } catch {
      showToastMsg("Failed to delete section", "error");
    }
  };

  // Section Reordering (1-click Move Up / Move Down calling /api/page-section/reorder)
  const handleMoveSection = async (index, direction) => {
    if (!selectedPage || pageSections.length < 2) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= pageSections.length) return;

    const newSections = [...pageSections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Build reorder payload
    const sectionsPayload = newSections.map((sec, idx) => ({
      sectionId: sec._id,
      position: idx + 1
    }));

    // Optimistically update UI
    setPageSections(newSections.map((sec, idx) => ({ ...sec, position: idx + 1 })));

    try {
      const res = await fetch("/api/page-section/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: selectedPage._id,
          sections: sectionsPayload
        })
      });
      const json = await res.json();
      if (json.isSuccess) {
        showToastMsg(`Section moved ${direction > 0 ? "down" : "up"}! Order saved.`);
      } else {
        showToastMsg(json.message || "Failed to reorder", "error");
        selectPageForBuilder(selectedPage);
      }
    } catch {
      showToastMsg("Error reordering sections", "error");
      selectPageForBuilder(selectedPage);
    }
  };

  // ---------------- MENU ACTIONS ----------------
  const openNewMenuModal = (parentId = null) => {
    setEditingMenu(null);
    setMenuForm({
      name: "",
      slug: "",
      type: "page",
      pageId: pages[0]?._id || "",
      url: "",
      parentId: parentId || "",
      position: 1,
      isActive: true
    });
    setMenuModalOpen(true);
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    try {
      if (editingMenu) {
        const res = await fetch(`/api/menu/${editingMenu._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(menuForm)
        });
        const json = await res.json();
        if (json.isSuccess) {
          showToastMsg("Menu updated live!");
          setMenuModalOpen(false);
          loadAllData();
        }
      } else {
        const res = await fetch("/api/menu/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(menuForm)
        });
        const json = await res.json();
        if (json.isSuccess) {
          showToastMsg("Menu created!");
          setMenuModalOpen(false);
          loadAllData();
        } else {
          showToastMsg(json.message || "Error creating menu", "error");
        }
      }
    } catch {
      showToastMsg("Server error", "error");
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!confirm("Delete this menu? Child menus will also be removed.")) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.isSuccess) {
        showToastMsg("Menu removed");
        loadAllData();
      }
    } catch {
      showToastMsg("Failed to delete menu", "error");
    }
  };

  // ---------------- CMS ACTIONS ----------------
  const handleSaveCMS = async (e) => {
    e.preventDefault();
    try {
      if (editingCms) {
        const res = await fetch(`/api/cms/${editingCms._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cmsForm)
        });
        const json = await res.json();
        if (json.isSuccess) {
          showToastMsg("CMS block updated! Automatically reflected on all pages.");
          setCmsModalOpen(false);
          loadAllData();
        }
      } else {
        const res = await fetch("/api/cms/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cmsForm)
        });
        const json = await res.json();
        if (json.isSuccess) {
          showToastMsg("New reusable CMS block created!");
          setCmsModalOpen(false);
          loadAllData();
        }
      }
    } catch {
      showToastMsg("Error saving CMS", "error");
    }
  };

  const handleDeleteCMS = async (id) => {
    if (!confirm("Delete this CMS block?")) return;
    try {
      const res = await fetch(`/api/cms/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToastMsg("CMS block deleted");
        loadAllData();
      }
    } catch {
      showToastMsg("Error deleting CMS", "error");
    }
  };

  // ---------------- MODULE ACTIONS ----------------
  const handleSaveModule = async (e) => {
    e.preventDefault();
    let configObj = {};
    try {
      configObj = JSON.parse(moduleForm.configurationText || "{}");
    } catch {
      showToastMsg("Configuration must be valid JSON", "error");
      return;
    }

    const payload = {
      name: moduleForm.name,
      slug: moduleForm.slug,
      type: moduleForm.type,
      title: moduleForm.title,
      subtitle: moduleForm.subtitle,
      configuration: configObj,
      isActive: moduleForm.isActive
    };

    try {
      if (editingModule) {
        const res = await fetch(`/api/module/${editingModule._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.isSuccess) {
          showToastMsg("Module updated!");
          setModuleModalOpen(false);
          loadAllData();
        }
      } else {
        const res = await fetch("/api/module/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.isSuccess) {
          showToastMsg("New module created!");
          setModuleModalOpen(false);
          loadAllData();
        }
      }
    } catch {
      showToastMsg("Error saving module", "error");
    }
  };

  const handleDeleteModule = async (id) => {
    if (!confirm("Delete this module?")) return;
    try {
      const res = await fetch(`/api/module/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToastMsg("Module deleted");
        loadAllData();
      }
    } catch {
      showToastMsg("Error deleting module", "error");
    }
  };

  // ---------------- BANNER ACTIONS ----------------
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        const res = await fetch(`/api/banner/${editingBanner._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bannerForm)
        });
        const json = await res.json();
        if (json.isSuccess) {
          showToastMsg("Banner updated!");
          setBannerModalOpen(false);
          loadAllData();
        }
      } else {
        const res = await fetch("/api/banner/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bannerForm)
        });
        const json = await res.json();
        if (json.isSuccess) {
          showToastMsg("Banner published!");
          setBannerModalOpen(false);
          loadAllData();
        }
      }
    } catch {
      showToastMsg("Error saving banner", "error");
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const res = await fetch(`/api/banner/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToastMsg("Banner deleted");
        loadAllData();
      }
    } catch {
      showToastMsg("Error deleting banner", "error");
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", color: "#0f172a", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "36px", color: "#15933a", marginBottom: "16px" }}></i>
          <p style={{ color: "#94a3b8" }}>Loading Dynamic CMS Architecture Engine...</p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN (MATCHING admin.kfins.co.in)
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Wix Madefor Text', 'Inter', sans-serif" }}>
        <div style={{ maxWidth: "450px", width: "100%", background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "40px 36px", boxShadow: "0 20px 40px -10px rgba(15, 23, 42, 0.08)" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ marginBottom: "20px" }}>
              <img
                src="/assets/images/kfins-logo.png"
                alt="K-Fins Admin"
                style={{ maxHeight: "56px", maxWidth: "240px", objectFit: "contain", margin: "0 auto", display: "block" }}
                onError={(e) => {
                  e.target.src = "/assets/images/krishna-fashion-logo.png";
                }}
              />
            </div>
            <div style={{ display: "inline-block", background: "#eef4ff", color: "#116dff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px", marginBottom: "8px" }}>
              K-Fins Administration Portal
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px 0" }}>Sign In to Account</h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Enter your admin credentials to access the CMS portal</p>
          </div>

          {loginError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#334155", fontWeight: "600", marginBottom: "6px" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "12px", color: "#94a3b8" }}>
                  <i className="fa-regular fa-envelope"></i>
                </span>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", borderRadius: "8px", padding: "11px 14px 11px 38px", fontSize: "14px", outline: "none", transition: "border 0.2s" }}
                  placeholder="nikunj.hapani7035@gmail.com"
                />
              </div>
            </div>

            <div style={{ marginBottom: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", color: "#334155", fontWeight: "600" }}>Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: "none", border: "none", color: "#116dff", fontSize: "12px", cursor: "pointer", fontWeight: "600", padding: 0 }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "12px", color: "#94a3b8" }}>
                  <i className="fa-solid fa-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", borderRadius: "8px", padding: "11px 14px 11px 38px", fontSize: "14px", outline: "none" }}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Credential Helper Box */}
            <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "10px", padding: "12px 14px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: "12px", color: "#475569" }}>
                <div>Account: <strong style={{ color: "#0f172a" }}>nikunj.hapani7035@gmail.com</strong></div>
                <div>Pass: <strong style={{ color: "#0f172a" }}>Nikunj@123</strong></div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail("nikunj.hapani7035@gmail.com");
                  setLoginPassword("Nikunj@123");
                }}
                style={{ background: "#eef4ff", border: "1px solid #bfdbfe", color: "#116dff", fontSize: "11px", fontWeight: "700", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}
              >
                Auto Fill
              </button>
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              style={{
                width: "100%",
                background: "#116dff",
                border: "none",
                color: "#ffffff",
                padding: "13px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(17, 109, 255, 0.25)",
                transition: "all 0.2s"
              }}
            >
              {loginSubmitting ? (
                <span><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i> Authenticating...</span>
              ) : (
                "Sign In to K-Fins Admin"
              )}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link href="/" style={{ color: "#64748b", fontSize: "13px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // K-FINS ADMIN WORKSPACE (MATCHING https://admin.kfins.co.in/)
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f6f8fb", color: "#0f172a", fontFamily: "'Wix Madefor Text', 'Inter', sans-serif" }}>
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          padding: "12px 20px",
          borderRadius: "8px",
          background: toast.type === "error" ? "#dc2626" : "#116dff",
          color: "#0f172a",
          boxShadow: "0 10px 25px rgba(17, 109, 255, 0.25)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "14px",
          fontWeight: "600"
        }}>
          <i className={toast.type === "error" ? "fa-solid fa-triangle-exclamation" : "fa-solid fa-circle-check"}></i>
          {toast.msg}
        </div>
      )}

      {/* 1. K-FINS SIDEBAR */}
      <aside style={{
        width: sidebarCollapsed ? "72px" : "260px",
        background: "#ffffff",
        borderRight: "1px solid #e3e6ec",
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
        <div style={{ padding: "16px 18px", borderBottom: "1px solid #e3e6ec", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {!sidebarCollapsed ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
              <img
                src="/assets/images/kfins-logo.png"
                alt="K-Fins Admin"
                style={{ maxHeight: "38px", maxWidth: "160px", objectFit: "contain" }}
                onError={(e) => {
                  e.target.src = "/assets/images/krishna-fashion-logo.png";
                }}
              />
            </div>
          ) : (
            <div style={{ width: "36px", height: "36px", margin: "0 auto", borderRadius: "8px", background: "#116dff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", fontWeight: "800" }}>
              K
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

        {/* Sidebar Nav Items (Matching admin.kfins.co.in) */}
        <div style={{ padding: "14px 0", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
          {!sidebarCollapsed && <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", padding: "6px 20px 4px 20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>MAIN NAVIGATION</div>}

          {[
            { id: "overview", label: "Dashboard", icon: "fa-gauge-high" },
            { id: "menu_builder", label: "Menu", icon: "fa-bars-staggered", badge: menuTree.length },
            { id: "cms_blocks", label: "CMS", icon: "fa-file-lines", badge: cmsList.length },
            { id: "page_builder", label: "Page Builder", icon: "fa-cubes", badge: pages.length },
            { id: "banners", label: "Hero Banners", icon: "fa-image", badge: bannerList.length },
            { id: "products", label: "Products", icon: "fa-box-archive", badge: products.length },
            { id: "modules", label: "Manufacturing Facility", icon: "fa-industry", badge: 2 },
            { id: "testimonials", label: "Our Clients & Reviews", icon: "fa-handshake" },
            { id: "inquiries", label: "Contact Inquiries", icon: "fa-inbox", badge: inquiries.filter(i => i.status === "new").length, badgeColor: "#ef4444" },
            { id: "security", label: "Website Settings & SEO", icon: "fa-gear" }
          ].map(item => {
            const isActive = activeTab === item.id || (item.id === "overview" && activeTab === "overview") || (item.id === "testimonials" && activeTab === "testimonials");
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === "testimonials") setActiveTab("modules");
                  else setActiveTab(item.id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: sidebarCollapsed ? "center" : "space-between",
                  gap: "12px",
                  padding: "10px 18px",
                  background: isActive ? "#eef4ff" : "transparent",
                  color: isActive ? "#116dff" : "#475569",
                  border: "none",
                  borderLeft: isActive ? "3px solid #116dff" : "3px solid transparent",
                  cursor: "pointer",
                  fontWeight: isActive ? "700" : "500",
                  fontSize: "13px",
                  width: "100%",
                  textAlign: "left",
                  transition: "all 0.15s"
                }}
                title={sidebarCollapsed ? item.label : ""}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <i className={`fa-solid ${item.icon}`} style={{ color: isActive ? "#116dff" : "#64748b", width: "16px", textAlign: "center" }}></i>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.badge !== undefined && Boolean(item.badge) && (
                  <span style={{ background: item.badgeColor || (isActive ? "#116dff" : "#e2e8f0"), color: isActive || item.badgeColor ? "#fff" : "#475569", fontSize: "11px", fontWeight: "700", padding: "1px 7px", borderRadius: "10px" }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer User Card (Nikunj Hapani) */}
        <div style={{ padding: "14px 18px", borderTop: "1px solid #e3e6ec", background: "#f8fafc" }}>
          {!sidebarCollapsed ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#116dff", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", flexShrink: 0 }}>
                  N
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                    {user?.name || "Nikunj Hapani"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                    nikunj.hapani7035@gmail.com
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: "4px" }}
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", width: "100%", textAlign: "center" }}
              title="Logout"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          )}
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>
        
        {/* Top Header Bar (Matching admin.kfins.co.in) */}
        <header style={{
          height: "64px",
          background: "#ffffff",
          borderBottom: "1px solid #e3e6ec",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          position: "sticky",
          top: 0,
          zIndex: 40
        }}>
          {/* Quick Shortcuts like admin.kfins.co.in */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              style={{ background: "#eef4ff", border: "1px solid #bfdbfe", color: "#116dff", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <i className="fa-solid fa-plus"></i> Add Product
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("page_builder")}
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              Page Builder
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("modules")}
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              Our Clients
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              Website Settings
            </button>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={loadAllData}
              disabled={loadingData}
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b", padding: "7px 12px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              title="Refresh"
            >
              <i className={`fa-solid fa-rotate-right ${loadingData ? "fa-spin" : ""}`} style={{ color: "#116dff" }}></i>
              <span>Refresh</span>
            </button>

            <a
              href="/api/export"
              download="krishna-fashion-complete-code.zip"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#116dff", padding: "7px 14px", borderRadius: "6px", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}
            >
              <i className="fa-solid fa-file-zipper"></i>
              <span>Export .ZIP</span>
            </a>

            {selectedPage && (
              <a
                href={`/p/${selectedPage.slug}`}
                target="_blank"
                rel="noreferrer"
                style={{ background: "#116dff", color: "#0f172a", padding: "7px 14px", borderRadius: "6px", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", boxShadow: "0 2px 6px rgba(17, 109, 255, 0.25)" }}
              >
                <span>Live Page</span>
                <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "11px" }}></i>
              </a>
            )}
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <main style={{ padding: "32px 28px", flex: 1, maxWidth: "1400px", width: "100%", boxSizing: "border-box", margin: "0 auto" }}>
          
          {/* TAB: PAGE BUILDER & SECTIONS (THE CORE REQUIREMENT) */}
          {activeTab === "page_builder" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>Dynamic Page Builder</h2>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Configure pages, add CMS or Module sections, and reorder positions live</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => {
                      setPageForm({ title: "", slug: "", description: "", metaTitle: "", metaDescription: "" });
                      setPageModalOpen(true);
                    }}
                    style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", color: "#38bdf8", padding: "9px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <i className="fa-solid fa-file-circle-plus"></i> Create New Page
                  </button>
                  <button
                    onClick={openNewSectionModal}
                    disabled={!selectedPage}
                    style={{ background: "#116dff", color: "#ffffff", border: "none", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: selectedPage ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <i className="fa-solid fa-plus"></i> Add Section to Page
                  </button>
                </div>
              </div>

              {/* Page Selector Tabs */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "6px" }}>
                {pages.map(page => (
                  <button
                    key={page._id}
                    onClick={() => selectPageForBuilder(page)}
                    style={{
                      background: selectedPage?._id === page._id ? "#15933a" : "#1e293b",
                      color: selectedPage?._id === page._id ? "#fff" : "#94a3b8",
                      border: "1px solid",
                      borderColor: selectedPage?._id === page._id ? "#15933a" : "#334155",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      cursor: "pointer",
                      fontWeight: selectedPage?._id === page._id ? "700" : "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    <i className="fa-regular fa-file"></i>
                    <span>{page.title}</span>
                    <span style={{ background: selectedPage?._id === page._id ? "rgba(0,0,0,0.2)" : "#0f172a", padding: "1px 6px", borderRadius: "10px", fontSize: "11px" }}>
                      /{page.slug}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Page Builder Viewport */}
              {selectedPage && (
                <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px", alignItems: "start" }}>
                  
                  {/* Left Column: Page Metadata & SEO Card */}
                  <div style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", borderRadius: "12px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#22c55e", textTransform: "uppercase" }}>Active Page</span>
                        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "2px 0 0 0" }}>{selectedPage.title}</h3>
                      </div>
                      <a
                        href={`/p/${selectedPage.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="View Live Page"
                        style={{ color: "#38bdf8", fontSize: "14px" }}
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </a>
                    </div>

                    <div style={{ fontSize: "13px", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div>
                        <strong style={{ color: "#cbd5e1" }}>URL Slug:</strong>
                        <div style={{ background: "#f8fafc", padding: "6px 10px", borderRadius: "6px", marginTop: "2px", color: "#38bdf8", fontFamily: "monospace" }}>
                          /p/{selectedPage.slug}
                        </div>
                      </div>
                      <div>
                        <strong style={{ color: "#cbd5e1" }}>Meta Title:</strong>
                        <div style={{ color: "#e2e8f0" }}>{selectedPage.metaTitle || "Default SEO Title"}</div>
                      </div>
                      <div>
                        <strong style={{ color: "#cbd5e1" }}>Description:</strong>
                        <div style={{ color: "#94a3b8" }}>{selectedPage.description || "N/A"}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #334155" }}>
                      <button
                        onClick={() => handleDeletePage(selectedPage._id)}
                        style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", width: "100%" }}
                      >
                        Delete Page
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Ordered Page Sections Builder */}
                  <div style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", borderRadius: "12px", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <div>
                        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                          Page Sections ({pageSections.length})
                        </h3>
                        <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0 0" }}>
                          Use the Up/Down arrows to reorder. Live API returns sections sorted by position.
                        </p>
                      </div>
                      <button
                        onClick={openNewSectionModal}
                        style={{ background: "#116dff", color: "#ffffff", border: "none", padding: "7px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <i className="fa-solid fa-plus"></i> Add Section
                      </button>
                    </div>

                    {pageSections.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "40px", border: "2px dashed #334155", borderRadius: "10px", color: "#64748b" }}>
                        <i className="fa-solid fa-cubes" style={{ fontSize: "32px", marginBottom: "12px", display: "block" }}></i>
                        No sections added to this page yet. Click "Add Section" to attach a CMS content block or dynamic Module!
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {pageSections.map((sec, idx) => (
                          <div
                            key={sec._id}
                            style={{
                              background: "#f8fafc",
                              border: "1px solid #e3e6ec",
                              borderRadius: "10px",
                              padding: "16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "16px"
                            }}
                          >
                            {/* Position & Order Buttons */}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveSection(idx, -1)}
                                  title="Move Up"
                                  style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", color: idx === 0 ? "#475569" : "#38bdf8", padding: "4px 8px", borderRadius: "4px", cursor: idx === 0 ? "not-allowed" : "pointer", fontSize: "11px" }}
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === pageSections.length - 1}
                                  onClick={() => handleMoveSection(idx, 1)}
                                  title="Move Down"
                                  style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", color: idx === pageSections.length - 1 ? "#475569" : "#38bdf8", padding: "4px 8px", borderRadius: "4px", cursor: idx === pageSections.length - 1 ? "not-allowed" : "pointer", fontSize: "11px" }}
                                >
                                  ▼
                                </button>
                              </div>

                              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", color: "#22c55e" }}>
                                {sec.position || idx + 1}
                              </div>
                            </div>

                            {/* Section Details */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                <span style={{
                                  background: sec.type === "cms" ? "#065f46" : "#1e40af",
                                  color: "#0f172a",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  textTransform: "uppercase"
                                }}>
                                  {sec.type}
                                </span>
                                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
                                  {sec.title || (sec.type === "cms" ? sec.cms?.title : sec.module?.title || sec.module?.name) || `Section ${idx + 1}`}
                                </h4>
                              </div>
                              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                                {sec.type === "cms" ? (
                                  <span>Referencing CMS: <strong style={{ color: "#cbd5e1" }}>{sec.cms?.title || "CMS Block"}</strong></span>
                                ) : (
                                  <span>Referencing Module: <strong style={{ color: "#38bdf8" }}>{sec.module?.name || "Module"} ({sec.module?.type})</strong></span>
                                )}
                                {sec.subtitle && ` · Subtitle: "${sec.subtitle}"`}
                              </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <button
                                onClick={() => {
                                  setEditingSection(sec);
                                  setSectionForm({
                                    type: sec.type,
                                    cmsId: sec.cms?._id || "",
                                    moduleId: sec.module?._id || "",
                                    title: sec.title || "",
                                    subtitle: sec.subtitle || "",
                                    backgroundImage: sec.backgroundImage || "",
                                    position: sec.position,
                                    isActive: true
                                  });
                                  setSectionModalOpen(true);
                                }}
                                style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", color: "#38bdf8", padding: "6px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSection(sec._id)}
                                style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "6px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: MENU & SUBMENU TREE BUILDER */}
          {activeTab === "menu_builder" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>Dynamic Menu & Submenu Tree</h2>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Create nested multi-level navigation trees (Root Menus, Submenus, Page/Product/URL links)</p>
                </div>
                <button
                  onClick={() => openNewMenuModal(null)}
                  style={{ background: "#116dff", color: "#ffffff", border: "none", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="fa-solid fa-plus"></i> Add Root Menu
                </button>
              </div>

              <div style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", borderRadius: "12px", padding: "24px" }}>
                {menuTree.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>No menus created yet.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {menuTree.map((menu, mIdx) => (
                      <div key={menu._id} style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ width: "24px", height: "24px", borderRadius: "4px", background: "#116dff", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700" }}>
                              {mIdx + 1}
                            </span>
                            <div>
                              <strong style={{ fontSize: "15px", color: "#0f172a" }}>{menu.name}</strong>
                              <span style={{ fontSize: "12px", color: "#38bdf8", marginLeft: "10px" }}>
                                [type: {menu.type} · slug: {menu.slug}]
                              </span>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => openNewMenuModal(menu._id)}
                              style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", color: "#22c55e", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                            >
                              + Add Submenu
                            </button>
                            <button
                              onClick={() => handleDeleteMenu(menu._id)}
                              style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Submenu Children */}
                        {menu.children && menu.children.length > 0 && (
                          <div style={{ marginTop: "12px", paddingLeft: "32px", borderLeft: "2px solid #334155", display: "flex", flexDirection: "column", gap: "8px" }}>
                            {menu.children.map((sub, sIdx) => (
                              <div key={sub._id} style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", borderRadius: "6px", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                  <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "600" }}>↳ {sub.name}</span>
                                  <span style={{ color: "#94a3b8", fontSize: "12px", marginLeft: "8px" }}>({sub.url || sub.slug})</span>
                                </div>
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button
                                    onClick={() => openNewMenuModal(sub._id)}
                                    style={{ background: "#f8fafc", border: "1px solid #cbd5e1", color: "#22c55e", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                                  >
                                    + Sub
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMenu(sub._id)}
                                    style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: REUSABLE CMS CONTENT */}
          {activeTab === "cms_blocks" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>Reusable CMS Content Blocks</h2>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Create content once and reuse it across multiple pages (Section 3 & 23 requirement)</p>
                </div>
                <button
                  onClick={() => {
                    setEditingCms(null);
                    setCmsForm({ title: "", slug: "", description: "", content: "", image: "/assets/images/about-intro.jpg", isActive: true });
                    setCmsModalOpen(true);
                  }}
                  style={{ background: "#116dff", color: "#ffffff", border: "none", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="fa-solid fa-plus"></i> Create CMS Block
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                {cmsList.map(cms => (
                  <div key={cms._id} style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{cms.title}</h3>
                        <span style={{ background: "#065f46", color: "#0f172a", fontSize: "11px", padding: "2px 6px", borderRadius: "4px" }}>
                          Active
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#38bdf8", marginBottom: "10px" }}>
                        slug: {cms.slug}
                      </div>
                      <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.4", margin: "0 0 12px 0" }}>
                        {cms.description}
                      </p>
                      {cms.image && (
                        <div style={{ height: "120px", borderRadius: "8px", overflow: "hidden", marginBottom: "12px", background: "#f8fafc" }}>
                          <img src={cms.image} alt={cms.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #334155", paddingTop: "12px" }}>
                      <button
                        onClick={() => {
                          setEditingCms(cms);
                          setCmsForm({ ...cms });
                          setCmsModalOpen(true);
                        }}
                        style={{ flex: 1, background: "#f8fafc", border: "1px solid #cbd5e1", color: "#38bdf8", padding: "7px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}
                      >
                        Edit Block
                      </button>
                      <button
                        onClick={() => handleDeleteCMS(cms._id)}
                        style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "7px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MODULES */}
          {activeTab === "modules" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>Dynamic Modules</h2>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Configure dynamic components (Banner, Product, Project, Testimonial, Contact Form)</p>
                </div>
                <button
                  onClick={() => {
                    setEditingModule(null);
                    setModuleForm({ name: "", slug: "", type: "product", title: "", subtitle: "", configurationText: "{}", isActive: true });
                    setModuleModalOpen(true);
                  }}
                  style={{ background: "#116dff", color: "#ffffff", border: "none", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="fa-solid fa-plus"></i> Create Module
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {moduleList.map(mod => (
                  <div key={mod._id} style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{mod.name}</h3>
                        <span style={{ background: "#1e40af", color: "#0f172a", fontSize: "11px", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                          {mod.type}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>
                        <strong>Title:</strong> {mod.title || "N/A"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>
                        slug: {mod.slug}
                      </div>
                      <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "6px", fontSize: "11px", color: "#64748b", fontFamily: "monospace", maxHeight: "100px", overflowY: "auto", marginBottom: "14px" }}>
                        {JSON.stringify(mod.configuration, null, 2)}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #334155", paddingTop: "12px" }}>
                      <button
                        onClick={() => {
                          setEditingModule(mod);
                          setModuleForm({
                            ...mod,
                            configurationText: JSON.stringify(mod.configuration || {}, null, 2)
                          });
                          setModuleModalOpen(true);
                        }}
                        style={{ flex: 1, background: "#f8fafc", border: "1px solid #cbd5e1", color: "#38bdf8", padding: "7px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}
                      >
                        Configure
                      </button>
                      <button
                        onClick={() => handleDeleteModule(mod._id)}
                        style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "7px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BANNERS */}
          {activeTab === "banners" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>Page & Menu Banners</h2>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Configure dynamic hero banners associated with specific menus and pages</p>
                </div>
                <button
                  onClick={() => {
                    setEditingBanner(null);
                    setBannerForm({ title: "", subtitle: "", menuId: "", pageId: pages[0]?._id || "", desktopImage: "/assets/images/video-bg.jpg", mobileImage: "", buttonText: "Explore", buttonUrl: "/about-us", position: 1, isActive: true });
                    setBannerModalOpen(true);
                  }}
                  style={{ background: "#116dff", color: "#ffffff", border: "none", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="fa-solid fa-plus"></i> Add Banner
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                {bannerList.map(banner => (
                  <div key={banner._id} style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ height: "160px", position: "relative", background: "#f8fafc" }}>
                      <img src={banner.desktopImage || "/assets/images/about-intro.jpg"} alt={banner.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <h4 style={{ margin: "0 0 6px 0", fontSize: "16px", color: "#0f172a", fontWeight: "700" }}>{banner.title}</h4>
                        <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 10px 0" }}>{banner.subtitle}</p>
                        <div style={{ fontSize: "12px", color: "#38bdf8" }}>
                          CTA: "{banner.buttonText}" → {banner.buttonUrl}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "14px", borderTop: "1px solid #334155", paddingTop: "12px" }}>
                        <button
                          onClick={() => {
                            setEditingBanner(banner);
                            setBannerForm({ ...banner });
                            setBannerModalOpen(true);
                          }}
                          style={{ flex: 1, background: "#f8fafc", border: "1px solid #cbd5e1", color: "#38bdf8", padding: "6px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner._id)}
                          style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FABRICS */}
          {activeTab === "products" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>Fabric Catalog Items</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {products.map(prod => (
                  <div key={prod.id} style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", borderRadius: "10px", padding: "16px" }}>
                    <div style={{ height: "140px", borderRadius: "6px", overflow: "hidden", marginBottom: "10px" }}>
                      <img src={prod.image || "/assets/images/products/circular/1.jpg"} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", color: "#0f172a" }}>{prod.name}</h4>
                    <div style={{ fontSize: "12px", color: "#38bdf8", marginBottom: "4px" }}>{prod.gsm} · {prod.width}</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>{prod.composition}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: INQUIRIES */}
          {activeTab === "inquiries" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Customer Enquiries CRM</h2>
                <a href="/api/inquiries?export=csv" download style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", color: "#38bdf8", padding: "7px 14px", borderRadius: "6px", fontSize: "13px", textDecoration: "none" }}>
                  Export CSV
                </a>
              </div>
              <div style={{ background: "#ffffff", borderRadius: "10px", border: "1px solid #e3e6ec", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e3e6ec", color: "#94a3b8" }}>
                      <th style={{ padding: "10px 14px" }}>Date</th>
                      <th style={{ padding: "10px 14px" }}>Client</th>
                      <th style={{ padding: "10px 14px" }}>Message</th>
                      <th style={{ padding: "10px 14px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map(inq => (
                      <tr key={inq.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px 14px", color: "#64748b" }}>{new Date(inq.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <strong style={{ color: "#0f172a" }}>{inq.name}</strong>
                          <div style={{ fontSize: "12px", color: "#38bdf8" }}>{inq.phone}</div>
                        </td>
                        <td style={{ padding: "10px 14px", color: "#cbd5e1" }}>{inq.message}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ background: inq.status === "new" ? "#065f46" : "#334155", color: "#0f172a", padding: "2px 6px", borderRadius: "4px", fontSize: "11px" }}>
                            {inq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ARCHITECTURE & SECURITY */}
          {activeTab === "security" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>Dynamic CMS Architecture Status</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                <div style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", borderRadius: "12px", padding: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 14px 0" }}>RESTful API Endpoints</h3>
                  <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "8px", fontFamily: "monospace" }}>
                    <div><span style={{ color: "#22c55e" }}>GET</span> /api/website/menu/:slug</div>
                    <div><span style={{ color: "#22c55e" }}>GET</span> /api/website/navigation</div>
                    <div><span style={{ color: "#38bdf8" }}>POST</span> /api/page/create</div>
                    <div><span style={{ color: "#38bdf8" }}>POST</span> /api/page-section/create</div>
                    <div><span style={{ color: "#eab308" }}>PUT</span> /api/page-section/reorder</div>
                    <div><span style={{ color: "#38bdf8" }}>POST</span> /api/menu/create</div>
                    <div><span style={{ color: "#eab308" }}>PUT</span> /api/menu/reorder</div>
                    <div><span style={{ color: "#38bdf8" }}>POST</span> /api/cms/create</div>
                    <div><span style={{ color: "#38bdf8" }}>POST</span> /api/module/create</div>
                    <div><span style={{ color: "#38bdf8" }}>POST</span> /api/banner/create</div>
                  </div>
                </div>

                <div style={{ background: "#ffffff", border: "1px solid #e3e6ec", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", borderRadius: "12px", padding: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 14px 0" }}>Source Code Export</h3>
                  <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.5", marginBottom: "16px" }}>
                    Download the complete, self-contained project code including all Controllers, Services, Models, Validators, and frontend builders.
                  </p>
                  <a
                    href="/api/export"
                    download="krishna-fashion-complete-code.zip"
                    style={{ display: "block", textAlign: "center", background: "#116dff", color: "#ffffff", padding: "10px", borderRadius: "6px", textDecoration: "none", fontWeight: "700", fontSize: "14px" }}
                  >
                    <i className="fa-solid fa-file-zipper" style={{ marginRight: "8px" }}></i>
                    Download Complete Source Code (.ZIP)
                  </a>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: CREATE PAGE */}
      {pageModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ maxWidth: "500px", width: "100%", background: "#ffffff", borderRadius: "14px", border: "1px solid #e3e6ec", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)", padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>Create New Website Page</h3>
            <form onSubmit={handleSavePage}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Page Title *</label>
                <input
                  type="text"
                  required
                  value={pageForm.title}
                  onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                  placeholder="e.g. Sustainable Manufacturing"
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>URL Slug (optional)</label>
                <input
                  type="text"
                  value={pageForm.slug}
                  onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                  placeholder="auto-generated from title"
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Meta SEO Title</label>
                <input
                  type="text"
                  value={pageForm.metaTitle}
                  onChange={(e) => setPageForm({ ...pageForm, metaTitle: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Page Description</label>
                <textarea
                  rows={3}
                  value={pageForm.description}
                  onChange={(e) => setPageForm({ ...pageForm, description: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button type="button" onClick={() => setPageModalOpen(false)} style={{ background: "#334155", color: "#0f172a", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#116dff", color: "#ffffff", border: "none", padding: "8px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Create Page</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PAGE SECTION (THE PAGE BUILDER HEART) */}
      {sectionModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ maxWidth: "560px", width: "100%", background: "#ffffff", borderRadius: "14px", border: "1px solid #e3e6ec", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)", padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>
              {editingSection ? "Edit Page Section" : `Add Section to '${selectedPage?.title}'`}
            </h3>
            <form onSubmit={handleSaveSection}>
              {/* Type Switcher: CMS vs MODULE */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Section Component Type *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setSectionForm({ ...sectionForm, type: "cms" })}
                    style={{
                      background: sectionForm.type === "cms" ? "#065f46" : "#0f172a",
                      color: sectionForm.type === "cms" ? "#fff" : "#94a3b8",
                      border: "1px solid",
                      borderColor: sectionForm.type === "cms" ? "#22c55e" : "#334155",
                      padding: "10px",
                      borderRadius: "6px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    <i className="fa-solid fa-newspaper" style={{ marginRight: "6px" }}></i>
                    Reusable CMS Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setSectionForm({ ...sectionForm, type: "module" })}
                    style={{
                      background: sectionForm.type === "module" ? "#1e40af" : "#0f172a",
                      color: sectionForm.type === "module" ? "#fff" : "#94a3b8",
                      border: "1px solid",
                      borderColor: sectionForm.type === "module" ? "#3b82f6" : "#334155",
                      padding: "10px",
                      borderRadius: "6px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    <i className="fa-solid fa-puzzle-piece" style={{ marginRight: "6px" }}></i>
                    Dynamic Module
                  </button>
                </div>
              </div>

              {/* Selector based on Type */}
              {sectionForm.type === "cms" ? (
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Select Reusable CMS Block *</label>
                  <select
                    required
                    value={sectionForm.cmsId}
                    onChange={(e) => setSectionForm({ ...sectionForm, cmsId: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "9px 12px", fontSize: "14px" }}
                  >
                    <option value="">-- Choose a CMS block --</option>
                    {cmsList.map(cms => (
                      <option key={cms._id} value={cms._id}>{cms.title} (slug: {cms.slug})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Select Dynamic Module *</label>
                  <select
                    required
                    value={sectionForm.moduleId}
                    onChange={(e) => setSectionForm({ ...sectionForm, moduleId: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "9px 12px", fontSize: "14px" }}
                  >
                    <option value="">-- Choose a Module --</option>
                    {moduleList.map(mod => (
                      <option key={mod._id} value={mod._id}>{mod.name} (type: {mod.type})</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Section Headline (optional)</label>
                  <input
                    type="text"
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                    placeholder="Overrides block title"
                    style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Section Kicker / Subtitle</label>
                  <input
                    type="text"
                    value={sectionForm.subtitle}
                    onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                    placeholder="e.g. INDUSTRIAL CAPACITY"
                    style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Background Image URL (optional)</label>
                <input
                  type="text"
                  value={sectionForm.backgroundImage}
                  onChange={(e) => setSectionForm({ ...sectionForm, backgroundImage: e.target.value })}
                  placeholder="/assets/images/about-intro.jpg"
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid #334155", paddingTop: "14px" }}>
                <button type="button" onClick={() => setSectionModalOpen(false)} style={{ background: "#334155", color: "#0f172a", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#116dff", color: "#ffffff", border: "none", padding: "8px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                  {editingSection ? "Save Section Changes" : "Add Section to Page"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MENU */}
      {menuModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ maxWidth: "500px", width: "100%", background: "#ffffff", borderRadius: "14px", border: "1px solid #e3e6ec", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)", padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>
              {editingMenu ? "Edit Menu Item" : "Create New Menu / Submenu"}
            </h3>
            <form onSubmit={handleSaveMenu}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Menu Label *</label>
                <input
                  type="text"
                  required
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  placeholder="e.g. Products, About Us, Gold, Diamond"
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Menu Type *</label>
                  <select
                    value={menuForm.type}
                    onChange={(e) => setMenuForm({ ...menuForm, type: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                  >
                    <option value="page">Page Reference</option>
                    <option value="custom">Custom URL</option>
                    <option value="external">External Link</option>
                    <option value="product">Product Listing</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Parent Menu</label>
                  <select
                    value={menuForm.parentId || ""}
                    onChange={(e) => setMenuForm({ ...menuForm, parentId: e.target.value || null })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                  >
                    <option value="">None (Root Menu)</option>
                    {menuTree.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {menuForm.type === "page" ? (
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Select Page *</label>
                  <select
                    required
                    value={menuForm.pageId}
                    onChange={(e) => setMenuForm({ ...menuForm, pageId: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                  >
                    <option value="">-- Choose a Page --</option>
                    {pages.map(p => (
                      <option key={p._id} value={p._id}>{p.title} (/p/{p.slug})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Target URL *</label>
                  <input
                    type="text"
                    value={menuForm.url}
                    onChange={(e) => setMenuForm({ ...menuForm, url: e.target.value })}
                    placeholder="/circular-knitting or https://example.com"
                    style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button type="button" onClick={() => setMenuModalOpen(false)} style={{ background: "#334155", color: "#0f172a", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#116dff", color: "#ffffff", border: "none", padding: "8px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Save Menu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT CMS BLOCK */}
      {cmsModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ maxWidth: "560px", width: "100%", background: "#ffffff", borderRadius: "14px", border: "1px solid #e3e6ec", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)", padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>
              {editingCms ? "Edit Reusable CMS Block" : "Create Reusable CMS Block"}
            </h3>
            <form onSubmit={handleSaveCMS}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Block Title *</label>
                <input
                  type="text"
                  required
                  value={cmsForm.title}
                  onChange={(e) => setCmsForm({ ...cmsForm, title: e.target.value })}
                  placeholder="e.g. About Our Infrastructure"
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Short Description</label>
                <input
                  type="text"
                  value={cmsForm.description}
                  onChange={(e) => setCmsForm({ ...cmsForm, description: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Image Asset URL</label>
                <input
                  type="text"
                  value={cmsForm.image}
                  onChange={(e) => setCmsForm({ ...cmsForm, image: e.target.value })}
                  placeholder="/assets/images/about-intro.jpg"
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>HTML / Rich Content</label>
                <textarea
                  rows={4}
                  value={cmsForm.content}
                  onChange={(e) => setCmsForm({ ...cmsForm, content: e.target.value })}
                  placeholder="<p>Enter formatted content...</p>"
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button type="button" onClick={() => setCmsModalOpen(false)} style={{ background: "#334155", color: "#0f172a", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#116dff", color: "#ffffff", border: "none", padding: "8px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Save CMS Block</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MODULE CONFIG */}
      {moduleModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ maxWidth: "540px", width: "100%", background: "#ffffff", borderRadius: "14px", border: "1px solid #e3e6ec", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)", padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>
              {editingModule ? "Configure Module" : "Create Dynamic Module"}
            </h3>
            <form onSubmit={handleSaveModule}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Module Name *</label>
                <input
                  type="text"
                  required
                  value={moduleForm.name}
                  onChange={(e) => setModuleForm({ ...moduleForm, name: e.target.value })}
                  placeholder="e.g. Featured Products Collection"
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Module Type *</label>
                  <select
                    value={moduleForm.type}
                    onChange={(e) => setModuleForm({ ...moduleForm, type: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                  >
                    <option value="product">Product Listing</option>
                    <option value="project">Projects / Infrastructure</option>
                    <option value="testimonial">Client Testimonials</option>
                    <option value="contact">Contact Form</option>
                    <option value="banner">Banner Slider</option>
                    <option value="gallery">Gallery</option>
                    <option value="custom">Custom JSON</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Display Headline</label>
                  <input
                    type="text"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Configuration (JSON)</label>
                <textarea
                  rows={4}
                  value={moduleForm.configurationText}
                  onChange={(e) => setModuleForm({ ...moduleForm, configurationText: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "13px", fontFamily: "monospace" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button type="button" onClick={() => setModuleModalOpen(false)} style={{ background: "#334155", color: "#0f172a", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#116dff", color: "#ffffff", border: "none", padding: "8px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Save Module</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BANNER */}
      {bannerModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ maxWidth: "520px", width: "100%", background: "#ffffff", borderRadius: "14px", border: "1px solid #e3e6ec", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)", padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>
              {editingBanner ? "Edit Page Banner" : "Create Page Banner"}
            </h3>
            <form onSubmit={handleSaveBanner}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Assign to Page *</label>
                <select
                  required
                  value={bannerForm.pageId}
                  onChange={(e) => setBannerForm({ ...bannerForm, pageId: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                >
                  <option value="">-- Choose a Page --</option>
                  {pages.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Banner Main Title *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Subtitle</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Background Image URL *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.desktopImage}
                  onChange={(e) => setBannerForm({ ...bannerForm, desktopImage: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.buttonText}
                    onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>Button URL</label>
                  <input
                    type="text"
                    value={bannerForm.buttonUrl}
                    onChange={(e) => setBannerForm({ ...bannerForm, buttonUrl: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", padding: "8px 12px", fontSize: "14px" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button type="button" onClick={() => setBannerModalOpen(false)} style={{ background: "#334155", color: "#0f172a", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#116dff", color: "#ffffff", border: "none", padding: "8px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Save Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
