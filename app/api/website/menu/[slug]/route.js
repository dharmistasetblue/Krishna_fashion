import { WebsiteController } from "@/src/controllers/website.controller.js";

export async function GET(req, context) {
  return WebsiteController.getByMenuSlug(req, context);
}
