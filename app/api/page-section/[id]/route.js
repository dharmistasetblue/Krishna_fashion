import { PageSectionController } from "@/src/controllers/pageSection.controller.js";

export async function PUT(req, context) {
  return PageSectionController.update(req, context);
}

export async function DELETE(req, context) {
  return PageSectionController.delete(req, context);
}
