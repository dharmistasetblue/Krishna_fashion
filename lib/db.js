import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");

// Initial Seed Data
const DEFAULT_SETTINGS = {
  companyName: "Krishna Fashion",
  tagline: "Your trusted partner for dependable knitted fabric solutions",
  establishedYear: "2014",
  dailyCapacity: "~70 MT",
  knittingMachines: "400+",
  announcement: "Surat's Leading Knitted Fabric Enterprise · ~70 MT Daily Capacity · 400+ Knitting Machines",
  announcementActive: true,
  homeHeadline: "Engineered Fabrics. Industrial Scale. Global Perspective.",
  homeSubhead: "KRISHNA FASHION is a textile manufacturing enterprise based in Surat, Gujarat, India, specialising in the production of polyester-based circular knitted and warp knitted fabrics.",
  office: {
    address: "B-306, International Commerce Centre (ICC Building), Nr. Kadiwala School, Opp. Civil Hospital, Ring Road, Surat – 395002, Gujarat, India",
    phone1: "+91 89809 82777",
    contact1: "Himanshu Mittal",
    phone2: "+91 99586 35125",
    contact2: "Keshav Choudhary",
    email: "info@krishnafashion.co",
    whatsapp: "+918980982777"
  },
  plant1: {
    title: "Plant 01 (Circular Knitting)",
    address: "P. No. 1 to 3, B. No. 96, Varethi Gam Road, Nr. Moulwand Patia, Vill. Karanj, Dist. Surat, Gujarat, India"
  },
  plant2: {
    title: "Plant 02 (Warp Knitting)",
    address: "P. No. 9 to 18, B. No. 95, Varethi Gam Road, Nr. Molvand Patia, Vill. Karanj, Tal. Mandvi, Dist. Surat, Gujarat, India"
  }
};

const DEFAULT_ADMIN = {
  email: "admin@krishnafashion.co",
  // sha256 of "admin123" with default salt
  passwordHash: crypto.createHash("sha256").update("admin123").digest("hex"),
  name: "Krishna Fashion Admin",
  role: "superadmin"
};

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Polyester Interlock Dry-Fit",
    category: "circular",
    gsm: "140 - 220 GSM",
    width: "60 - 64 inches",
    composition: "100% Micro Polyester",
    applications: ["Sportswear", "Activewear", "Athleisure"],
    description: "High-tenacity moisture wicking dry-fit fabric with superior soft handfeel and breathability.",
    status: "active",
    image: "/assets/images/products/circular/1.jpg",
    createdAt: "2026-09-15T10:00:00.000Z"
  },
  {
    id: "prod-2",
    name: "Single Jersey Spandex / Lycra",
    category: "circular",
    gsm: "160 - 240 GSM",
    width: "58 - 62 inches",
    composition: "92% Polyester, 8% Spandex",
    applications: ["Fashion Apparel", "Innerwear", "Activewear"],
    description: "4-way high stretch single jersey with excellent shape retention and drape.",
    status: "active",
    image: "/assets/images/products/circular/2.jpg",
    createdAt: "2026-09-16T11:30:00.000Z"
  },
  {
    id: "prod-3",
    name: "Bird-Eye Mesh Active Knit",
    category: "circular",
    gsm: "130 - 180 GSM",
    width: "60 inches",
    composition: "100% Recycled Polyester",
    applications: ["Sportswear", "Performance Apparel"],
    description: "Classic sports eyelet mesh engineered for rapid sweat evaporation and ventilation.",
    status: "active",
    image: "/assets/images/products/circular/3.jpg",
    createdAt: "2026-09-17T09:15:00.000Z"
  },
  {
    id: "prod-4",
    name: "Polyester Jacquard Textured Knit",
    category: "circular",
    gsm: "180 - 260 GSM",
    width: "58 inches",
    composition: "100% Micro Polyester",
    applications: ["Fashion Apparel", "Loungewear"],
    description: "Rich self-patterned jacquard knit with dimensional surface texture and durable wash fastness.",
    status: "active",
    image: "/assets/images/products/circular/4.jpg",
    createdAt: "2026-09-18T14:20:00.000Z"
  },
  {
    id: "prod-5",
    name: "High-Gauge Tricot Dazzle Mesh",
    category: "warp",
    gsm: "110 - 170 GSM",
    width: "58 - 64 inches",
    composition: "100% Polyester Filament",
    applications: ["Sportswear", "Performance Apparel"],
    description: "Precision warp knit dazzle fabric with run-resistant lock-stitch construction.",
    status: "active",
    image: "/assets/images/products/warp/1.jpg",
    createdAt: "2026-09-19T08:45:00.000Z"
  },
  {
    id: "prod-6",
    name: "Super-Soft Warp Knit Brushed Fleece",
    category: "warp",
    gsm: "220 - 320 GSM",
    width: "60 inches",
    composition: "100% Polyester",
    applications: ["Loungewear", "Specialised Textile"],
    description: "Thermally insulating warp knitted plush fabric with single/double-side peach brush finish.",
    status: "active",
    image: "/assets/images/products/warp/2.jpg",
    createdAt: "2026-09-20T13:00:00.000Z"
  },
  {
    id: "prod-7",
    name: "High-Tension Warp Elastic Power Net",
    category: "warp",
    gsm: "150 - 250 GSM",
    width: "54 - 60 inches",
    composition: "85% Polyester, 15% Elastane",
    applications: ["Innerwear", "Performance Apparel"],
    description: "Heavy compression mesh with extreme lateral recovery and warp stability.",
    status: "active",
    image: "/assets/images/products/warp/3.jpg",
    createdAt: "2026-09-21T16:10:00.000Z"
  }
];

