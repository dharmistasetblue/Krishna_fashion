import { BannerController } from "@/src/controllers/banner.controller.js";

export async function GET(req) {
  return BannerController.list(req);
}

export async function POST(req) {
  return BannerController.create(req);
}
