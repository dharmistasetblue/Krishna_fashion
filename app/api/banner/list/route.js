import { BannerController } from "@/src/controllers/banner.controller.js";

export async function GET(req) {
  return BannerController.list(req);
}
