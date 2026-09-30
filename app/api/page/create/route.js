import { PageController } from "@/src/controllers/page.controller.js";

export async function POST(req) {
  return PageController.create(req);
}
