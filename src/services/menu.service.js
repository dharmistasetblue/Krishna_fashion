import { MenuModel } from "../config/database.js";
import { generateSlug } from "../utils/slug.js";

export class MenuService {
  static async createMenu(data) {
    if (!data.slug) {
      data.slug = generateSlug(data.name);
    }
    // Check for duplicate slug at same parent level if needed
    const existing = await MenuModel.findOne({ slug: data.slug });
    if (existing) {
      data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
    }

    if (!data.position) {
      const peers = await MenuModel.find({ parentId: data.parentId || null });
      data.position = peers.length + 1;
    }

    return await MenuModel.create(data);
  }

  static async getMenuList(query = {}) {
    const list = await MenuModel.find(query);
    list.sort((a, b) => (a.position || 0) - (b.position || 0));
    return list;
  }

  static async getMenuTree() {
    const all = await MenuModel.find({});
    all.sort((a, b) => (a.position || 0) - (b.position || 0));

    const map = {};
    const roots = [];

    all.forEach(m => {
      map[m._id] = { ...m, children: [] };
    });

    all.forEach(m => {
      if (m.parentId && map[m.parentId]) {
        map[m.parentId].children.push(map[m._id]);
      } else {
        roots.push(map[m._id]);
      }
    });

    return roots;
  }

  static async getMenuById(id) {
    return await MenuModel.findById(id);
  }

  static async updateMenu(id, updateData) {
    if (updateData.name && !updateData.slug) {
      updateData.slug = generateSlug(updateData.name);
    }
    return await MenuModel.findByIdAndUpdate(id, updateData);
  }

  static async deleteMenu(id) {
    // Also delete or orphan child menus
    const children = await MenuModel.find({ parentId: id });
    for (const child of children) {
      await MenuModel.softDelete(child._id);
    }
    return await MenuModel.softDelete(id);
  }

  static async reorderMenus(menuOrderArray) {
    const results = [];
    for (const item of menuOrderArray) {
      const updateData = { position: item.position };
      if (item.parentId !== undefined) {
        updateData.parentId = item.parentId;
      }
      const updated = await MenuModel.findByIdAndUpdate(item.menuId, updateData);
      if (updated) results.push(updated);
    }
    return results;
  }
}
