import { ModuleController } from "@/src/controllers/module.controller.js";

export async function POST(req) {
  return ModuleController.create(req);
}
