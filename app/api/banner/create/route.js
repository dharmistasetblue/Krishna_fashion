import { BannerController } from "@/src/controllers/banner.controller.js";

export async function POST(req) {
  return BannerController.create(req);
}
