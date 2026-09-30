import { PageController } from "@/src/controllers/page.controller.js";

export async function GET(req) {
  return PageController.list(req);
}
