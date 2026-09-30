import { CMSService } from "../services/cms.service.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createCMSSchema, updateCMSSchema } from "../validators/cms.validator.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { STATUS_CODES } from "../config/constants.js";

export class CMSController {
  static async create(req) {
    try {
      const body = await req.json();
      const { error, value } = validate(createCMSSchema, body);
      if (error) return error;

      const created = await CMSService.createCMS(value);
      return successResponse(created, "CMS content block created successfully.", STATUS_CODES.CREATED);
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async list(req) {
    try {
      const list = await CMSService.getCMSList();
      return successResponse(list, "CMS list fetched successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async getById(req, { params }) {
    try {
      const { id } = await params;
      const cms = await CMSService.getCMSById(id);
      if (!cms) return errorResponse("CMS not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(cms, "CMS fetched successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async update(req, { params }) {
    try {
      const { id } = await params;
      const body = await req.json();
      const { error, value } = validate(updateCMSSchema, body);
      if (error) return error;

      const updated = await CMSService.updateCMS(id, value);
      if (!updated) return errorResponse("CMS not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(updated, "CMS updated successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async delete(req, { params }) {
    try {
      const { id } = await params;
      const deleted = await CMSService.deleteCMS(id);
      if (!deleted) return errorResponse("CMS not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(deleted, "CMS deleted successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }
}
