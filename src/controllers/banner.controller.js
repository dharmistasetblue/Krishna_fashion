import { BannerService } from "../services/banner.service.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createBannerSchema, updateBannerSchema } from "../validators/banner.validator.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { STATUS_CODES } from "../config/constants.js";

export class BannerController {
  static async create(req) {
    try {
      const body = await req.json();
      const { error, value } = validate(createBannerSchema, body);
      if (error) return error;

      const created = await BannerService.createBanner(value);
      return successResponse(created, "Banner created successfully.", STATUS_CODES.CREATED);
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async list(req) {
    try {
      const list = await BannerService.getBannerList();
      return successResponse(list, "Banners fetched successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async getById(req, { params }) {
    try {
      const { id } = await params;
      const banner = await BannerService.getBannerById(id);
      if (!banner) return errorResponse("Banner not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(banner, "Banner fetched successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async update(req, { params }) {
    try {
      const { id } = await params;
      const body = await req.json();
      const { error, value } = validate(updateBannerSchema, body);
      if (error) return error;

      const updated = await BannerService.updateBanner(id, value);
      if (!updated) return errorResponse("Banner not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(updated, "Banner updated successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async delete(req, { params }) {
    try {
      const { id } = await params;
      const deleted = await BannerService.deleteBanner(id);
      if (!deleted) return errorResponse("Banner not found.", STATUS_CODES.NOT_FOUND);
      return successResponse(deleted, "Banner deleted successfully.");
    } catch (err) {
      return errorResponse(err.message, STATUS_CODES.INTERNAL_ERROR);
    }
  }
}