const DEFAULT_INQUIRIES = [
  {
    id: "inq-101",
    name: "Rajesh Singhania",
    email: "rajesh@sportstyleindia.com",
    phone: "+91 98251 44520",
    inquiryType: "Product Inquiry",
    message: "We need 5,000 meters of 180 GSM dry-fit interlock fabric for our upcoming summer sportswear collection. Please share sample swatches and bulk pricing.",
    status: "new",
    notes: "",
    createdAt: "2026-09-28T09:20:00.000Z"
  },
  {
    id: "inq-102",
    name: "Meera Patel",
    email: "procurement@vibrantexports.co",
    phone: "+91 98790 12345",
    inquiryType: "Manufacturing Inquiry",
    message: "Looking for contract manufacturing partnership for continuous supply of Warp Tricot fabric (approx 15 MT monthly). Please connect for plant visit.",
    status: "in_progress",
    notes: "Followed up on call. Requested specification sheet.",
    createdAt: "2026-09-27T14:40:00.000Z"
  },
  {
    id: "inq-103",
    name: "Vikram Malhotra",
    email: "vikram@athleisuregear.in",
    phone: "+91 98111 87654",
    inquiryType: "Business Inquiry",
    message: "Enquiring about customized jacquard patterns and minimum order quantities for activewear fabrics.",
    status: "contacted",
    notes: "Catalog and MOQ terms emailed.",
    createdAt: "2026-09-25T11:10:00.000Z"
  }
];

const DEFAULT_JOBS = [
  {
    id: "job-1",
    title: "Senior Circular Knitting Machine Technician",
    department: "Production & Operations",
    location: "Karanj Plant 01, Surat",
    experience: "4-7 Years",
    type: "Full-Time",
    status: "active",
    description: "Expertise in Mayer & Cie / Terrot / Fukuhara circular knitting machines, tension adjustment, cam setup and troubleshooting."
  },
  {
    id: "job-2",
    title: "Quality Assurance & Lab Inspector",
    department: "Quality",
    location: "Surat",
    experience: "2-5 Years",
    type: "Full-Time",
    status: "active",
    description: "Testing GSM, elongation, color fastness, shrinkage and maintaining 4-point fabric inspection standards."
  },
  {
    id: "job-3",
    title: "Technical Textile Sales Executive",
    department: "Sales & Customer Relations",
    location: "Ring Road Office, Surat",
    experience: "3-6 Years",
    type: "Full-Time",
    status: "active",
    description: "Generating domestic B2B orders for warp & circular knitted fabrics among sportswear and garment brands."
  }
];

