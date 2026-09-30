import { ModuleController } from "@/src/controllers/module.controller.js";

export async function GET(req) {
  return ModuleController.list(req);
}
