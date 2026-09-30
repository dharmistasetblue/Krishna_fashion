import { ModuleController } from "@/src/controllers/module.controller.js";

export async function GET(req) {
  return ModuleController.list(req);
}

export async function POST(req) {
  return ModuleController.create(req);
}