const DEFAULT_CAREERS = [
  {
    id: "app-201",
    name: "Anand Verma",
    email: "anand.verma.textile@gmail.com",
    phone: "+91 94280 77312",
    areaOfInterest: "Production & Operations",
    message: "Diploma in Textile Technology with 5 years experience managing high-speed circular knitting lines at leading textile mills in Surat.",
    status: "under_review",
    notes: "Strong machine experience.",
    createdAt: "2026-09-26T15:30:00.000Z"
  },
  {
    id: "app-202",
    name: "Pooja Trivedi",
    email: "pooja.trivedi.qa@outlook.com",
    phone: "+91 97245 88910",
    areaOfInterest: "Quality",
    message: "B.Tech in Textile Chemistry. Experienced in knitted fabric testing, shade matching and AQL defect analysis.",
    status: "interview_scheduled",
    notes: "Interview scheduled for Tuesday.",
    createdAt: "2026-09-24T10:15:00.000Z"
  }
];

async function ensureDataFile(filename, defaultContent) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const filepath = path.join(DATA_DIR, filename);
    try {
      const data = await fs.readFile(filepath, "utf8");
      return JSON.parse(data);
    } catch {
      await fs.writeFile(filepath, JSON.stringify(defaultContent, null, 2), "utf8");
      return defaultContent;
    }
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultContent;
  }
}

async function writeDataFile(filename, data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filepath = path.join(DATA_DIR, filename);
  const tempPath = filepath + ".tmp." + Date.now();
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tempPath, filepath);
}

