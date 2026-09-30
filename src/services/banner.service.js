import { BannerModel } from "../config/database.js";

export class BannerService {
  static async createBanner(data) {
    if (!data.position) {
      const existing = await BannerModel.find({ pageId: data.pageId || null });
      data.position = existing.length + 1;
    }
    return await BannerModel.create(data);
  }

  static async getBannerList(query = {}) {
    const list = await BannerModel.find(query);
    list.sort((a, b) => (a.position || 0) - (b.position || 0));
    return list;
  }

  static async getBannerById(id) {
    return await BannerModel.findById(id);
  }

  static async updateBanner(id, updateData) {
    return await BannerModel.findByIdAndUpdate(id, updateData);
  }

  static async deleteBanner(id) {
    return await BannerModel.softDelete(id);
  }
}
