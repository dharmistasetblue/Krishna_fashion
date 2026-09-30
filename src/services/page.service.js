import { PageModel, PageSectionModel } from "../config/database.js";
import { generateSlug } from "../utils/slug.js";

export class PageService {
  static async createPage(data) {
    if (!data.slug) {
      data.slug = generateSlug(data.title);
    }
    const existing = await PageModel.findOne({ slug: data.slug });
    if (existing) {
      data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
    }
    return await PageModel.create(data);
  }

  static async getPageList(query = {}) {
    const list = await PageModel.find(query);
    // Add sections count to each page for quick dashboard view
    const enriched = await Promise.all(list.map(async (page) => {
      const sections = await PageSectionModel.find({ pageId: page._id });
      return {
        ...page,
        sectionsCount: sections.length
      };
    }));
    return enriched;
  }

  static async getPageById(id) {
    return await PageModel.findById(id);
  }

  static async getPageBySlug(slug) {
    return await PageModel.findOne({ slug });
  }

  static async updatePage(id, updateData) {
    if (updateData.title && !updateData.slug) {
      updateData.slug = generateSlug(updateData.title);
    }
    return await PageModel.findByIdAndUpdate(id, updateData);
  }

  static async deletePage(id) {
    // Delete page sections associated with this page
    const sections = await PageSectionModel.find({ pageId: id });
    for (const sec of sections) {
      await PageSectionModel.softDelete(sec._id);
    }
    return await PageModel.softDelete(id);
  }
}
