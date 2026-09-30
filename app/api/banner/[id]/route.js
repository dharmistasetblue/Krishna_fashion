import { BannerController } from "@/src/controllers/banner.controller.js";

export async function GET(req, context) {
  return BannerController.getById(req, context);
}

export async function PUT(req, context) {
  return BannerController.update(req, context);
}

export async function DELETE(req, context) {
  return BannerController.delete(req, context);
}
