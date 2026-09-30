import { PageSectionController } from "@/src/controllers/pageSection.controller.js";

export async function POST(req) {
  return PageSectionController.create(req);
}
