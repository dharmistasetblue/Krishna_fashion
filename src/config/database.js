import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_DIR = path.join(process.cwd(), "data", "cms_db");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

function getCollectionFile(name) {
  return path.join(DB_DIR, `${name}.json`);
}

function loadCollection(name) {
  const file = getCollectionFile(name);
  if (!fs.existsSync(file)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read collection ${name}:`, err);
    return [];
  }
}

function saveCollection(name, data) {
  const file = getCollectionFile(name);
  const temp = `${file}.tmp.${Date.now()}`;
  fs.writeFileSync(temp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(temp, file);
}

// Generate MongoDB-style ObjectId hex string
export function generateId() {
  return crypto.randomBytes(12).toString("hex");
}

class BaseRepository {
  constructor(collectionName) {
    this.name = collectionName;
  }

  async getAll() {
    return loadCollection(this.name);
  }

  async find(filter = {}) {
    const records = loadCollection(this.name);
    return records.filter(item => {
      // Soft delete handling: default exclude isDeleted: true unless filter explicitly asks
      if (filter.isDeleted === undefined && item.isDeleted) return false;

      for (const [key, val] of Object.entries(filter)) {
        if (key === "$or" && Array.isArray(val)) {
          const matchOr = val.some(condition => {
            return Object.entries(condition).every(([k, v]) => String(item[k] || "") === String(v));
          });
          if (!matchOr) return false;
          continue;
        }
        if (val !== undefined && item[key] !== val) {
          // Compare object ids or stringified values
          if (String(item[key]) !== String(val)) {
            return false;
          }
        }
      }
      return true;
    });
  }

  async findById(id) {
    const records = loadCollection(this.name);
    return records.find(item => item._id === id || item.id === id) || null;
  }

  async findOne(filter = {}) {
    const results = await this.find(filter);
    return results[0] || null;
  }

  async create(data) {
    const records = loadCollection(this.name);
    const newDoc = {
      _id: generateId(),
      ...data,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    records.push(newDoc);
    saveCollection(this.name, records);
    return newDoc;
  }

  async findByIdAndUpdate(id, updateData) {
    const records = loadCollection(this.name);
    const idx = records.findIndex(item => item._id === id || item.id === id);
    if (idx === -1) return null;

    const existing = records[idx];
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    records[idx] = updated;
    saveCollection(this.name, records);
    return updated;
  }

  async softDelete(id) {
    return this.findByIdAndUpdate(id, { isDeleted: true });
  }

  async findByIdAndDelete(id) {
    const records = loadCollection(this.name);
    const idx = records.findIndex(item => item._id === id || item.id === id);
    if (idx === -1) return null;
    const deleted = records.splice(idx, 1)[0];
    saveCollection(this.name, records);
    return deleted;
  }

  async count(filter = {}) {
    const results = await this.find(filter);
    return results.length;
  }
}

// Model Repositories
export const UserModel = new BaseRepository("users");
export const MenuModel = new BaseRepository("menus");
export const PageModel = new BaseRepository("pages");
export const PageSectionModel = new BaseRepository("page_sections");
export const CMSModel = new BaseRepository("cms");
export const ModuleModel = new BaseRepository("modules");
export const ProductModel = new BaseRepository("products");
export const CategoryModel = new BaseRepository("categories");
export const BannerModel = new BaseRepository("banners");
export const MediaModel = new BaseRepository("media");

// Seed Database with the Complete Structure from requirements
export async function seedDatabaseIfEmpty() {
  const usersCount = await UserModel.count();
  if (usersCount === 0) {
    // 1. Seed Admin User
    await UserModel.create({
      name: "Krishna Fashion Admin",
      email: "admin@krishnafashion.co",
      passwordHash: crypto.createHash("sha256").update("admin123").digest("hex"),
      role: "superadmin"
    });
  }

  const cmsCount = await CMSModel.count();
  if (cmsCount === 0) {
    // 2. Seed CMS Reusable Content
    const aboutCMS = await CMSModel.create({
      title: "About Our Company",
      slug: "about-company",
      description: "Premier textile manufacturing enterprise based in Surat, Gujarat.",
      content: "<p>KRISHNA FASHION is a high-capacity textile enterprise with ~70 MT daily capacity and over 400 advanced knitting machines. We specialize in circular and warp knitted fabrics engineered for performance sportswear, activewear, and fashion.</p>",
      image: "/assets/images/about-intro.jpg",
      images: [
        "/assets/images/marquee/circular-knitting/circular/1.jpg",
        "/assets/images/marquee/circular-knitting/circular/2.jpg"
      ],
      isActive: true
    });

    const missionCMS = await CMSModel.create({
      title: "Our Mission & Vision",
      slug: "mission-and-vision",
      description: "Excellence in yarn manufacturing and sustainable textile processes.",
      content: "<p>To build a dependable, world-class knitted fabric manufacturing infrastructure powered by precision engineering, sustainable solar power, and reliable supply chains.</p>",
      image: "/assets/images/mission.jpg",
      images: [],
      isActive: true
    });

    const contactCMS = await CMSModel.create({
      title: "Contact Information",
      slug: "contact-info",
      description: "Surat Ring Road Head Office and State-of-the-art Karanj plants.",
      content: "<p>Head Office: B-306, International Commerce Centre (ICC Building), Ring Road, Surat. Plants in Karanj & Mandvi, Surat.</p>",
      image: "/assets/images/contact-banner.jpg",
      images: [],
      isActive: true
    });

    // 3. Seed Modules
    const bannerModule = await ModuleModel.create({
      name: "Home Hero Banner Slider",
      slug: "home-hero-banner",
      type: "banner",
      title: "Engineered Fabrics. Industrial Scale.",
      subtitle: "Surat's Premier Knitted Fabric Manufacturing Facility",
      configuration: {
        autoplay: true,
        slides: [
          { title: "Circular Knitting", image: "/assets/images/products/circular/1.jpg" },
          { title: "Warp Knitting", image: "/assets/images/products/warp/1.jpg" }
        ]
      },
      isActive: true
    });

    const featuredProductsModule = await ModuleModel.create({
      name: "Featured Knitted Fabrics",
      slug: "featured-fabrics",
      type: "product",
      title: "Featured Fabric Collection",
      subtitle: "Engineered for activewear and apparel",
      configuration: {
        limit: 6,
        category: "all"
      },
      isActive: true
    });

    const projectsModule = await ModuleModel.create({
      name: "Our Industrial Infrastructure",
      slug: "industrial-infrastructure",
      type: "project",
      title: "Plant 01 & Plant 02",
      subtitle: "Over 400 knitting machines with ~70 MT daily capacity",
      configuration: {
        items: [
          { name: "Plant 01 Karanj", machines: 250, type: "Circular" },
          { name: "Plant 02 Mandvi", machines: 150, type: "Warp" }
        ]
      },
      isActive: true
    });

    const testimonialsModule = await ModuleModel.create({
      name: "Client Testimonials",
      slug: "testimonials",
      type: "testimonial",
      title: "Trusted by Global Brands",
      subtitle: "What our apparel partners say",
      configuration: {
        testimonials: [
          { client: "SportStyle India", feedback: "Consistent 180 GSM dry-fit interlock fabric quality for all our sportswear collections." }
        ]
      },
      isActive: true
    });

    const contactFormModule = await ModuleModel.create({
      name: "Direct Contact & Enquiry Form",
      slug: "contact-form",
      type: "contact",
      title: "Start a Conversation",
      subtitle: "To manufacture better. To grow together.",
      configuration: {
        recipientEmail: "info@krishnafashion.co"
      },
      isActive: true
    });

    // 4. Seed Pages
    const homePage = await PageModel.create({
      title: "Home",
      slug: "home",
      description: "Welcome to Krishna Fashion - Advanced Textile Manufacturing",
      metaTitle: "Krishna Fashion | Premier Knitted Fabric Manufacturer Surat",
      metaDescription: "Polyester-based circular and warp knitted fabrics manufactured at industrial scale.",
      metaKeywords: "circular knitting, warp knitting, polyester fabric, surat textiles",
      isActive: true
    });

    const aboutPage = await PageModel.create({
      title: "About Us",
      slug: "about-us",
      description: "Learn about Krishna Fashion's history, capabilities, and scale.",
      metaTitle: "About Us | Krishna Fashion Surat",
      metaDescription: "Founded in 2014, leading producer of technical knitted fabrics.",
      metaKeywords: "about krishna fashion, textile plant surat",
      isActive: true
    });

    const productsPage = await PageModel.create({
      title: "Products",
      slug: "products",
      description: "Explore our complete range of circular and warp knitted fabrics.",
      metaTitle: "Fabric Products | Krishna Fashion",
      metaDescription: "Interlock, single jersey, dry-fit, tricot, and mesh fabrics.",
      metaKeywords: "polyester fabric, dry fit, interlock, mesh",
      isActive: true
    });

    const projectsPage = await PageModel.create({
      title: "Projects & Facilities",
      slug: "projects",
      description: "Our high-speed knitting infrastructure and capacity.",
      metaTitle: "Facilities | Krishna Fashion",
      metaDescription: "400+ knitting machines and 70 MT daily capacity.",
      metaKeywords: "textile infrastructure, manufacturing plant",
      isActive: true
    });

    const contactPage = await PageModel.create({
      title: "Contact Us",
      slug: "contact-us",
      description: "Get in touch with our marketing and technical teams in Surat.",
      metaTitle: "Contact Us | Krishna Fashion",
      metaDescription: "Contact our Surat office or manufacturing plants for samples and orders.",
      metaKeywords: "contact krishna fashion, textile enquiry surat",
      isActive: true
    });

    // 5. Seed PageSections (The Core of the Page Builder)
    // Home Page Sections
    await PageSectionModel.create({
      pageId: homePage._id,
      type: "module",
      moduleId: bannerModule._id,
      title: "Hero Banner",
      subtitle: "",
      position: 1,
      isActive: true
    });

    await PageSectionModel.create({
      pageId: homePage._id,
      type: "cms",
      cmsId: aboutCMS._id,
      title: "About Our Enterprise",
      subtitle: "Pioneering Fabric Engineering",
      position: 2,
      isActive: true
    });

    await PageSectionModel.create({
      pageId: homePage._id,
      type: "module",
      moduleId: featuredProductsModule._id,
      title: "Featured Fabrics",
      subtitle: "Our Top Selling Circular & Warp Knit Collections",
      position: 3,
      isActive: true
    });

    await PageSectionModel.create({
      pageId: homePage._id,
      type: "module",
      moduleId: projectsModule._id,
      title: "Manufacturing Powerhouse",
      subtitle: "Explore Plant 01 & Plant 02",
      position: 4,
      isActive: true
    });

    await PageSectionModel.create({
      pageId: homePage._id,
      type: "cms",
      cmsId: contactCMS._id,
      title: "Get in Touch",
      subtitle: "Connect with our technical sales division",
      position: 5,
      isActive: true
    });

    // About Us Page Sections
    await PageSectionModel.create({
      pageId: aboutPage._id,
      type: "cms",
      cmsId: aboutCMS._id,
      title: "Company Heritage",
      subtitle: "Established in 2014 in Surat",
      position: 1,
      isActive: true
    });

    await PageSectionModel.create({
      pageId: aboutPage._id,
      type: "cms",
      cmsId: missionCMS._id,
      title: "Our Guiding Principles",
      subtitle: "Vision & Sustainability",
      position: 2,
      isActive: true
    });

    await PageSectionModel.create({
      pageId: aboutPage._id,
      type: "module",
      moduleId: testimonialsModule._id,
      title: "Client Testimonials",
      subtitle: "Hear From Leading Apparel Brands",
      position: 3,
      isActive: true
    });

    // Products Page Sections
    await PageSectionModel.create({
      pageId: productsPage._id,
      type: "module",
      moduleId: featuredProductsModule._id,
      title: "All Engineered Knitted Fabrics",
      subtitle: "Circular & Warp Knitting Capabilities",
      position: 1,
      isActive: true
    });

    // Contact Us Page Sections
    await PageSectionModel.create({
      pageId: contactPage._id,
      type: "cms",
      cmsId: contactCMS._id,
      title: "Our Locations",
      subtitle: "Head Office & Manufacturing Units",
      position: 1,
      isActive: true
    });

    await PageSectionModel.create({
      pageId: contactPage._id,
      type: "module",
      moduleId: contactFormModule._id,
      title: "Send Inquiry",
      subtitle: "We respond within 24 business hours",
      position: 2,
      isActive: true
    });

    // 6. Seed Menus (with Nested Submenu Tree according to Section 1 & Section 11)
    const homeMenu = await MenuModel.create({
      name: "Home",
      slug: "home",
      type: "page",
      pageId: homePage._id,
      parentId: null,
      position: 1,
      isActive: true
    });

    const aboutMenu = await MenuModel.create({
      name: "About Us",
      slug: "about-us",
      type: "page",
      pageId: aboutPage._id,
      parentId: null,
      position: 2,
      isActive: true
    });

    const productsMenu = await MenuModel.create({
      name: "Products",
      slug: "products",
      type: "page",
      pageId: productsPage._id,
      parentId: null,
      position: 3,
      isActive: true
    });

    // Nested Submenus under Products: Gold, Diamond (with Rings, Necklaces), Silver
    const goldSubmenu = await MenuModel.create({
      name: "Circular Knitting",
      slug: "circular-knitting",
      type: "custom",
      url: "/circular-knitting",
      parentId: productsMenu._id,
      position: 1,
      isActive: true
    });

    const diamondSubmenu = await MenuModel.create({
      name: "Warp Knitting",
      slug: "warp-knitting",
      type: "custom",
      url: "/warp-knitting",
      parentId: productsMenu._id,
      position: 2,
      isActive: true
    });

    // Sub-submenus under Warp Knitting (Testing multi-level nesting)
    await MenuModel.create({
      name: "Tricot Fabrics",
      slug: "tricot-fabrics",
      type: "custom",
      url: "/warp-knitting#tricot",
      parentId: diamondSubmenu._id,
      position: 1,
      isActive: true
    });

    await MenuModel.create({
      name: "Mesh & Raschel",
      slug: "mesh-fabrics",
      type: "custom",
      url: "/warp-knitting#mesh",
      parentId: diamondSubmenu._id,
      position: 2,
      isActive: true
    });

    const silverSubmenu = await MenuModel.create({
      name: "Technical Textiles",
      slug: "technical-textiles",
      type: "custom",
      url: "/circular-knitting#specialized",
      parentId: productsMenu._id,
      position: 3,
      isActive: true
    });

    const projectsMenu = await MenuModel.create({
      name: "Projects",
      slug: "projects",
      type: "page",
      pageId: projectsPage._id,
      parentId: null,
      position: 4,
      isActive: true
    });

    const contactMenu = await MenuModel.create({
      name: "Contact Us",
      slug: "contact-us",
      type: "page",
      pageId: contactPage._id,
      parentId: null,
      position: 5,
      isActive: true
    });

    // 7. Seed Banners (Menu-wise Page Banners as in Section 13)
    await BannerModel.create({
      menuId: homeMenu._id,
      pageId: homePage._id,
      title: "Industrial Scale Knitted Textiles",
      subtitle: "Manufacturing ~70 MT Daily Capacity in Surat, Gujarat",
      desktopImage: "/assets/images/video-bg.jpg",
      mobileImage: "/assets/images/video-bg-mobile.jpg",
      buttonText: "Explore Products",
      buttonUrl: "/products",
      position: 1,
      isActive: true
    });

    await BannerModel.create({
      menuId: aboutMenu._id,
      pageId: aboutPage._id,
      title: "A Decade of Textile Excellence",
      subtitle: "400+ Advanced Circular and Warp Knitting Machines",
      desktopImage: "/assets/images/about-intro.jpg",
      mobileImage: "/assets/images/about-intro.jpg",
      buttonText: "Our Infrastructure",
      buttonUrl: "/projects",
      position: 1,
      isActive: true
    });

    await BannerModel.create({
      menuId: productsMenu._id,
      pageId: productsPage._id,
      title: "High-Performance Polyester Fabrics",
      subtitle: "Interlock, Single Jersey, Spandex, Dry-Fit, Mesh",
      desktopImage: "/assets/images/products/circular/1.jpg",
      mobileImage: "/assets/images/products/circular/1.jpg",
      buttonText: "Request Swatches",
      buttonUrl: "/contact-us",
      position: 1,
      isActive: true
    });
  }
}

// Auto-seed on load
seedDatabaseIfEmpty().catch(err => console.error("Database seed error:", err));
