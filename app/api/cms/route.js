import { CMSController } from "@/src/controllers/cms.controller.js";

export async function GET(req) {
  return CMSController.list(req);
}

export async function POST(req) {
  return CMSController.create(req);
}
