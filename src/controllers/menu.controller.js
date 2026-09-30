import { MenuService } from "../services/menu.service.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createMenuSchema, updateMenuSchema, reorderMenuSchema } from "../validators/menu.validator.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { STATUS_CODES } from "../config/constants.js";

export class MenuController {
  static async create(req) {
    try {
      const body = await req.json();
      const { error, value } = validate(createMenuSchema, body);
      if (error) return error;

      const created = await MenuService.createMenu(value);
      return successResponse(created, "Menu created successfully.", STATUS_CODES.CREATED);
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async list(req) {
    try {
      const list = await MenuService.getMenuList();
      return successResponse(list, "Menus list fetched successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async tree(req) {
    try {
      const tree = await MenuService.getMenuTree();
      return successResponse(tree, "Menu nested tree fetched successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async getById(req, { params }) {
    try {
      const { id } = await params;
      const item = await MenuService.getMenuById(id);
      if (!item) return errorResponse("Menu not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(item, "Menu fetched successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async update(req, { params }) {
    try {
      const { id } = await params;
      const body = await req.json();
      const { error, value } = validate(updateMenuSchema, body);
      if (error) return error;

      const updated = await MenuService.updateMenu(id, value);
      if (!updated) return errorResponse("Menu not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(updated, "Menu updated successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async delete(req, { params }) {
    try {
      const { id } = await params;
      const deleted = await MenuService.deleteMenu(id);
      if (!deleted) return errorResponse("Menu not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(deleted, "Menu deleted successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async reorder(req) {
    try {
      const body = await req.json();
      const { error, value } = validate(reorderMenuSchema, body);
      if (error) return error;

      const reordered = await MenuService.reorderMenus(value.menus);
      return successResponse(reordered, "Menus reordered successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }
}
