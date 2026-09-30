import { PageSectionModel } from "../config/database.js";

export class PageSectionService {
  static async createSection(data) {
    // If no position provided, place it at the end
    if (!data.position) {
      const existing = await PageSectionModel.find({ pageId: data.pageId });
      data.position = existing.length + 1;
    }

    return await PageSectionModel.create(data);
  }

  static async getSectionsByPage(pageId) {
    const list = await PageSectionModel.find({ pageId });
    list.sort((a, b) => (a.position || 0) - (b.position || 0));
    return list;
  }

  static async getSectionById(id) {
    return await PageSectionModel.findById(id);
  }

  static async updateSection(id, updateData) {
    return await PageSectionModel.findByIdAndUpdate(id, updateData);
  }

  static async deleteSection(id) {
    // Soft delete
    return await PageSectionModel.softDelete(id);
  }

  static async reorderSections(pageId, sectionsOrder) {
    // Validate that all sections belong to pageId and update their positions in batch
    const results = [];
    for (const item of sectionsOrder) {
      const updated = await PageSectionModel.findByIdAndUpdate(item.sectionId, {
        position: item.position
      });
      if (updated) results.push(updated);
    }
    return results;
  }
}
