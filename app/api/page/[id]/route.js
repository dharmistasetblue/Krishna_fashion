import { PageController } from "@/src/controllers/page.controller.js";

export async function GET(req, context) {
  return PageController.getById(req, context);
}

export async function PUT(req, context) {
  return PageController.update(req, context);
}

export async function DELETE(req, context) {
  return PageController.delete(req, context);
}