// Database helper functions in pure JavaScript
export const db = {
  // Inquiries
  async getInquiries() {
    return ensureDataFile("inquiries.json", DEFAULT_INQUIRIES);
  },
  async createInquiry(payload) {
    const list = await this.getInquiries();
    const newInquiry = {
      id: "inq-" + Date.now(),
      name: payload.name || "Anonymous",
      email: payload.email || "",
      phone: payload.phone || "",
      inquiryType: payload.inquiryType || "General",
      message: payload.message || "",
      status: "new",
      notes: "",
      createdAt: new Date().toISOString()
    };
    list.unshift(newInquiry);
    await writeDataFile("inquiries.json", list);
    return newInquiry;
  },
  async updateInquiry(id, updates) {
    const list = await this.getInquiries();
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
    await writeDataFile("inquiries.json", list);
    return list[idx];
  },
  async deleteInquiry(id) {
    const list = await this.getInquiries();
    const filtered = list.filter(i => i.id !== id);
    await writeDataFile("inquiries.json", filtered);
    return true;
  },

  // Products
  async getProducts() {
    return ensureDataFile("products.json", DEFAULT_PRODUCTS);
  },
  async createProduct(payload) {
    const list = await this.getProducts();
    const newProduct = {
      id: "prod-" + Date.now(),
      name: payload.name || "New Fabric",
      category: payload.category || "circular",
      gsm: payload.gsm || "180 GSM",
      width: payload.width || "60 inches",
      composition: payload.composition || "100% Polyester",
      applications: Array.isArray(payload.applications) ? payload.applications : [payload.applications || "Sportswear"],
      description: payload.description || "",
      status: payload.status || "active",
      image: payload.image || "/assets/images/products/circular/1.jpg",
      createdAt: new Date().toISOString()
    };
    list.unshift(newProduct);
    await writeDataFile("products.json", list);
    return newProduct;
  },
  async updateProduct(id, updates) {
    const list = await this.getProducts();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
    await writeDataFile("products.json", list);
    return list[idx];
  },
  async deleteProduct(id) {
    const list = await this.getProducts();
    const filtered = list.filter(p => p.id !== id);
    await writeDataFile("products.json", filtered);
    return true;
  },

  // Careers / Applications
  async getCareers() {
    return ensureDataFile("careers.json", DEFAULT_CAREERS);
  },
  async createCareerApplication(payload) {
    const list = await this.getCareers();
    const newApp = {
      id: "app-" + Date.now(),
      name: payload.name || "Applicant",
      email: payload.email || "",
      phone: payload.phone || "",
      areaOfInterest: payload.areaOfInterest || "Production & Operations",
      message: payload.message || "",
      resumeLink: payload.resumeLink || "",
      status: "under_review",
      notes: "",
      createdAt: new Date().toISOString()
    };
    list.unshift(newApp);
    await writeDataFile("careers.json", list);
    return newApp;
  },
  async updateCareerApplication(id, updates) {
    const list = await this.getCareers();
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
    await writeDataFile("careers.json", list);
    return list[idx];
  },
  async deleteCareerApplication(id) {
    const list = await this.getCareers();
    const filtered = list.filter(a => a.id !== id);
    await writeDataFile("careers.json", filtered);
    return true;
  },

  // Job Openings
  async getJobs() {
    return ensureDataFile("jobs.json", DEFAULT_JOBS);
  },
  async createJob(payload) {
    const list = await this.getJobs();
    const newJob = {
      id: "job-" + Date.now(),
      title: payload.title || "Open Position",
      department: payload.department || "Operations",
      location: payload.location || "Surat",
      experience: payload.experience || "2+ Years",
      type: payload.type || "Full-Time",
      status: payload.status || "active",
      description: payload.description || "",
      createdAt: new Date().toISOString()
    };
    list.unshift(newJob);
    await writeDataFile("jobs.json", list);
    return newJob;
  },
  async updateJob(id, updates) {
    const list = await this.getJobs();
    const idx = list.findIndex(j => j.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    await writeDataFile("jobs.json", list);
    return list[idx];
  },
  async deleteJob(id) {
    const list = await this.getJobs();
    const filtered = list.filter(j => j.id !== id);
    await writeDataFile("jobs.json", filtered);
    return true;
  },

  // Settings
  async getSettings() {
    return ensureDataFile("settings.json", DEFAULT_SETTINGS);
  },
  async updateSettings(updates) {
    const settings = await this.getSettings();
    const merged = { ...settings, ...updates };
    await writeDataFile("settings.json", merged);
    return merged;
  },

  // Admin Auth
  async getAdmin() {
    return ensureDataFile("admin.json", DEFAULT_ADMIN);
  },
  async updateAdminPassword(newPassword) {
    const admin = await this.getAdmin();
    const newHash = crypto.createHash("sha256").update(newPassword).digest("hex");
    admin.passwordHash = newHash;
    await writeDataFile("admin.json", admin);
    return true;
  },
  async verifyAdmin(email, password) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const hash = crypto.createHash("sha256").update(password).digest("hex");

    // Check specific credentials requested by user
    if (cleanEmail === "nikunj.hapani7035@gmail.com" && (password === "Nikunj@123" || hash === crypto.createHash("sha256").update("Nikunj@123").digest("hex"))) {
      return {
        email: "nikunj.hapani7035@gmail.com",
        name: "Nikunj Hapani",
        role: "superadmin"
      };
    }

    const admin = await this.getAdmin();
    if (admin.email.toLowerCase() === cleanEmail && admin.passwordHash === hash) {
      return {
        email: admin.email,
        name: admin.name,
        role: admin.role
      };
    }

    // Also check UserModel repository
    try {
      const fs = require("fs");
      const path = require("path");
      const usersFile = path.join(process.cwd(), "data", "cms_db", "users.json");
      if (fs.existsSync(usersFile)) {
        const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
        const found = users.find(u => u.email.toLowerCase() === cleanEmail && u.passwordHash === hash);
        if (found) {
          return {
            email: found.email,
            name: found.name,
            role: found.role
          };
        }
      }
    } catch {}

    return null;
  }
};
