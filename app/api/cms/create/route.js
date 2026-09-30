import { CMSController } from "@/src/controllers/cms.controller.js";

export async function POST(req) {
  return CMSController.create(req);
}
