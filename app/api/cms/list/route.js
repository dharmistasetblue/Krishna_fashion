import { CMSController } from "@/src/controllers/cms.controller.js";

export async function GET(req) {
  return CMSController.list(req);
}
