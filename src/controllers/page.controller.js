import { PageService } from "../services/page.service.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createPageSchema, updatePageSchema } from "../validators/page.validator.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { STATUS_CODES } from "../config/constants.js";

export class PageController {
  static async create(req) {
    try {
      const body = await req.json();
      const { error, value } = validate(createPageSchema, body);
      if (error) return error;

      const created = await PageService.createPage(value);
      return successResponse(created, "Page created successfully.", STATUS_CODES.CREATED);
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async list(req) {
    try {
      const list = await PageService.getPageList();
      return successResponse(list, "Pages fetched successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async getById(req, { params }) {
    try {
      const { id } = await params;
      const page = await PageService.getPageById(id);
      if (!page) return errorResponse("Page not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(page, "Page fetched successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async update(req, { params }) {
    try {
      const { id } = await params;
      const body = await req.json();
      const { error, value } = validate(updatePageSchema, body);
      if (error) return error;

      const updated = await PageService.updatePage(id, value);
      if (!updated) return errorResponse("Page not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(updated, "Page updated successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async delete(req, { params }) {
    try {
      const { id } = await params;
      const deleted = await PageService.deletePage(id);
      if (!deleted) return errorResponse("Page not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(deleted, "Page deleted successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }
}
