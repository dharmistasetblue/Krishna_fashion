import { PageSectionController } from "@/src/controllers/pageSection.controller.js";

export async function GET(req) {
  return PageSectionController.list(req);
}

export async function POST(req) {
  return PageSectionController.create(req);
}
