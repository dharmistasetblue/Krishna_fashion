import { WebsiteService } from "../services/website.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { STATUS_CODES } from "../config/constants.js";

export class WebsiteController {
  static async getByMenuSlug(req, { params }) {
    try {
      const { slug } = await params;
      const data = await WebsiteService.getWebsiteByMenuSlug(slug);

      if (!data) {
        return errorResponse(`Page or menu not found for slug '${slug}'`, STATUS_CODES.NOT_FOUND);
      }

      return successResponse(data, "Website page fetched successfully.");
    } catch (err) {
      console.error("WebsiteController error:", err);
      return errorResponse(err.message || "Failed to fetch website data.", STATUS_CODES.INTERNAL_ERROR);
    }
  }

  static async getNavigation(req) {
    try {
      const tree = await WebsiteService.getPublicMenuTree();
      return successResponse(tree, "Navigation tree fetched successfully.");
    } catch (err) {
      return errorResponse("Failed to fetch navigation tree.", STATUS_CODES.INTERNAL_ERROR);
    }
  }
}
