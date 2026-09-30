import { CMSController } from "@/src/controllers/cms.controller.js";

export async function GET(req, context) {
  return CMSController.getById(req, context);
}

export async function PUT(req, context) {
  return CMSController.update(req, context);
}

export async function DELETE(req, context) {
  return CMSController.delete(req, context);
}
