import { CMSModel } from "../config/database.js";
import { generateSlug } from "../utils/slug.js";

export class CMSService {
  static async createCMS(data) {
    if (!data.slug) {
      data.slug = generateSlug(data.title);
    }
    const existing = await CMSModel.findOne({ slug: data.slug });
    if (existing) {
      data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
    }
    return await CMSModel.create(data);
  }

  static async getCMSList(query = {}) {
    return await CMSModel.find(query);
  }

  static async getCMSById(id) {
    return await CMSModel.findById(id);
  }

  static async updateCMS(id, updateData) {
    if (updateData.title && !updateData.slug) {
      updateData.slug = generateSlug(updateData.title);
    }
    return await CMSModel.findByIdAndUpdate(id, updateData);
  }

  static async deleteCMS(id) {
    return await CMSModel.softDelete(id);
  }
}
