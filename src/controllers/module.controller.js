import { ModuleService } from "../services/module.service.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createModuleSchema, updateModuleSchema } from "../validators/module.validator.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { STATUS_CODES } from "../config/constants.js";

export class ModuleController {
  static async create(req) {
    try {
      const body = await req.json();
      const { error, value } = validate(createModuleSchema, body);
      if (error) return error;

      const created = await ModuleService.createModule(value);
      return successResponse(created, "Module created successfully.", STATUS_CODES.CREATED);
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async list(req) {
    try {
      const list = await ModuleService.getModuleList();
      return successResponse(list, "Modules fetched successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async getById(req, { params }) {
    try {
      const { id } = await params;
      const mod = await ModuleService.getModuleById(id);
      if (!mod) return errorResponse("Module not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(mod, "Module fetched successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async update(req, { params }) {
    try {
      const { id } = await params;
      const body = await req.json();
      const { error, value } = validate(updateModuleSchema, body);
      if (error) return error;

      const updated = await ModuleService.updateModule(id, value);
      if (!updated) return errorResponse("Module not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(updated, "Module updated successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async delete(req, { params }) {
    try {
      const { id } = await params;
      const deleted = await ModuleService.deleteModule(id);
      if (!deleted) return errorResponse("Module not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(deleted, "Module deleted successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }
}
