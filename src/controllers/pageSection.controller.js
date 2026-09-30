import { PageSectionService } from "../services/pageSection.service.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createPageSectionSchema, updatePageSectionSchema, reorderPageSectionSchema } from "../validators/pageSection.validator.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { STATUS_CODES } from "../config/constants.js";

export class PageSectionController {
  static async create(req) {
    try {
      const body = await req.json();
      const { error, value } = validate(createPageSectionSchema, body);
      if (error) return error;

      const created = await PageSectionService.createSection(value);
      return successResponse(created, "Page section created successfully.", STATUS_CODES.CREATED);
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async update(req, { params }) {
    try {
      const { id } = await params;
      const body = await req.json();
      const { error, value } = validate(updatePageSectionSchema, body);
      if (error) return error;

      const updated = await PageSectionService.updateSection(id, value);
      if (!updated) {
        return errorResponse("Section not found.", STATUS_CODES.NOT_FOUND);
      }

      return successResponse(updated, "Page section updated successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async delete(req, { params }) {
    try {
      const { id } = await params;
      const deleted = await PageSectionService.deleteSection(id);
      if (!deleted) {
        return errorResponse("Section not found.", STATUS_CODES.NOT_FOUND);
      }
      return successResponse(deleted, "Page section deleted successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async reorder(req) {
    try {
      const body = await req.json();
      const { error, value } = validate(reorderPageSectionSchema, body);
      if (error) return error;

      const reordered = await PageSectionService.reorderSections(value.pageId, value.sections);
      return successResponse(reordered, "Page sections reordered successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }
}
