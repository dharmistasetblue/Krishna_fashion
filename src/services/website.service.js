import { MenuModel, PageModel, PageSectionModel, CMSModel, ModuleModel, BannerModel, ProductModel } from "../config/database.js";

export class WebsiteService {
  static async getWebsiteByMenuSlug(slug) {
    if (!slug) {
      throw new Error("Menu slug is required");
    }

    // 1. Find the Menu by slug
    let menu = await MenuModel.findOne({ slug, isActive: true });
    
    // Fallback: if not found by menu slug, try finding directly by page slug
    let page = null;
    if (!menu) {
      page = await PageModel.findOne({ slug, isActive: true });
      if (!page) {
        return null;
      }
      // Look for a menu pointing to this page
      menu = await MenuModel.findOne({ pageId: page._id, isActive: true }) || {
        name: page.title,
        slug: page.slug,
        type: "page",
        pageId: page._id,
        position: 1,
        isActive: true
      };
    } else if (menu.type === "page" && menu.pageId) {
      page = await PageModel.findById(menu.pageId);
    }

    if (!page && menu.pageId) {
      page = await PageModel.findById(menu.pageId);
    }

    // 2. Find Banner associated with this Menu or Page
    let banner = null;
    if (menu._id) {
      banner = await BannerModel.findOne({ menuId: menu._id, isActive: true });
    }
    if (!banner && page?._id) {
      banner = await BannerModel.findOne({ pageId: page._id, isActive: true });
    }

    // 3. Find PageSections for this Page, sorted by position
    let sections = [];
    if (page?._id) {
      const rawSections = await PageSectionModel.find({ pageId: page._id, isActive: true });
      // Sort ascending by position
      rawSections.sort((a, b) => (a.position || 0) - (b.position || 0));

      // 4. Populate each section with referenced CMS or Module
      sections = await Promise.all(rawSections.map(async (sec) => {
        const item = {
          _id: sec._id,
          position: sec.position,
          type: sec.type,
          title: sec.title || "",
          subtitle: sec.subtitle || "",
          backgroundImage: sec.backgroundImage || ""
        };

        if (sec.type === "cms" && sec.cmsId) {
          const cmsData = await CMSModel.findById(sec.cmsId);
          item.cms = cmsData && !cmsData.isDeleted ? cmsData : null;
        } else if (sec.type === "module" && sec.moduleId) {
          const moduleData = await ModuleModel.findById(sec.moduleId);
          if (moduleData && !moduleData.isDeleted) {
            item.module = { ...moduleData };
            // If it's a product module, attach live products list
            if (moduleData.type === "product") {
              const liveProducts = await ProductModel.find({ status: "active" });
              item.module.data = liveProducts;
            }
          } else {
            item.module = null;
          }
        }

        return item;
      }));
    }

    return {
      menu,
      page,
      banner,
      sections
    };
  }

  // Get full nested menu tree for header navigation
  static async getPublicMenuTree() {
    const allMenus = await MenuModel.find({ isActive: true });
    allMenus.sort((a, b) => (a.position || 0) - (b.position || 0));

    // Build hierarchy
    const menuMap = {};
    const rootMenus = [];

    allMenus.forEach(m => {
      menuMap[m._id] = { ...m, children: [] };
    });

    allMenus.forEach(m => {
      if (m.parentId && menuMap[m.parentId]) {
        menuMap[m.parentId].children.push(menuMap[m._id]);
      } else {
        rootMenus.push(menuMap[m._id]);
      }
    });

    return rootMenus;
  }
}
