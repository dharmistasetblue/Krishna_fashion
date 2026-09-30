import { ModuleModel } from "../config/database.js";
import { generateSlug } from "../utils/slug.js";

export class ModuleService {
  static async createModule(data) {
    if (!data.slug) {
      data.slug = generateSlug(data.name);
    }
    const existing = await ModuleModel.findOne({ slug: data.slug });
    if (existing) {
      data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
    }
    return await ModuleModel.create(data);
  }

  static async getModuleList(query = {}) {
    return await ModuleModel.find(query);
  }

  static async getModuleById(id) {
    return await ModuleModel.findById(id);
  }

  static async updateModule(id, updateData) {
    if (updateData.name && !updateData.slug) {
      updateData.slug = generateSlug(updateData.name);
    }
    return await ModuleModel.findByIdAndUpdate(id, updateData);
  }

  static async deleteModule(id) {
    return await ModuleModel.softDelete(id);
  }
}
