import { PageSectionController } from "@/src/controllers/pageSection.controller.js";

export async function PUT(req) {
  return PageSectionController.reorder(req);
}
