import { WebsiteController } from "@/src/controllers/website.controller.js";

export async function GET(req, context) {
  const { menuSlug } = await context.params;
  if (menuSlug === "navigation") {
    return WebsiteController.getNavigation(req);
  }
  return WebsiteController.getByMenuSlug(req, { params: Promise.resolve({ slug: menuSlug }) });
}
