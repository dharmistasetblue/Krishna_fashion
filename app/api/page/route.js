import { PageController } from "@/src/controllers/page.controller.js";

export async function GET(req) {
  return PageController.list(req);
}

export async function POST(req) {
  return PageController.create(req);
}
